import cv2
import os
from flask import Flask, jsonify, request

app = Flask(__name__)

# Ruta de la carpeta que contiene los clasificadores Haar
haarcascade_dir = './Clasificadores/'

# Archivos de clasificadores que vamos a cargar
classifier_files = [
    'haarcascade_frontalface_default.xml',
    'haarcascade_frontalface_alt2.xml',
    'haarcascade_frontalface_alt.xml',
    'haarcascade_profileface.xml',
    'haarcascade_eye.xml',
    'haarcascade_smile.xml'
]

# Cargamos los clasificadores Haar en un diccionario
classifiers = {}

# Verificamos si los archivos existen y los cargamos
for classifier_file in classifier_files:
    classifier_path = os.path.join(haarcascade_dir, classifier_file)
    if os.path.exists(classifier_path):
        classifiers[classifier_file] = cv2.CascadeClassifier(classifier_path)
    else:
        print(f"Advertencia: El archivo {classifier_file} no se encuentra en la ruta: {classifier_path}")

# Función para detectar rostros y otras características en una imagen usando los clasificadores Haar
def detect_faces(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    detections = {}

    # Detectar rostros frontales
    faces = classifiers['haarcascade_frontalface_default.xml'].detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    detections['frontal_faces'] = faces

    # Detectar otros tipos de rostros (frontal con variaciones)
    alt_faces = classifiers['haarcascade_frontalface_alt2.xml'].detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    detections['alt_faces'] = alt_faces

    alt_faces_2 = classifiers['haarcascade_frontalface_alt.xml'].detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    detections['alt_faces_2'] = alt_faces_2

    # Detectar rostros de perfil
    profile_faces = classifiers['haarcascade_profileface.xml'].detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    detections['profile_faces'] = profile_faces

    # Detectar ojos
    eyes = classifiers['haarcascade_eye.xml'].detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    detections['eyes'] = eyes

    # Detectar sonrisas
    smiles = classifiers['haarcascade_smile.xml'].detectMultiScale(gray, scaleFactor=1.8, minNeighbors=20, minSize=(25, 25))
    detections['smiles'] = smiles

    return detections

# Ruta para capturar la imagen desde la webcam
@app.route('/capture', methods=['GET'])
def capture():
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    cap.release()

    if not ret:
        return jsonify({"error": "No se pudo acceder a la cámara"}), 500
    
    detections = detect_faces(frame)

    # Dibujar los resultados sobre la imagen (si se detectan rostros, ojos, etc.)
    for label, objects in detections.items():
        for (x1, y1, w, h) in objects:
            if label in ['frontal_faces', 'alt_faces', 'alt_faces_2', 'profile_faces']:  # Para rostros, dibujamos un rectángulo verde
                cv2.rectangle(frame, (x1, y1), (x1 + w, y1 + h), (0, 255, 0), 2)
            elif label == 'eyes':  # Para ojos, dibujamos un rectángulo azul
                cv2.rectangle(frame, (x1, y1), (x1 + w, y1 + h), (255, 0, 0), 2)
            elif label == 'smiles':  # Para sonrisas, dibujamos un rectángulo rojo
                cv2.rectangle(frame, (x1, y1), (x1 + w, y1 + h), (0, 0, 255), 2)

    # Convertimos la imagen en un formato adecuado para enviar por HTTP (base64)
    _, buffer = cv2.imencode('.jpg', frame)
    frame_b64 = buffer.tobytes()

    return jsonify({"message": "Características detectadas", "detections": detections, "image": frame_b64.hex()})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
