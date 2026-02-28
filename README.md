# JeevRaksha-Veterinary-Intelligence
AI-Based Early Livestock Disease Detection &amp; Decision Support System

# 🐾 JeevRaksha: Multimodal AI Veterinary Intelligence Engine

<div align="center">
  <img src="https://img.shields.io/badge/Frontend-Next.js%20%7C%20Tailwind-blue.svg" alt="Frontend">
  <img src="https://img.shields.io/badge/Backend-Flask%20%7C%20Supabase-3ECF8E.svg" alt="Backend">
  <img src="https://img.shields.io/badge/AI%20Vision-EfficientNetV2%20%7C%20YOLOv8-orange.svg" alt="Vision">
  <img src="https://img.shields.io/badge/AI%20Audio-1D%20CNN%20%7C%20Librosa-red.svg" alt="Audio">
  <img src="https://img.shields.io/badge/AI%20NLP-BERT-yellow.svg" alt="NLP">
</div>

> **An Advanced, Multimodal AI-Based Early Livestock Disease Detection & Decision Support System**

**JeevRaksha** is a comprehensive, cloud-powered Veterinary Intelligence platform built to eradicate the "Diagnostic Gap" in rural agriculture. By simultaneously fusing Computer Vision, Audio Anomaly Detection, Spatial Geometry, and Critical NLP, JeevRaksha delivers a complete ecosystem for disease triage, teleconsultation, and advanced herd analytics directly to the hands of farmers and Gau Sevaks.

---

## 📑 Table of Contents
1. [Core Modules & Dashboard Features](#-core-modules--dashboard-features)
2. [Deep Dive: Multimodal AI Engine](#-deep-dive-multimodal-ai-engine)
3. [User Roles, Auth & Radar](#-user-roles-auth--radar)
4. [Localization, Settings & UI Design](#-localization-settings--ui-design)
5. [Model Performance & Research](#-model-performance--research-confusion-matrices)
6. [Full-Stack Architecture](#-full-stack-architecture)
7. [Getting Started (Clone & Run)](#-getting-started-clone--run)
8. [The Team](#-the-team)

---

## 🚀 Core Modules & Dashboard Features

### 📊 The Interactive Smart Dashboard
The central hub for daily farm monitoring, designed for immediate situational awareness:
* **Seasonal Threats & Watch:** Real-time, location-based widgets displaying active seasonal viral threats (e.g., monsoon-induced FMD outbreaks) complete with reference photos and local prevalence rates.
* **Recent Diagnostic Activities:** A synchronized log of the latest herd scans, instantly flagging critical health status changes requiring immediate intervention.
* **Smart AI Analytics & History:** A comprehensive analytical timeline tracking the history of scans, recovery rates, and predictive analytics for herd health trends.

### 🏥 Teleconsultation & Radar Chat
* **Live Teleconsultation:** Direct, in-app consultation capabilities seamlessly integrating farmers with certified veterinarians.
* **Location-Based Radar:** Geolocation services to instantly find and chat with nearby **Traders**, **Veterinarians**, and **Gau Sevaks** based on proximity.

### 📚 Clinical Guide & Safety Protocols
* **Comprehensive Clinical Guide:** A built-in veterinary encyclopedia detailing symptoms, first-aid protocols, and safety measures for a variety of livestock species and diseases.
* **Bio-Security & Quarantine:** Dedicated sections outlining crucial bio-security measures, strict quarantine protocols, and the safe handling of infected livestock to prevent herd-wide spread.
* **About the Technology:** An in-app technical breakdown explaining how our AI models (Vision, Voice Activity, Biometrics) analyze data, building algorithmic trust with rural users.

---

## 🧠 Deep Dive: Multimodal AI Engine

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

## 🔐 User Roles, Auth & Radar
Built on top of **Supabase**, the login and sign-up pages are highly dynamic, secure, and role-specific:

* **Role-Based Access Control (RBAC):** Users must select their profile type during sign-up:
  1. **Farmer:** Simplified UI focused on rapid scanning, local alerts, and connecting with vets.
  2. **Veterinarian:** Advanced UI with teleconsultation queues, deep diagnostic data access, and prescription capabilities.
  3. **Admin:** System oversight, epidemiological outbreak mapping, and user management.
* **Location-Based Setup:** Sign-up includes precise location tagging to fuel the local Radar, Chat, and Seasonal Threat mapping features.

---

## 🌍 Localization, Settings & UI Design

JeevRaksha is built to break digital literacy barriers in deep rural environments.

* **Native Display Translation:** The entire interface dynamically translates from English into regional languages: **Telugu, Tamil, and Malayalam** (alongside Hindi and Kannada).
* **Floating AI Voice Assistant:** Persistent voice-guided navigation and symptom reporting for users unable to type or read complex menus.
* **Advanced UI Design:** A beautifully crafted, responsive UI built with Tailwind CSS, offering contrast adjustments and theme toggles (Sunlight/Dark modes) for high visibility in outdoor farm environments.
* **Security & Notifications:** Advanced settings grant users complete control over **Security** (password updates, session management) and **Notifications** (SMS/Push alerts for local disease outbreaks).

---

## 📈 Model Performance & Research (Confusion Matrices)

Our Computer Vision models were trained on a highly curated, custom livestock dataset using `EfficientNetV2` architectures. 

*(Note: The following are analytical outputs from our training scripts)*

### Species Classification Accuracy
The foundational model achieves high precision across 6 core livestock species, minimizing cross-species misclassification.
<img width="800" height="600" alt="Species Confustion Matrix" src="https://github.com/user-attachments/assets/83d43aaa-a476-4b7f-895c-bd20a8ee9435" />

### Two-Stage Disease Detection
The specialized dermatological models demonstrate robust sensitivity to critical pathologies, drastically minimizing false negatives for highly contagious diseases.

<img width="600" height="500" alt="Stage 1 Disease Matrix" src="https://github.com/user-attachments/assets/be6a0904-17e6-49c2-a305-4ef4d809e937" /><img width="600" height="500" alt="Stage 2 Disease Matrix" src="https://github.com/user-attachments/assets/e302f80a-be9a-4204-84d4-4a5f166123b4" />

---

## 🏗️ Full-Stack Architecture

* **Frontend Web App:** **Next.js (React)** with Tailwind CSS for a lightning-fast, mobile-first interface.
* **Backend & Database:** **Supabase** handling PostgreSQL relational data, secure authentication, Row Level Security (RLS), and real-time scan history synchronization.
* **AI Inference Gateway:** A high-speed **Flask (Python)** API routing multimodal payloads to the PyTorch, Ultralytics, and Hugging Face (BERT) deep learning pipelines.

---

## 💻 Getting Started (Clone & Run)

Follow these steps to deploy the complete JeevRaksha ecosystem locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/JeevRaksha.git](https://github.com/YOUR_USERNAME/JeevRaksha.git)
cd JeevRaksha

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

Start the backend API:

```bash
python app.py
# The AI Engine will listen on http://localhost:5000

```

---

## 👥 The Team

Engineered with dedication for the future of rural agriculture by students from the **Vellore Institute of Technology (VIT), Bhopal**.

* **Kethineni Venkata Avinash** (Team Leader & Senior AI Engineer)
* **Guggilam Bala Yoshik** (Core Developer)
* **Samudrala Manjunadh** (Core Developer)

---

*Official Submission for the Quantumard National Hackathon 2026.*

```

```
