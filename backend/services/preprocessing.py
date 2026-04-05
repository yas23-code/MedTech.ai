import cv2
import numpy as np

def preprocess_image(input_image):
    """
    Preprocess image for better OCR results.
    Steps:
    1. Grayscale
    2. Gaussian Blur (noise reduction)
    3. Otsu's Thresholding (binarization)
    """
    try:
        # Convert image to grayscale
        gray = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)
        
        # Apply slight blur to reduce noise before thresholding
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # Apply Otsu's thresholding for binarization (black and white)
        _, thresholded = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        return thresholded
    except Exception as e:
        print(f"Preprocessing error: {e}")
        # If preprocessing fails, return original image (converted to grayscale)
        return cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)
