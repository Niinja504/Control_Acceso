import face_recognition as fr
import numpy as np
import os
from pymongo import MongoClient
from dotenv import load_dotenv
import sys

# Configuración para la conexión a la base de datos
#####################################################
load_dotenv()
DB_URI = os.getenv('DB_URI')
cliente = MongoClient(DB_URI)
base_de_datos = cliente['PTC_2025']
coleccion_de_caras = base_de_datos['Faces']
#####################################################

Directorio_Fotos = "./IMG"

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
        sys.exit()  # Se detiene el proceso si es que hay un error

def Procesar_imagen(nombre_archivo):
    try:
        ruta_imagen = os.path.join(Directorio_Fotos, nombre_archivo)
        if coleccion_de_caras.find_one({'filename': nombre_archivo}):
            print(f"Rostro ya existente para {nombre_archivo}", end="\r")
            return
        codificacion = Mapeo_cara(ruta_imagen)
        if codificacion is not None:
            documento_cara = {
                'filename': nombre_archivo,
                'encoding': codificacion.tolist()
            }
            coleccion_de_caras.insert_one(documento_cara)
            print(f"Vector guardado en la base de datos: {nombre_archivo}", end="\r")
        else:
            print(f"No se pudo extraer el vector de 128 puntos: {nombre_archivo}", end="\r")

    except Exception as e:
        print(f"Error procesando la imagen {nombre_archivo}: {e}")
        sys.exit() 


def Procesar_imagenes():
    nombres_archivos = [f for f in os.listdir(Directorio_Fotos) if f.endswith(".jpg") or f.endswith(".png")]
    for nombre_archivo in nombres_archivos:
        Procesar_imagen(nombre_archivo)
    print("P")

def main():
    Procesar_imagenes()

if __name__ == "__main__":
    main()