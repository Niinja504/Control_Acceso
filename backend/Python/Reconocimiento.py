import cv2
import os
import base64
import numpy as np
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import threading
import time
from datetime import datetime
from dotenv import load_dotenv
import dlib
import face_recognition
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env')
load_dotenv(dotenv_path)

RECONOCIMIENTO_API_KEY = os.getenv("RECONOCIMIENTO_API_KEY")
mongo_uri = os.getenv("DB_URI")
port = int(os.getenv('PORT_RECONOCIMIENTO'))

webcam_en_uso = False
webcam_lock = threading.Lock()

haarcascade_dir = os.path.join(os.path.dirname(__file__), 'Clasificadores')
face_cascade_path = os.path.join(haarcascade_dir, 'haarcascade_frontalface_default.xml')
landmark_predictor_path = os.path.join(haarcascade_dir, 'shape_predictor_68_face_landmarks.dat')

if not os.path.exists(face_cascade_path) or not os.path.exists(landmark_predictor_path):
    exit(1)

face_cascade = cv2.CascadeClassifier(face_cascade_path)
landmark_predictor = dlib.shape_predictor(landmark_predictor_path)
face_detector = dlib.get_frontal_face_detector()

ultimo_estado = {'rostros_detectados': False, 'hora': None, 'ultima_imagen': None}

def require_api_key(expected_key):
    def decorator(f):
        def wrapper(*args, **kwargs):
            auth = request.headers.get('Authorization')
            if not auth or not auth.startswith("Bearer "):
                return jsonify({"error": "API Key faltante o inválida"}), 401
            token = auth.split(" ")[1]
            if token != expected_key:
                return jsonify({"error": "API Key inválida"}), 403
            return f(*args, **kwargs)
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator

def log():
    while True:
        time.sleep(2)
        ahora = datetime.now()
        if ultimo_estado['ultima_imagen'] is None or (ahora - ultimo_estado['ultima_imagen']).total_seconds() > 5:
            if ultimo_estado['rostros_detectados']:
                print(f"[{ahora.strftime('%Y-%m-%d %H:%M:%S')}] No se detectaron rostros (timeout).")
            ultimo_estado.update({'rostros_detectados': False, 'hora': None, 'ultima_imagen': None})
        else:
            hora_str = ultimo_estado['hora'].strftime("%Y-%m-%d %H:%M:%S") if ultimo_estado['hora'] else "Nunca"
            print(f"[{hora_str}] {'Rostros detectados' if ultimo_estado['rostros_detectados'] else 'No se detectaron rostros'}.")

threading.Thread(target=log, daemon=True).start()

def deteccion_rostros(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    return face_detector(gray)

def malla_facial(image, faces, padding=10):
    for face in faces:
        left, top, right, bottom = face.left() - padding, face.top() - padding, face.right() + padding, face.bottom() + padding
        cv2.rectangle(image, (left, top), (right, bottom), (0, 255, 0), 2)
        landmarks = landmark_predictor(image, face)
        for n in range(0, 68):
            x, y = landmarks.part(n).x, landmarks.part(n).y
            cv2.circle(image, (x, y), 1, (255, 0, 39), -1)
        for i in range(1, 17):
            x1, y1 = landmarks.part(i - 1).x, landmarks.part(i - 1).y
            x2, y2 = landmarks.part(i).x, landmarks.part(i).y
            cv2.line(image, (x1, y1), (x2, y2), (2, 64, 150), 1)
    return image

@app.route('/capture', methods=['POST'])
@require_api_key(RECONOCIMIENTO_API_KEY)
def capture():
    global webcam_en_uso
    with webcam_lock:
        if webcam_en_uso:
            return jsonify({"error": "La webcam esta en uso por otro proceso."}), 409
        webcam_en_uso = True

    try:
        data = request.get_json()
        image_data = data.get('image', '')
        if not image_data:
            return jsonify({"error": "No se recibió imagen"}), 400

        img_bytes = base64.b64decode(image_data)
        np_img = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        if frame is None:
            return jsonify({"error": "No se pudo decodificar la imagen."}), 400

        faces = deteccion_rostros(frame)
        rostro_detectado = len(faces) > 0

        print("Se detectó un rostro." if rostro_detectado else "No se detectaron rostros.")
        ultimo_estado.update({
            'rostros_detectados': rostro_detectado,
            'hora': datetime.now(),
            'ultima_imagen': datetime.now()
        })

        frame = malla_facial(frame, faces)
        _, buffer = cv2.imencode('.png', frame)
        frame_b64 = base64.b64encode(buffer).decode('utf-8')
        detections = [[int(face.left()), int(face.top()), int(face.width()), int(face.height())] for face in faces]

        return jsonify({"image": frame_b64, "detections": detections})
    finally:
        webcam_en_uso = False


mongo_client = MongoClient(mongo_uri)
db = mongo_client["PTC_2025"]
collection = db["Faces"]


known_encodings_global = []
known_ids_global = []

def obtener_encodings_desde_db():
    documentos = collection.find({})
    encodings = []
    ids = []
    for doc in documentos:
        if "encoding" in doc and isinstance(doc["encoding"], list):
            encodings.append(np.array(doc["encoding"]))
            ids.append(str(doc["_id"]))
    return encodings, ids

def cargar_encodings_en_memoria():
    global known_encodings_global, known_ids_global
    known_encodings_global, known_ids_global = obtener_encodings_desde_db()
    print(f"[INFO] Se cargaron {len(known_encodings_global)} encodings desde MongoDB.")

def generar_frames():
    global webcam_en_uso
    with webcam_lock:
        if webcam_en_uso:
            print("Camara ya en uso. Abortando streaming.")
            return
        webcam_en_uso = True

    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    cap.set(cv2.CAP_PROP_FPS, 30)

    if not cap.isOpened():
        webcam_en_uso = False
        return

    known_encodings = known_encodings_global
    known_ids = known_ids_global

    try:
        fps = 0
        frame_count = 0
        start_time = time.time()
        frame_index = 0
        process_every_n_frames = 10

        face_locations = []
        face_encodings = []

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            if frame_index % process_every_n_frames == 0:
                face_locations = face_recognition.face_locations(rgb_frame)
                face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

            for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 1)
                if known_encodings:
                    distances = np.linalg.norm(np.array(known_encodings) - face_encoding, axis=1)
                    min_distance = np.min(distances)
                    best_match_index = np.argmin(distances)
                    if min_distance < 0.5:
                        person_id = known_ids[best_match_index]
                        cv2.putText(frame, f"ID: {person_id}", (left, top - 10),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 0), 1)
                    else:
                        cv2.putText(frame, "Desconocido", (left, top - 10),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 0, 255), 1)

            frame_index += 1
            frame_count += 1
            elapsed_time = time.time() - start_time
            if elapsed_time >= 1.0:
                fps = frame_count / elapsed_time
                frame_count = 0
                start_time = time.time()

            cv2.putText(frame, f"FPS: {fps:.2f}", (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 255), 2)

            _, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
    finally:
        cap.release()
        webcam_en_uso = False

@app.route('/video-capture')
def realtime_face_recognition():
    return Response(generar_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

def iniciar_api_reconocimiento():
    cargar_encodings_en_memoria()
    print("La API de reconocimiento facial está activa.")
    app.run(debug=True, use_reloader=False, host='0.0.0.0', port=port)