import cv2
import os
import base64
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
import threading
import time
from datetime import datetime
from dotenv import load_dotenv
import dlib

app = Flask(__name__)
CORS(app)  

dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path)

haarcascade_dir = os.path.join(os.path.dirname(__file__), 'Clasificadores')
face_cascade_path = os.path.join(haarcascade_dir, 'haarcascade_frontalface_default.xml')

if not os.path.exists(face_cascade_path):
    print(f"Error: archivo {face_cascade_path} no encontrado. Por favor, verifica la ruta.")
    exit(1)

face_cascade = cv2.CascadeClassifier(face_cascade_path)

#Aca se carga el clasificador el cual no servira para colocar la malla facial
landmark_predictor_path = os.path.join(haarcascade_dir, 'shape_predictor_68_face_landmarks.dat')
if not os.path.exists(landmark_predictor_path):
    print(f"Error: archivo {landmark_predictor_path} no encontrado. Por favor, verifica la ruta.")
    exit(1)

landmark_predictor = dlib.shape_predictor(landmark_predictor_path)
face_detector = dlib.get_frontal_face_detector()

#Validacion para ver que se haya inicializado correctamente el clasificador
if face_cascade.empty():
    print(f"Error: el clasificador no cargo correctamente desde {face_cascade_path}")
    exit(1)
else:
    print(f"Clasificador cargado correctamente desde {face_cascade_path}")

ultimo_estado = {
    'rostros_detectados': False,
    'hora': None,
    'ultima_imagen': None 
}

#Lo que se imprimira en consola para tener detalles de la ejecucion
def log():
    while True:
        time.sleep(2)
        ahora = datetime.now()
        estado = ultimo_estado['rostros_detectados']
        hora = ultimo_estado['hora']
        ultima_imagen = ultimo_estado['ultima_imagen']

        if ultima_imagen is None or (ahora - ultima_imagen).total_seconds() > 5:
            if estado:
                print(f"[{ahora.strftime('%Y-%m-%d %H:%M:%S')}] No se detectaron rostros (timeout de imagen).")
            ultimo_estado['rostros_detectados'] = False
            ultimo_estado['hora'] = None
            ultimo_estado['ultima_imagen'] = None
        else:
            hora_str = hora.strftime("%Y-%m-%d %H:%M:%S") if hora else "Nunca"
            if estado:
                print(f"[{hora_str}] Rostros detectados.")
            else:
                print(f"[{hora_str}] No se detectaron rostros.")

threading.Thread(target=log, daemon=True).start()


def deteccion_rostros(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_detector(gray)
    return faces


def malla_facial(image, faces):
    for face in faces:
        landmarks = landmark_predictor(image, face)
        
        for n in range(0, 68):
            x = landmarks.part(n).x
            y = landmarks.part(n).y
            cv2.circle(image, (x, y), 1, (255, 0, 39), -1)

        for i in range(1, 17):
            x1, y1 = landmarks.part(i-1).x, landmarks.part(i-1).y
            x2, y2 = landmarks.part(i).x, landmarks.part(i).y
            cv2.line(image, (x1, y1), (x2, y2), (2, 64, 150), 1)

    return image

@app.route('/capture', methods=['POST'])
def capture():
    data = request.get_json()
    image_data = data.get('image', '')

    if not image_data:
        return jsonify({"error": "No se recibio imagen"}), 400
    try:
        img_bytes = base64.b64decode(image_data)
        np_img = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        if frame is None:
            return jsonify({"error": "No se pudo decodificar la imagen correctamente."}), 400
        print(f"Imagen recibida con dimensiones: {frame.shape}")
    except Exception as e:
        return jsonify({"error": f"Error al decodificar imagen: {e}"}), 400

    faces = deteccion_rostros(frame)
    rostros_totales = len(faces)

    if rostros_totales > 0:
        print("Se detectó un rostro exitosamente en la fotografia.")
    else:
        print("No se detectaron rostros en la fotografia.")

    ultimo_estado['rostros_detectados'] = rostros_totales > 0
    ultimo_estado['hora'] = datetime.now()
    ultimo_estado['ultima_imagen'] = datetime.now()

    for face in faces:
        cv2.rectangle(frame, (face.left(), face.top()), (face.right(), face.bottom()), (0, 255, 0), 2)

    frame_with_landmarks = malla_facial(frame, faces)

    print(f"Rostros detectados: {rostros_totales}")

    _, buffer = cv2.imencode('.jpg', frame_with_landmarks)
    frame_b64 = base64.b64encode(buffer).decode('utf-8')

    detections = [[int(face.left()), int(face.top()), int(face.width()), int(face.height())] for face in faces]

    return jsonify({
        "image": frame_b64,
        "detections": detections
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT_PYTHON'))
    print("La API funciona correctamente.")
    print(f"La API esta corriendo en el puerto {port}.")
    app.run(debug=True, host='0.0.0.0', port=port)