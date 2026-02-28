import os
import uuid
import traceback
import torch
import torch.nn as nn
import librosa
import librosa.display
import numpy as np
import matplotlib
matplotlib.use('Agg') 
import matplotlib.pyplot as plt
from collections import Counter

from flask import Flask, request, jsonify
from flask_cors import CORS
from torchvision import transforms, models
from PIL import Image
from ultralytics import YOLO
import cv2
from transformers import pipeline
from werkzeug.utils import secure_filename

# ==============================
# FLASK SETUP
# ==============================
app = Flask(__name__, static_folder='static')
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024 
CORS(app, resources={r"/*": {"origins": "*"}}) 

UPLOAD_FOLDER = "static/uploads"
PLOT_FOLDER = "static/plots"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PLOT_FOLDER, exist_ok=True)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[*] Starting JeevRaksha AI Engine on: {device}")

# ==============================
# IMAGE MODELS (EfficientNet)
# ==============================
try:
    species_classes = ["buffalo", "camel", "cow", "goat", "horse", "sheep"]
    species_model = models.efficientnet_v2_s(weights=None)
    in_features = species_model.classifier[1].in_features
    species_model.classifier = nn.Sequential(nn.Dropout(0.4), nn.Linear(in_features, 6))
    species_model.load_state_dict(torch.load("best_species_model_finetuned.pth", map_location=device))
    species_model.to(device).eval()

    stage1_classes = ["FMD", "LSD", "Other"]
    stage1_model = models.efficientnet_v2_s(weights=None)
    in_features = stage1_model.classifier[1].in_features
    stage1_model.classifier = nn.Sequential(nn.Dropout(0.5), nn.Linear(in_features, 3))
    stage1_model.load_state_dict(torch.load("stage1_best_finetuned.pth", map_location=device))
    stage1_model.to(device).eval()

    stage2_classes = ["Pox", "Ringworm", "Tick", "Warts"]
    stage2_model = models.efficientnet_v2_s(weights=None)
    in_features = stage2_model.classifier[1].in_features
    stage2_model.classifier = nn.Sequential(nn.Dropout(0.6), nn.Linear(in_features, 4))
    stage2_model.load_state_dict(torch.load("stage2_best_finetuned.pth", map_location=device))
    stage2_model.to(device).eval()
    print("[*] Vision Models Loaded Successfully.")
except Exception as e:
    print(f"[!] Warning: Vision model weights not found or failed to load. {e}")

image_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# ==============================
# YOLO MEASUREMENT MODEL
# ==============================
try:
    yolo_model = YOLO("yolov8n-seg.pt")
    print("[*] YOLOv8 Segmentation Model Loaded.")
except Exception as e:
    print(f"[!] Warning: YOLO model failed to load. {e}")

height_references = {
    "buffalo": 140, "camel": 185, "cow": 135, 
    "goat": 65, "horse": 160, "sheep": 70
}
yolo_coco_mapping = {
    "buffalo": "cow", "camel": "horse", "cow": "cow", 
    "goat": "sheep", "horse": "horse", "sheep": "sheep"
}

# ==============================
# AUDIO MODEL (Autoencoder)
# ==============================
SAMPLE_RATE = 16000
DURATION = 5
SAMPLES_PER_TRACK = SAMPLE_RATE * DURATION
N_MFCC = 40

class AudioAutoencoder(nn.Module):
    def __init__(self):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Conv1d(40, 64, 3, padding=1), nn.BatchNorm1d(64), nn.ReLU(), nn.MaxPool1d(2),
            nn.Conv1d(64, 128, 3, padding=1), nn.BatchNorm1d(128), nn.ReLU(), nn.MaxPool1d(2),
        )
        self.decoder = nn.Sequential(
            nn.ConvTranspose1d(128, 64, 2, stride=2), nn.ReLU(),
            nn.ConvTranspose1d(64, 40, 2, stride=2),
        )

    def forward(self, x):
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        if decoded.shape[2] > x.shape[2]: decoded = decoded[:, :, :x.shape[2]]
        elif decoded.shape[2] < x.shape[2]:
            pad = x.shape[2] - decoded.shape[2]
            decoded = torch.nn.functional.pad(decoded, (0, pad))
        return decoded

audio_model = None
threshold = 0.5
try:
    audio_model = AudioAutoencoder().to(device)
    audio_model.load_state_dict(torch.load("audio_autoencoder.pth", map_location=device))
    audio_model.eval()
    try: threshold = float(np.load("audio_threshold.npy").item())
    except: threshold = 0.5 
    print("[*] Audio Models Loaded Successfully.")
except Exception as e:
    print(f"[!] Warning: Audio model failed to load. {e}")

def process_audio(file_path, file_id):
    global audio_model
    if audio_model is None: raise Exception("Audio model is not loaded.")
    try: signal, sr = librosa.load(file_path, sr=SAMPLE_RATE)
    except Exception as e: raise ValueError(f"Invalid audio format. ({str(e)})")

    if len(signal) > SAMPLES_PER_TRACK: signal = signal[:SAMPLES_PER_TRACK]
    else: signal = np.pad(signal, (0, SAMPLES_PER_TRACK - len(signal)))
    signal = librosa.util.normalize(signal)
    mfcc = librosa.feature.mfcc(y=signal, sr=SAMPLE_RATE, n_mfcc=N_MFCC)

    plt.clf()
    plt.figure(figsize=(8,3))
    plt.plot(signal)
    plt.title("Waveform")
    plt.tight_layout()
    waveform_name = f"waveform_{file_id}.png"
    plt.savefig(os.path.join(PLOT_FOLDER, waveform_name))
    plt.close('all')

    plt.figure(figsize=(8,4))
    librosa.display.specshow(mfcc, sr=SAMPLE_RATE, x_axis='time')
    plt.colorbar()
    plt.title("MFCC")
    plt.tight_layout()
    mfcc_name = f"mfcc_{file_id}.png"
    plt.savefig(os.path.join(PLOT_FOLDER, mfcc_name))
    plt.close('all')

    mfcc_tensor = torch.tensor(mfcc, dtype=torch.float32).unsqueeze(0).to(device)
    with torch.no_grad():
        output = audio_model(mfcc_tensor)
        error = torch.mean((mfcc_tensor - output) ** 2).item()

    plt.figure()
    plt.bar(["Error"], [error])
    plt.axhline(y=threshold, color='r', linestyle='--')
    plt.title("Anomaly Score")
    plt.tight_layout()
    anomaly_name = f"anomaly_{file_id}.png"
    plt.savefig(os.path.join(PLOT_FOLDER, anomaly_name))
    plt.close('all')

    status = "Healthy" if error < threshold else "Respiratory Anomaly Detected"
    confidence = min(abs(threshold - error) / threshold * 100, 100) if threshold > 0 else 99.0
    return status, round(confidence, 2), f"static/plots/{waveform_name}", f"static/plots/{mfcc_name}", f"static/plots/{anomaly_name}"

# ==============================
# DOCX INTEGRATED NLP MODEL (BERT)
# ==============================
print("[*] Loading BERT NLP Model with Document Knowledge...")
symptom_classifier = pipeline(
    "zero-shot-classification", 
    model="typeform/distilbert-base-uncased-mnli",
    device=0 if torch.cuda.is_available() else -1
)

# Integrated exact symptoms from the Word Document
symptom_knowledge_base = {
    "lsd": "Lumpy Skin Disease (LSD) - High fever, firm raised nodules lumps on skin head neck udder, swollen legs edema, milk drop",
    "fmd": "Foot-and-Mouth Disease (FMD) - Fever, excess salivation rope drool, smacking lips, blisters on tongue gums hooves, lameness",
    "hs": "Hemorrhagic Septicemia (HS) Gal-Ghotu - Sudden high fever, severe throat swelling, brisket edema, grunting breathing sound",
    "ringworm": "Ringworm Dermatophytosis - Circular grayish-white crusty patches, hair loss around eyes ears neck",
    "mange": "Sarcoptic Mange Khujli - Intense agonizing itching, massive hair loss, thick wrinkled bleeding crusty skin",
    "papillomatosis": "Bovine Papillomatosis Warts - Solid cauliflower-like growths or warts protruding from skin head neck teats",
    "ibr": "Infectious Bovine Rhinotracheitis IBR Red Nose - Red inflamed nostrils, nasal discharge, coughing, late-term abortions",
    "btb": "Bovine Tuberculosis bTB - Chronic hacking cough, progressive severe weight loss wasting, exercise intolerance",
    "brd": "Bovine Respiratory Disease BRD Pneumonia - Thick yellow nasal discharge, drooping ears, rapid shallow breathing, transport stress",
    "rabies": "Rabies Mad Dog Disease - Aggression, excessive bellowing, hypersensitivity, salivation, hind limb weakness, paralysis dog bite",
    "brucellosis": "Brucellosis - Late-term abortion, retained placenta, vaginal discharge, swollen testicles in bulls",
    "blackquarter": "Black Quarter BQ Black-leg - Sudden lameness, hot painful muscle swelling with gas crackling crepitus sound",
    "milkfever": "Milk Fever Hypocalcemia - Recent calving, recumbent cow, S-shaped neck bent to side, cold ears, unconsciousness",
    "buffalopox": "Buffalo Pox - Pain during milking, raised papules fluid-filled vesicles teats, thick brown scabs, milker hand lesions",
    "rainscald": "Dermatophilosis Rain Scald - Thick dirty-yellow crusts, paint brush lesions matted hair on back after heavy rains",
    "ticks": "Tick Infestation Babesiosis - Visible ticks on body, pale gums anemia, weakness fever",
    "goatpox": "Goat Pox Sheep Pox - Fever, red spots raised firm nodules on muzzle ears eyelids underbelly, kid lamb mortality",
    "orf": "Orf Contagious Ecthyma Sore Mouth - Thick crusted bleeding scabs around lips and mouth, pain during feeding",
    "ppr": "PPR Goat Plague - High fever, thick yellow nasal discharge, mouth ulcers, foul-smelling watery diarrhea, pneumonia",
    "ccpp": "Contagious Caprine Pleuropneumonia CCPP - Severe coughing, standing with neck extended, mouth open breathing, chest pain",
    "worms": "Gastrointestinal Parasites Worms Haemonchus - Pale eyelids anemia, weakness, Bottle jaw fluid swelling under jaw",
    "enterotoxemia": "Enterotoxemia Pulpy Kidney Overeating - Sudden death of healthy animal, severe abdominal pain, convulsions after diet change",
    "johnes": "Johne's Disease Paratuberculosis - Chronic watery diarrhea, extreme progressive weight loss wasting despite good appetite",
    "flystrike": "Fleece Rot Flystrike Myiasis - Foul smell, visible maggots eating flesh, open bleeding wounds in wet wool",
    "bluetongue": "Bluetongue - Facial swelling, swollen lips, cyanotic blue tongue, mouth ulcers, lameness",
    "crdc": "Camel Respiratory Disease - Thick mucous discharge, coughing, head lowered after dust storm or transport",
    "surra": "Trypanosomiasis Surra - Extreme progressive emaciation hump disappears, intermittent fever, pale mucous membranes",
    "sarcoids": "Equine Sarcoids - Flat scaly patches, warty growths, large fleshy bleeding nodules on horse face groin",
    "sweetitch": "Sweet Itch Summer Eczema - Agonizing itching, rubbed off mane and tail, weeping wounds from midge bites",
    "strangles": "Strangles - High fever, thick yellow nasal discharge, massive swelling and abscesses under jaw throat",
    "equine_flu": "Equine Herpesvirus Influenza - Dry harsh cough, nasal discharge, late abortion, hind-limb weakness in horses",
    "colic": "Equine Colic - Pawing ground, looking at flank, violent rolling, sweating profusely, abdominal pain"
}
symptom_categories = list(symptom_knowledge_base.values())

@app.route("/analyze_symptoms", methods=["POST"])
def analyze_symptoms():
    try:
        data = request.get_json()
        if not data or "text" not in data:
            return jsonify({"success": False, "error": "No text provided"}), 400

        symptoms_text = data["text"]
        result = symptom_classifier(symptoms_text, symptom_categories)
        top_category_full = result["labels"][0]
        confidence = round(result["scores"][0] * 100, 1)

        # Map the winning long string back to the ID key
        matched_id = "unknown"
        disease_name = "Unknown Anomaly"
        for key, value in symptom_knowledge_base.items():
            if value == top_category_full:
                matched_id = key
                disease_name = value.split(" - ")[0] # Extract just the name portion
                break

        return jsonify({
            "success": True,
            "data": {
                "disease_id": matched_id,
                "top_category": disease_name,
                "confidence": confidence,
                "recommended_tab": "assistant"
            }
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500

# ==============================
# MAIN MULTIMODAL ROUTE
# ==============================
@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "JeevRaksha AI Engine Running", "status": 200})

@app.route("/analyze", methods=["POST"])
def analyze_multimodal():
    try:
        species, disease, weight_kg, bcs_proxy, measurement_img = None, None, None, None, None
        audio_status, audio_confidence, waveform_plot, mfcc_plot, anomaly_plot = None, None, None, None, None

        req_id = str(uuid.uuid4())[:8]

        image_files = request.files.getlist("images")
        if "image" in request.files and request.files["image"].filename != "":
            image_files.append(request.files["image"])

        frames_analyzed = len(image_files)
        species_predictions = []
        disease_predictions = []
        all_lengths, all_heights, all_girths = [], [], []

        if image_files:
            for idx, file in enumerate(image_files[:5]): 
                if file.filename == "": continue

                filename = f"img_{req_id}_{idx}_{secure_filename(file.filename)}"
                image_path = os.path.join(UPLOAD_FOLDER, filename)
                file.save(image_path)

                try:
                    image = Image.open(image_path).convert("RGB")
                    tensor_image = image_transform(image).unsqueeze(0).to(device)

                    with torch.no_grad():
                        sp_out = species_model(tensor_image)
                        detected_species = species_classes[torch.argmax(sp_out, 1).item()]
                        species_predictions.append(detected_species)

                        s1_out = stage1_model(tensor_image)
                        stage1_result = stage1_classes[torch.argmax(s1_out, 1).item()]

                        if stage1_result == "Other":
                            s2_out = stage2_model(tensor_image)
                            detected_disease = stage2_classes[torch.argmax(s2_out, 1).item()]
                        else:
                            detected_disease = "Lumpy Skin Disease (LSD)" if stage1_result == "LSD" else stage1_result
                        
                        disease_predictions.append(detected_disease)

                    cv_image = cv2.imread(image_path)
                    output_image = cv_image.copy()
                    yolo_results = yolo_model(cv_image)
                    
                    target_yolo_class = yolo_coco_mapping.get(detected_species, "cow")
                    reference_height = height_references.get(detected_species, 135)

                    if yolo_results[0].masks is not None:
                        for i, box in enumerate(yolo_results[0].boxes):
                            cls = int(box.cls[0])
                            yolo_detected_class = yolo_model.names[cls]

                            if yolo_detected_class == target_yolo_class:
                                raw_mask = yolo_results[0].masks.data[i].cpu().numpy()
                                mask = cv2.resize(raw_mask, (cv_image.shape[1], cv_image.shape[0]))
                                coords = np.column_stack(np.where(mask > 0))
                                
                                if len(coords) < 10: continue

                                left_y, left_x = coords[np.argmin(coords[:,1])]
                                right_y, right_x = coords[np.argmax(coords[:,1])]
                                top_y, top_x = coords[np.argmin(coords[:,0])]
                                bottom_y, bottom_x = coords[np.argmax(coords[:,0])]

                                body_length_px = np.linalg.norm(np.array([left_y, left_x]) - np.array([right_y, right_x]))
                                body_height_px = np.linalg.norm(np.array([top_y, top_x]) - np.array([bottom_y, bottom_x]))

                                if body_height_px > 0:
                                    semi_major = body_height_px / 2
                                    semi_minor = body_height_px / 2.5
                                    heart_girth_px = 2 * np.pi * np.sqrt((semi_major**2 + semi_minor**2) / 2)

                                    pixels_per_cm = body_height_px / reference_height
                                    body_length_cm = body_length_px / pixels_per_cm
                                    heart_girth_cm = heart_girth_px / pixels_per_cm

                                    all_lengths.append(body_length_cm)
                                    all_heights.append(body_height_px / pixels_per_cm)
                                    all_girths.append(heart_girth_cm)

                                    if measurement_img is None:
                                        color_mask = np.zeros_like(cv_image)
                                        color_mask[mask > 0] = [0, 255, 0]
                                        output_image = cv2.addWeighted(output_image, 1.0, color_mask, 0.4, 0)
                                        cv2.line(output_image, (left_x, left_y), (right_x, right_y), (255, 0, 0), 3)
                                        cv2.line(output_image, (top_x, top_y), (bottom_x, bottom_y), (0, 255, 255), 3)

                                        meas_filename = f"meas_{req_id}.png"
                                        cv2.imwrite(os.path.join(PLOT_FOLDER, meas_filename), output_image)
                                        measurement_img = f"static/plots/{meas_filename}"
                                    break 

                except Exception as e:
                    print(f"[!] Vision Error: {e}")

            if species_predictions:
                species = Counter(species_predictions).most_common(1)[0][0]
            if disease_predictions:
                sick_predictions = [d for d in disease_predictions if d != "Healthy"]
                if sick_predictions:
                    disease = Counter(sick_predictions).most_common(1)[0][0]
                else:
                    disease = "Healthy"
            if not disease and image_files:
                disease = "Vision Processing Error"

            if len(all_lengths) > 0:
                avg_l = sum(all_lengths) / len(all_lengths)
                avg_h = sum(all_heights) / len(all_heights)
                avg_g = sum(all_girths) / len(all_girths)
                
                weight_val = (avg_g**2 * avg_l) / 10840
                weight_kg = round(weight_val, 2)
                bcs_proxy = round(max(1.0, min(5.0, (weight_kg / 400) * 3 + 1)), 1) 

        # --- 2. PROCESS AUDIO ---
        if "audio" in request.files and request.files["audio"].filename != "":
            try:
                file = request.files["audio"]
                filename = f"aud_{req_id}_{secure_filename(file.filename)}"
                audio_path = os.path.join(UPLOAD_FOLDER, filename)
                file.save(audio_path)
                
                audio_status, audio_confidence, waveform_plot, mfcc_plot, anomaly_plot = process_audio(audio_path, req_id)
            except Exception as e:
                traceback.print_exc()
                return jsonify({"success": False, "error": f"Audio processing failed: {str(e)}"}), 500

        return jsonify({
            "success": True,
            "data": {
                "vision": {
                    "species": species if species_predictions else None,
                    "disease": disease,
                    "weight_kg": weight_kg,
                    "bcs_proxy": bcs_proxy,
                    "measurement_img": measurement_img,
                    "frames_analyzed": frames_analyzed
                },
                "audio": {
                    "status": audio_status,
                    "confidence": audio_confidence,
                    "plots": {
                        "waveform": waveform_plot,
                        "mfcc": mfcc_plot,
                        "anomaly": anomaly_plot
                    } if audio_status else None
                }
            }
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "error": f"Backend Error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)