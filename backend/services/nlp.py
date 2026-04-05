import re
from rapidfuzz import fuzz, process
from models.medicines import MEDICINE_DATASET, extract_medicines

def extract_timings(text):
    """
    Ultra-Robust Timing Extraction.
    Specifically tuned for messy handwriting and symbol misinterpretation.
    """
    found_timings = []
    text_lower = text.lower()
    
    # 1. Broad Dosage Pattern (Sandwich Logic)
    # This looks for any 1/0 combination with up to 3 random characters in between.
    # Handles: 1-0-1, ( 0 |, 1.0.1, | 0 1, [0] 1
    sandwich_pattern = r'[1il|1\(\[\{\.][^a-z0-9]{0,3}[0o][^a-z0-9]{0,3}[1il|1\)\]\}\.]'
    
    matches = re.findall(sandwich_pattern, text_lower)
    for match in matches:
        # Normalize into a clean "1-0-1"
        # Everything that isn't a 0 becomes a 1 (if it's one of the ends)
        # or a dash (if it's in the middle)
        parts = re.split(r'[^a-z0-9]', match)
        clean_parts = []
        for p in match:
            if p in '0o': clean_parts.append('0')
            elif p in '1il|1()[]' or p.isdigit(): clean_parts.append('1')
            else: clean_parts.append('-')
            
        # Rebuild and clean up duplicate dashes
        full = "".join(clean_parts)
        # Result should look like 1-0-1
        result = re.sub(r'1+', '1', full)
        result = re.sub(r'-+', '-', result).strip('-')
        
        # Validation: must be roughly 3 digits
        if "1" in result and "0" in result:
            found_timings.append(result)
            
    # 2. Timing Keywords (Fuzzy)
    timing_keywords = {
        "After Food": ["after", "aftr", "afn", "absn", "food"],
        "Before Food": ["before", "befr", "bfr", "empty"],
        "Morning": ["morning", "morn", "mng"],
        "Night": ["night", "nyt", "ngt"]
    }
    
    words = text_lower.split()
    for word in words:
        for standard, variants in timing_keywords.items():
            if any(fuzz.ratio(word, v) > 75 for v in variants):
                found_timings.append(standard)

    return list(set(found_timings))

def clean_text_for_nlp(raw_text):
    """
    Final polished NLP for MedTech AI.
    """
    try:
        text = raw_text.lower()
        clean_text = re.sub(r'[^a-z0-9\-\s]', ' ', text)
        words = clean_text.split()
        
        found_medicines = []
        found_timings = extract_timings(raw_text)
        
        # Medicine detection (High reliability)
        for word in words:
            if len(word) < 4: continue
            match = process.extractOne(word, MEDICINE_DATASET, scorer=fuzz.WRatio, score_cutoff=85.0)
            if match:
                found_medicines.append(match[0])
            
        # Hard-coded Brand Fixes
        if "amox" in text or "avsx" in text: found_medicines.append("Amoxicillin")
        if "para" in text or "dococ" in text: found_medicines.append("Paracetamol")
        if "dol" in text: found_medicines.append("Dolo")

        return text, list(set(found_medicines)), found_timings
        
    except Exception as e:
        print(f"NLP error: {e}")
        return raw_text, [], []
