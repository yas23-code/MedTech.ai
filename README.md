# MedTech AI: Smart Prescription Scanner ⚕️

MedTech AI is a full-stack application designed to convert messy handwritten doctor prescriptions into structured digital text. It uses OpenCV for image preprocessing, Pytesseract for OCR, and custom NLP logic for medicine extraction.

## 🚀 Key Features
- **Image Preprocessing**: Enhances contrast and removes noise from prescription images.
- **OCR Integration**: Extracts raw text from handwriting.
- **Digital Extraction**: Matches extracted text against a curated medicine dataset.
- **Modern UI**: Clean, responsive frontend for easy uploading and viewing results.

## 📁 Project Structure
```text
medtech-ai/
├── backend/
│   ├── app.py              # Flask Main API
│   ├── services/
│   │   ├── preprocessing.py # OpenCV Preprocessing
│   │   ├── ocr.py           # Text Extraction
│   │   └── nlp.py           # Text Cleaning & Extraction
│   └── models/
│       └── medicines.py     # Medicine Dataset
├── frontend/
│   ├── index.html          # UI Layout
│   ├── style.css           # Modern Aesthetics
│   └── script.js           # Frontend Logic
├── requirements.txt         # Dependencies
└── README.md                # Documentation
```

## 🛠️ Setup Instructions

### 1. Prerequisites (IMPORTANT)
This project uses **Tesseract-OCR**. You must install it on your system:
- **Windows**: Download and install from [UB-Mannheim/tesseract](https://github.com/UB-Mannheim/tesseract/wiki). After installing, ensure the path is added to your environment variables or path.
- **Linux**: `sudo apt install tesseract-ocr`
- **Mac**: `brew install tesseract`

### 2. Backend Setup
1. Open a terminal in the project root.
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Flask Server:
   ```bash
   python backend/app.py
   ```
   The backend will be live at `http://127.0.0.1:5000`.

### 3. Frontend Setup
1. Simply open `frontend/index.html` in your web browser (Chrome, Firefox, or Edge).
2. Upload a prescription image and click **Start Analysis**.

## 🧪 Medicine Dataset
The extraction logic currently looks for these predefined medicines:
- Paracetamol, Ibuprofen, Amoxicillin, Metformin, Amlodipine, and 25+ others.
- You can add more in `backend/models/medicines.py`.

## 💡 Tips for Better Accuracy
- Ensure good lighting when taking the photo.
- Keep the prescription flat.
- Handwriting clarity significantly affects OCR results.
