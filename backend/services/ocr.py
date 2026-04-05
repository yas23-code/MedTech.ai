import easyocr
import numpy as np

# Initialize the reader once for efficiency (English only)
reader = easyocr.Reader(['en'])

def extract_text_from_image(preprocessed_image):
    """
    Extract text using EasyOCR (much better for handwriting).
    Note: EasyOCR works best with original images or lightly processed ones.
    """
    try:
        # EasyOCR can take a numpy array directly (OpenCV image)
        results = reader.readtext(preprocessed_image)
        
        # Combine all detected text blocks into a single string
        extracted_text = " ".join([res[1] for res in results])
        
        return extracted_text
    except Exception as e:
        print(f"EasyOCR error: {e}")
        return f"Error: {str(e)}"
