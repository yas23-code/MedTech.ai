document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize UI Elements (Navigation & Views)
    const scanView = document.getElementById('scan-view');
    const resultsView = document.getElementById('results-view');
    const resultsSection = resultsView; // for backward compatibility

    // 2. Initialize UI Elements (Buttons & Actions)
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    const calendarBtn = document.getElementById('calendar-btn');
    const langSelector = document.getElementById('language-selector');
    const mapsBtn = document.getElementById('maps-btn');
    const shopBtn = document.getElementById('shop-btn');
    const backBtn = document.getElementById('back-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    const uploadBtn = document.getElementById('upload-btn');

    // 3. Initialize UI Elements (Scanner UI)
    const fileInput = document.getElementById('file-input');
    const dropArea = document.getElementById('drop-area');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const medicineListEl = document.getElementById('medicine-list');
    const noMedicinesEl = document.getElementById('no-medicines');
    const loader = document.getElementById('loader');

    let currentFile = null;
    let scanResults = null;

    // Translation Dictionary
    const dictionary = {
        'hi': {
            'After Food': 'खाने के बाद',
            'Before Food': 'खाने से पहले',
            'Morning': 'सुबह',
            'Night': 'रात',
            'Detected Medicines': 'पहचानी गई दवाइयां',
            'Used for fever and mild to moderate pain relief.': 'बुखार और हल्के से मध्यम दर्द से राहत के लिए उपयोग किया जाता है।',
            'Very common for fever and body ache relief.': 'बुखार और शरीर के दर्द से राहत के लिए बहुत आम है।',
            'An antibiotic used to treat bacterial infections.': 'बैक्टीरिया के संक्रमण के इलाज के लिए एक एंटीबायोटिक।',
            'Medicine information currently not available.': 'दवा की जानकारी अभी उपलब्ध नहीं है।'
        }
    };

    langSelector.addEventListener('change', () => {
        if (scanResults) displayResults(scanResults);
    });

    // 1. Basic event listeners for file picking
    uploadBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFileSelect(file);
    });

    // 2. Drag & Drop handling (skipped for brevity)
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) { e.preventDefault(); e.stopPropagation(); }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'), false);
    });

    dropArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        handleFileSelect(file);
    });

    // 3. Image preview and validation
    function handleFileSelect(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }

        currentFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            previewContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }

    const API_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
        ? 'http://127.0.0.1:5000'
        : 'YOUR_RENDER_BACKEND_URL'; // Update this after deploying backend

    // 4. API Request to Backend
    analyzeBtn.addEventListener('click', async () => {
        if (!currentFile) return;

        showLoader(true);

        const formData = new FormData();
        formData.append('file', currentFile);

        try {
            const response = await fetch(`${API_URL}/predict`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Prediction failed');
            }

            const data = await response.json();
            scanResults = data;

            // NAVIGATION: Hide Scan, Show Results
            scanView.classList.add('hidden');
            resultsView.classList.remove('hidden');

            displayResults(data);

            // Show result-only header buttons
            downloadPdfBtn.classList.remove('hidden');
            mapsBtn.classList.remove('hidden');
            if (data.medicines && data.medicines.length > 0) shopBtn.classList.remove('hidden');
            if (data.timings && data.timings.length > 0) calendarBtn.classList.remove('hidden');

        } catch (error) {
            console.error('Error:', error);
            alert('Error analyzing prescription: ' + error.message);
        } finally {
            showLoader(false);
        }
    });

    // Back Button: Reset UI
    backBtn.addEventListener('click', () => {
        resultsView.classList.add('hidden');
        scanView.classList.remove('hidden');
        downloadPdfBtn.classList.add('hidden');
        mapsBtn.classList.add('hidden');
        shopBtn.classList.add('hidden');
        calendarBtn.classList.add('hidden');

        // Clear previous scan for clean start
        imagePreview.src = "";
        previewContainer.classList.add('hidden');
        currentFile = null;
    });

    // 5. Build and Show results
    function displayResults(data) {
        const lang = langSelector.value;
        const translate = (text) => (dictionary[lang] && dictionary[lang][text]) ? dictionary[lang][text] : text;

        // Populate Medicines
        medicineListEl.innerHTML = '';
        if (data.medicines && data.medicines.length > 0) {
            data.medicines.forEach(medicine => {
                const li = document.createElement('li');
                li.style.flexDirection = 'column';
                li.style.alignItems = 'flex-start';

                const nameSpan = document.createElement('span');
                nameSpan.innerHTML = `<strong>${medicine}</strong>`;

                const descSpan = document.createElement('span');
                descSpan.style.fontSize = '0.8rem';
                descSpan.style.color = '#555';
                descSpan.style.fontWeight = '400';

                const originalDesc = data.explanations[medicine] || "Medicine information available.";
                descSpan.textContent = translate(originalDesc);

                li.appendChild(nameSpan);
                li.appendChild(descSpan);
                medicineListEl.appendChild(li);
            });
            noMedicinesEl.classList.add('hidden');
        } else {
            noMedicinesEl.classList.add('hidden');
        }

        // Populate Timings
        const timingListEl = document.getElementById('timing-list');
        const noTimingsEl = document.getElementById('no-timings');
        timingListEl.innerHTML = '';

        if (data.timings && data.timings.length > 0) {
            data.timings.forEach(timing => {
                const li = document.createElement('li');
                li.textContent = translate(timing);
                timingListEl.appendChild(li);
            });
            noTimingsEl.classList.add('hidden');
        } else {
            noTimingsEl.classList.add('hidden');
        }

        resultsView.classList.remove('hidden');
    }

    // 7. Calendar Reminder Logic (Phase 3)
    calendarBtn.addEventListener('click', () => {
        if (!scanResults || !scanResults.timings) return;

        let reminders = "";
        const now = new Date();
        const stamp = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

        scanResults.timings.forEach((time, index) => {
            let doseCount = 0;
            if (time.includes('1-1-1')) doseCount = 3;
            else if (time.includes('1-0-1')) doseCount = 2;
            else doseCount = 1;

            reminders += `BEGIN:VEVENT\nSUMMARY:Dose Reminder: ${scanResults.medicines[0] || 'Medicine'}\nDESCRIPTION:Take dose for ${time}\nDTSTART:${stamp}\nDURATION:PT30M\nEND:VEVENT\n`;
        });

        const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//MedTech AI//NONSGML v1.0//EN\n${reminders}END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "medication_reminders.ics";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // 6. PDF Generation Logic
    downloadPdfBtn.addEventListener('click', () => {
        if (!scanResults) return;

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFont("Helvetica");
        doc.setFontSize(22);
        doc.setTextColor(0, 123, 255);
        doc.text("MedTech AI - Digital Prescription", 20, 20);

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text("Date: " + new Date().toLocaleDateString(), 20, 30);

        doc.line(20, 35, 190, 35);

        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text("Detected Medicines:", 20, 50);

        doc.setFontSize(12);
        let yPos = 60;
        if (scanResults.medicines && scanResults.medicines.length > 0) {
            scanResults.medicines.forEach(med => {
                doc.text("- " + med, 25, yPos);
                yPos += 10;
            });
        }

        doc.setFontSize(16);
        doc.text("Dosage / Instructions:", 20, yPos + 10);
        yPos += 20;

        doc.setFontSize(12);
        if (scanResults.timings && scanResults.timings.length > 0) {
            scanResults.timings.forEach(time => {
                doc.text("* " + time, 25, yPos);
                yPos += 10;
            });
        }

        doc.setTextColor(150);
        doc.setFontSize(10);
        doc.text("Note: AI-generated digitization. Please verify with a doctor.", 20, 280);
        doc.save("MedTech_Prescription.pdf");
    });

    // 8. Find Pharmacy Logic (Phase 5)
    mapsBtn.addEventListener('click', () => {
        window.open("https://www.google.com/maps/search/pharmacy+near+me", "_blank");
    });

    shopBtn.addEventListener('click', () => {
        if (scanResults && scanResults.medicines && scanResults.medicines.length > 0) {
            const firstMed = scanResults.medicines[0];
            window.open(`https://www.netmeds.com/catalogsearch/result?q=${firstMed}`, "_blank");
        }
    });

    function showLoader(show) {
        if (show) {
            loader.classList.remove('hidden');
            analyzeBtn.disabled = true;
            analyzeBtn.textContent = 'Analyzing...';
        } else {
            loader.classList.add('hidden');
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = 'Start Analysis';
        }
    }
});
