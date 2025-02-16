from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from deepface import DeepFace

app = Flask(__name__)
CORS(app)

# Load Haarcascade untuk deteksi wajah
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

@app.route('/predict', methods=['POST'])
def predict_age():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    file_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({'error': 'Invalid image'}), 400

    # Konversi ke grayscale dan deteksi wajah
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    if len(faces) == 0:
        return jsonify({'error': 'No face detected'}), 400

    x, y, w, h = faces[0]  # Ambil wajah pertama
    cropped_face = img[y:y+h, x:x+w]
    resized_face = cv2.resize(cropped_face, (200, 200))

    try:
        # Prediksi usia dengan DeepFace
        result = DeepFace.analyze(img_path=resized_face, actions=['age'], enforce_detection=False)
        predicted_age = result[0]['age']
        return jsonify({'age': predicted_age})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
