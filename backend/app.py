from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import os

# Import our custom components
from services.preprocessing import preprocess_image
from services.ocr import extract_text_from_image
from services.nlp import clean_text_for_nlp
from models.medicines import get_medicine_info

app = Flask(__name__)
# Enable CORS for frontend integration
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint to process prescription image and return structured data.
    Now includes Medicine Extraction + Timings + Explanations.
    """
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part in the request'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected for upload'}), 400
        
        # Convert file buffer to OpenCV image
        file_bytes = np.frombuffer(file.read(), np.uint8)
        image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        
        if image is None:
            return jsonify({'error': 'Invalid image file provided'}), 400
        
        # 1. Image OCR (Using EasyOCR)
        raw_text = extract_text_from_image(image)
        
        # 2. NLP (Clean Text, Fuzzy Medicine Match, and Timings)
        clean_text, medicines, timings = clean_text_for_nlp(raw_text)
        
        # 3. Medicine Explainer (Generate info for each match)
        explanations = {}
        for med in medicines:
            explanations[med] = get_medicine_info(med)
        
        # Build JSON Output
        response = {
            'raw_text': raw_text.strip(),
            'clean_text': clean_text,
            'medicines': sorted(list(set(medicines))),
            'timings': sorted(list(set(timings))),
            'explanations': explanations # Include the AI Explainer data
        }
            
        return jsonify(response)
    
    except Exception as e:
        print(f"Backend error: {e}")
        return jsonify({'error': f"Error: {str(e)}"}), 500

@app.route('/', methods=['GET'])
def index():
    return "MedTech AI with Timings is live!"

if __name__ == '__main__':
    # Running on local development server
    app.run(debug=True, port=5000)
