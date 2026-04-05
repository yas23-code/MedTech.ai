import pytesseract
from PIL import Image

def extract_text_from_image(image):
    """
    Extract text using PyTesseract (much lighter for limited RAM).
    Expects a preprocessed PIL Image or a numpy array.
    """
    try:
        # Convert to PIL if image is a numpy array (common from OpenCV)
        if not isinstance(image, Image.Image):
            image = Image.fromarray(image)
        
        # Simple extraction of text from image
        extracted_text = pytesseract.image_to_string(image)
        
        return extracted_text
    except Exception as e:
        print(f"Tesseract OCR error: {e}")
        return f"Error: {str(e)}"
