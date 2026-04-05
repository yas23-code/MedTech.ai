# Use a lightweight Python image
FROM python:3.11-slim

# 1. Install system dependencies (Tesseract is the key!)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# 2. Set working directory
WORKDIR /app

# 3. Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy the rest of the backend code
COPY . .

# 5. Start the server
# Render uses port 10000 or the $PORT environment variable
CMD ["gunicorn", "--bind", "0.0.0.0:10000", "app:app"]
