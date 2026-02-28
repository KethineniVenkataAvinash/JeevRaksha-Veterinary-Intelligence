# JeevRaksha: Multimodal AI Veterinary Intelligence Engine
> **AI-Based Early Livestock Disease Detection & Decision Support System**

<div align="center">
  <img src="https://img.shields.io/badge/Frontend-Next.js%20%7C%20Tailwind-blue.svg" alt="Frontend">
  <img src="https://img.shields.io/badge/Backend-Flask%20%7C%20Supabase-3ECF8E.svg" alt="Backend">
  <img src="https://img.shields.io/badge/AI%20Vision-EfficientNetV2%20%7C%20YOLOv8-orange.svg" alt="Vision">
  <img src="https://img.shields.io/badge/AI%20Audio-1D%20CNN%20%7C%20Librosa-red.svg" alt="Audio">
  <img src="https://img.shields.io/badge/AI%20NLP-BERT-yellow.svg" alt="NLP">
</div>

**JeevRaksha** is a comprehensive, cloud-powered Veterinary Intelligence platform built to eradicate the "Diagnostic Gap" in rural agriculture. By simultaneously fusing Computer Vision, Audio Anomaly Detection, Spatial Geometry, and Critical NLP, JeevRaksha delivers a complete ecosystem for disease triage, teleconsultation, and advanced herd analytics directly to the hands of farmers and Gau Sevaks.

---

##Kaggle Dataset (https://kaggle.com/datasets/9a28eb7397e7cf7dd7ac05fc4490fd82e3ab07c398bcf9333911e9e55b36090d)

## Table of Contents
1. [Core Modules & Dashboard Features](#-core-modules--dashboard-features)
2. [Deep Dive: Multimodal AI Engine](#-deep-dive-multimodal-ai-engine)
3. [User Roles, Auth & Radar](#-user-roles-auth--radar)
4. [Localization, Settings & UI Design](#-localization-settings--ui-design)
5. [Model Performance & Research](#-model-performance--research-confusion-matrices)
6. [Full-Stack Architecture](#-full-stack-architecture)
7. [Website Screenshots](#-website-screenshots)
8. [Reports](#-reports)
9. [Getting Started (Clone & Run)](#-getting-started-clone--run)
10. [The Team](#-the-team)

---

##  Core Modules & Dashboard Features

### The Interactive Smart Dashboard
The central hub for daily farm monitoring, designed for immediate situational awareness:
* **Seasonal Threats & Watch:** Real-time, location-based widgets displaying active seasonal viral threats (e.g., monsoon-induced FMD outbreaks) complete with reference photos and local prevalence rates.
* **Recent Diagnostic Activities:** A synchronized log of the latest herd scans, instantly flagging critical health status changes requiring immediate intervention.
* **Smart AI Analytics & History:** A comprehensive analytical timeline tracking the history of scans, recovery rates, and predictive analytics for herd health trends.

### Teleconsultation & Radar Chat
* **Live Teleconsultation:** Direct, in-app consultation capabilities seamlessly integrating farmers with certified veterinarians.
* **Location-Based Radar:** Geolocation services to instantly find and chat with nearby **Traders**, **Veterinarians**, and **Gau Sevaks** based on proximity.

### Clinical Guide & Safety Protocols
* **Comprehensive Clinical Guide:** A built-in veterinary encyclopedia detailing symptoms, first-aid protocols, and safety measures for a variety of livestock species and diseases.
* **Bio-Security & Quarantine:** Dedicated sections outlining crucial bio-security measures, strict quarantine protocols, and the safe handling of infected livestock to prevent herd-wide spread.
* **About the Technology:** An in-app technical breakdown explaining how our AI models (Vision, Voice Activity, Biometrics) analyze data, building algorithmic trust with rural users.

---

## Deep Dive: Multimodal AI Engine

Our AI Inference Engine is powered by a high-speed Flask backend that routes complex multimodal payloads through specialized, state-of-the-art neural networks:

### 1. Computer Vision (EfficientNetV2)
* **Species Isolation:** A fine-tuned `EfficientNetV2` model accurately classifies the animal into 6 core species categories.
* **Two-Stage Disease Detection:** Images pass through a specialized two-stage Convolutional Neural Network pipeline (`stage1_best` and `stage2_best`) for precise dermatological lesion detection, isolating severe pathologies like **Lumpy Skin Disease** and **Foot-and-Mouth Disease (FMD)**.

### 2. Biometric Estimation (Ultralytics YOLOv8)
* **Instance Segmentation:** Integration of a custom `YOLOv8n-seg` (Ultralytics) model to extract precise animal spatial contours and bounding box geometry.
* **Hardware-Free Weight & BCS:** By analyzing pixel density and structural contours, the system algorithmically estimates the animal's **Weight (kg)** and **Body Condition Score (BCS)** without requiring immobile physical scales.

### 3. Voice Activity & Audio Intelligence (1D CNN & librosa)
* **Acoustic Feature Extraction:** Raw audio clips are mathematically processed via the `librosa` library into Mel-frequency cepstral coefficients (MFCCs) and spectrograms.
* **PyTorch Autoencoder:** A custom **1D CNN Autoencoder** attempts to reconstruct the acoustic signature based on its training of *healthy* respiratory patterns.
* **MSE Thresholding:** Invisible lung anomalies and coughing cause the neural reconstruction to fail, spiking the Mean Squared Error (MSE) and instantly flagging the respiratory infection.

### 4. Critical NLP (BERT / DERT System)
* **Diagnostic Early Response & Triage (DERT):** The system utilizes a **BERT-based Natural Language Processing (NLP)** architecture to analyze user-inputted symptoms (via text or the voice assistant). It semantically parses these descriptions and combines them with the visual/audio data to accurately rank threat severity and recommend immediate actions.

---

## User Roles, Auth & Radar
Built on top of **Supabase**, the login and sign-up pages are highly dynamic, secure, and role-specific:

* **Role-Based Access Control (RBAC):** Users must select their profile type during sign-up:
  1. **Farmer:** Simplified UI focused on rapid scanning, local alerts, and connecting with vets.
  2. **Veterinarian:** Advanced UI with teleconsultation queues, deep diagnostic data access, and prescription capabilities.
  3. **Admin:** System oversight, epidemiological outbreak mapping, and user management.
* **Location-Based Setup:** Sign-up includes precise location tagging to fuel the local Radar, Chat, and Seasonal Threat mapping features.

---

## Localization, Settings & UI Design

JeevRaksha is built to break digital literacy barriers in deep rural environments.

* **Native Display Translation:** The entire interface dynamically translates from English into regional languages: **Telugu, Tamil, and Malayalam** (alongside Hindi and Kannada).
* **Floating AI Voice Assistant:** Persistent voice-guided navigation and symptom reporting for users unable to type or read complex menus.
* **Advanced UI Design:** A beautifully crafted, responsive UI built with Tailwind CSS, offering contrast adjustments and theme toggles (Sunlight/Dark modes) for high visibility in outdoor farm environments.
* **Security & Notifications:** Advanced settings grant users complete control over **Security** (password updates, session management) and **Notifications** (SMS/Push alerts for local disease outbreaks).

---

## Model Performance & Research (Confusion Matrices)

Our Computer Vision models were trained on a highly curated, custom livestock dataset using `EfficientNetV2` architectures. 

*(Note: The following are analytical outputs from our training scripts)*

### Species Classification Accuracy
The foundational model achieves high precision across 6 core livestock species, minimizing cross-species misclassification.

<img width="800" alt="Species Confusion Matrix" src="https://github.com/user-attachments/assets/83d43aaa-a476-4b7f-895c-bd20a8ee9435" />

### Two-Stage Disease Detection
The specialized dermatological models demonstrate robust sensitivity to critical pathologies, drastically minimizing false negatives for highly contagious diseases.

<img width="600" alt="Stage 1 Disease Matrix" src="https://github.com/user-attachments/assets/be6a0904-17e6-49c2-a305-4ef4d809e937" />
<br><br>
<img width="600" alt="Stage 2 Disease Matrix" src="https://github.com/user-attachments/assets/e302f80a-be9a-4204-84d4-4a5f166123b4" />

---

## Full-Stack Architecture

* **Frontend Web App:** **Next.js (React)** with Tailwind CSS for a lightning-fast, mobile-first interface.
* **Backend & Database:** **Supabase** handling PostgreSQL relational data, secure authentication, Row Level Security (RLS), and real-time scan history synchronization.
* **AI Inference Gateway:** A high-speed **Flask (Python)** API routing multimodal payloads to the PyTorch, Ultralytics, and Hugging Face (BERT) deep learning pipelines.

---

## Website Screenshots

<img width="800" alt="Dashboard View 1" src="https://github.com/user-attachments/assets/7c75c348-8512-4e5d-a605-7c366bc0bd79" />
<br><br>

<img width="800" alt="Dashboard View 2" src="https://github.com/user-attachments/assets/baf5f4e5-3994-411a-9734-ab16a749bc46" />
<br><br>

<img width="800" alt="Dashboard View 3" src="https://github.com/user-attachments/assets/48053e30-6ad9-4530-92d9-f8bd7e5f3d83" />
<br><br>

<img width="800" alt="Dashboard View 4" src="https://github.com/user-attachments/assets/5f4eb64c-7e54-4c53-9dc6-5bd37e9cc5ba" />
<br><br>

<img width="800" alt="Dashboard View 5" src="https://github.com/user-attachments/assets/137eed74-1c4e-4f83-a795-a314d34138f3" />
<br><br>

<img width="800" alt="Dashboard View 6" src="https://github.com/user-attachments/assets/f02845c5-2604-473a-83bc-e20be28d338f" />

---

## Reports

**[Download the Official Report (PDF)](https://github.com/user-attachments/files/25621532/Report.pdf)**

<img width="800" alt="Report Preview" src="https://github.com/user-attachments/assets/cb44a6e1-515a-4f0c-90d7-47b9670117ac" />

---

---
##  Complete Project Structure

jeevraksha/
│
├── app.py                            # Main Flask API & Inference Engine Gateway
├── requirements.txt                  # Python Backend Dependencies
├── package.json                      # Next.js Frontend Dependencies
├── tailwind.config.ts                # UI Branding configuration
├── middleware.ts                     # Supabase Auth Route Protection
│
├── Machine_Learning_Models/          # Hosted externally due to GitHub limits
│   ├── best_species_model_finetuned.pth
│   ├── stage1_best_finetuned.pth
│   ├── stage2_best_finetuned.pth
│   ├── yolov8n-seg.pt
│   ├── audio_autoencoder.pth
│   └── audio_threshold.npy
│
├── Model_Training_Scripts/           # Custom PyTorch training pipelines
│   ├── train_audio_anomaly.py
│   ├── train_species2.py
│   ├── train_stage1.py
│   └── train_stage2.py
│
└── app/                              # Next.js App Router Frontend
    ├── auth/                         # Authentication callbacks
    ├── login/                        # Secure User Login / Signup
    ├── diagnose/                     # Multimodal Scan Interface (Camera/Mic)
    ├── reports/                      # AI Generated JSON Health Reports
    ├── history/                      # Supabase synced scan history dashboard
    ├── settings/                     # User localization preferences
    ├── guide/                        # App usage instructions
    ├── update-password/              # Auth management
    ├── layout.tsx                    # Global layout & Floating AI Voice Assistant
    └── page.tsx                      # Main Statistical Dashboard

---
## Getting Started (Clone & Run)

Follow these steps to deploy the complete JeevRaksha ecosystem locally.

### 1. Clone the Repository
```bash

gh repo clone KethineniVenkataAvinash/JeevRaksha-Veterinary-Intelligence

```

### 2. Setup the Next.js Frontend & Supabase

Install Node.js dependencies:

```bash
npm install

```

Create a `.env.local` file in the root directory and add your Supabase connection strings:

```text
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

```

Start the frontend development server:

```bash
npm run dev
# The dashboard will be available at http://localhost:3000

```

### 3. Setup the Flask AI Inference Engine

Open a new terminal session. Create a Python virtual environment and install the ML requirements:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -r requirements.txt

```

*Note: Ensure you have downloaded the heavy PyTorch and YOLO model weights (`.pth` and `.pt` files) from our external drive and placed them in the root directory.*
https://drive.google.com/drive/folders/1OP03SAv2DTILw8vMcha4QO_NaEQGljtJ?usp=sharing

Start the backend API:

```bash
python app.py
# The AI Engine will listen on http://localhost:5000

```

---

## The Team

Engineered with dedication for the future of rural agriculture by students from the **Vellore Institute of Technology (VIT), Bhopal**.

* **Kethineni Venkata Avinash** 
* **Guggilam Bala Yoshik** 
* **Samudrala Manjunadh** 

---

*Official Submission for the Quantumard National Hackathon 2026.*

```

This is completely ready to go! Would you like me to help with anything else regarding your Hackathon submission?

```
