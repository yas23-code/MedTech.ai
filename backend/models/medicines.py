import re

# Expanded medicine dataset with descriptions for "AI Explainer" feature
MEDICINE_DETAILS = {
    "Paracetamol": "Used for fever and mild to moderate pain relief.",
    "Ibuprofen": "An anti-inflammatory drug used for pain and swelling.",
    "Amoxicillin": "An antibiotic used to treat bacterial infections.",
    "Metformin": "A medication to manage blood sugar levels in Type 2 Diabetes.",
    "Amlodipine": "Used to treat high blood pressure (hypertension).",
    "Pantoprazole": "A proton pump inhibitor used to reduce stomach acid.",
    "Pantocid": "Used for acidity, heartburn, and stomach ulcers.",
    "Montair": "Used to prevent asthma symptoms and allergic rhinitis.",
    "Dolo": "Very common for fever and body ache relief.",
    "Amoxicallum": "A specific antibiotic variant for bacterial infections.",
    "Amoxycillin": "Broad-spectrum antibiotic for infections.",
    "Cetirizine": "An antihistamine used for allergy relief (sneezing/runny nose).",
    "Azithromycin": "Antibiotic used for various bacterial infections like pneumonia.",
    "Limcee": "Vitamin C supplement to boost immunity.",
    "Combiflam": "Combo of Ibuprofen and Paracetamol for strong pain relief.",
    "Augmentin": "Powerful antibiotic combo for tough bacterial infections.",
    "Telma": "Used to control high blood pressure.",
    "Glycomet": "Helps control blood sugar levels in diabetic patients.",
    "Thyronorm": "Used for thyroid hormone replacement (hypothyroidism).",
    "Liv52": "Ayurvedic liver supplement for better liver health.",
    "Shelcal": "Calcium and Vitamin D3 supplement for bone health.",
    "Digene": "Antacid used to relieve acidity and gas.",
    "Zinetac": "Reduces stomach acid to treat heartburn and ulcers.",
    "Rantac": "Effective for acidity and stomach gas issues.",
    "Saridon": "Fast-acting headache relief tablet.",
    "Crocin": "Commonly used for fever and pain.",
    "Pan 40": "Used for gastric acidity and stomach protection.",
    "Tramadol": "Strong painkiller used for moderate to severe pain."
}

# The list of names for matching
MEDICINE_DATASET = list(MEDICINE_DETAILS.keys())

def get_medicine_info(medicine_name):
    """Returns the description of a medicine if found."""
    return MEDICINE_DETAILS.get(medicine_name, "Medicine information currently not available.")

def extract_medicines(text):
    """Search for medicines in text using substring matching."""
    found_medicines = []
    text_lower = text.lower()
    for medicine in MEDICINE_DATASET:
        if medicine.lower() in text_lower:
            found_medicines.append(medicine)
    return found_medicines
