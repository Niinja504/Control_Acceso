from flask import Flask, request, jsonify
import face_recognition as fr
import numpy as np
import os
from pymongo import MongoClient
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

load_dotenv()
DB_URI = os.getenv('DB_URI')
MAPEO_API_KEY = os.getenv("MAPEO_API_KEY")
cliente = MongoClient(DB_URI)
base_de_datos = cliente['PTC_2025']
coleccion_de_caras = base_de_datos['Faces']

app = Flask(__name__)
UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def Mapeo_cara(ruta_imagen):
    try:
        imagen = fr.load_image_file(ruta_imagen)
        ubicaciones_caras = fr.face_locations(imagen)
        if not ubicaciones_caras:
            raise ValueError("No se detectaron rostros")
        codificacion = fr.face_encodings(imagen, ubicaciones_caras)[0]
        return codificacion
    except Exception as e:
        print(f"Error al procesar la imagen {ruta_imagen}: {e}")
        return None

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

@app.route('/mapeo', methods=['POST'])
@require_api_key(MAPEO_API_KEY)
def mapeo():
    if 'file' not in request.files:
        return jsonify({'error': 'No se ha enviado un archivo'}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No se seleccionó un archivo'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        codificacion = Mapeo_cara(file_path)
        
        if codificacion is not None:
            if coleccion_de_caras.find_one({'filename': filename}):
                return jsonify({'message': f'Rostro ya existente para {filename}'}), 200

            documento_cara = {
                'filename': filename,
                'encoding': codificacion.tolist()
            }
            coleccion_de_caras.insert_one(documento_cara)
            return jsonify({
                'message': f'Rostro procesado y guardado para {filename}',
                'encoding': codificacion.tolist()
            }), 200
        else:
            return jsonify({'error': 'No se pudo extraer el vector de la cara'}), 400

    return jsonify({'error': 'Archivo no permitido'}), 400

def iniciar_api_mapeo():
    port = int(os.getenv('PORT_MAPEO'))
    app.run(debug=True, use_reloader=False, host='0.0.0.0', port=port)