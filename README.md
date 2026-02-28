# JeevRaksha-Veterinary-Intelligence
AI-Based Early Livestock Disease Detection &amp; Decision Support System

Here is the ultimate, highly exhaustive `README.md` file for your GitHub repository. It integrates every single feature, module, and technical specification you requested—from the NLP DERT system and teleconsultation radar to the role-based authentication and EfficientNet confusion matrices.

You can copy and paste this entire code block directly into your `README.md` file on GitHub.

---

# 🐾 JeevRaksha: Multimodal AI Veterinary Intelligence Engine

<div align="center">
  <img src="https://img.shields.io/badge/Frontend-Next.js%20%7C%20React-blue.svg" alt="Frontend">
  <img src="https://img.shields.io/badge/Database-Supabase-3ECF8E.svg" alt="Supabase">
  <img src="https://img.shields.io/badge/AI%20Engine-PyTorch%20%7C%20Flask-orange.svg" alt="AI">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen.svg" alt="Status">
</div>

> **An Advanced, Multimodal AI-Based Early Livestock Disease Detection & Decision Support System**

**JeevRaksha** is a comprehensive Veterinary Intelligence platform built to eradicate the "Diagnostic Gap" in rural agriculture. By combining Computer Vision, Audio Anomaly Detection, Spatial Geometry, and Critical NLP, JeevRaksha delivers a complete ecosystem for disease triage, teleconsultation, and advanced herd analytics.

---

## 📑 Table of Contents
1. [Core Modules & Features](#-core-modules--features)
2. [User Roles & Authentication](#-user-roles--authentication)
3. [Deep Dive: AI Diagnostics & Smart AI](#-deep-dive-ai-diagnostics--smart-ai)
4. [Localization, Settings & UI Design](#-localization-settings--ui-design)
5. [Model Performance & Research](#-model-performance--research-confusion-matrices)
6. [System Architecture](#-system-architecture)
7. [Getting Started (Clone & Run)](#-getting-started-clone--run)

---

## 🚀 Core Modules & Features

### 📊 The Interactive Dashboard
The central hub for daily farm monitoring, designed for immediate situational awareness:
* **Seasonal Threats & Watch:** Real-time, location-based widgets displaying active seasonal viral threats (e.g., monsoon-induced FMD outbreaks) complete with reference photos.
* **Recent Diagnostic Activities:** A synchronized log of the latest herd scans, flagging critical health status changes instantly.
* **Smart AI Analytics & History:** A comprehensive analytical timeline tracking the history of scans, recovery rates, and predictive analytics for herd health trends.

### 🏥 Teleconsultation & Radar Chat
* **Live Vet Connect:** Direct teleconsultation capabilities integrating farmers with certified veterinarians.
* **Location-Based Radar:** Geolocation services to instantly find and chat with nearby **Traders**, **Veterinarians**, and **Gau Sevaks** based on proximity.

### 📚 Clinical Guide & About Section
* **Comprehensive Clinical Guide:** A built-in veterinary encyclopedia detailing symptoms, first-aid protocols, and safety measures for a variety of livestock species and diseases.
* **Safety & Best Practices:** Dedicated sections outlining bio-security measures, quarantine protocols, and safe handling of infected livestock.
* **About the Technology:** An in-app technical breakdown explaining our use of Computer Vision, Voice Activity detection, and Biometric estimation to build trust with the users.

---

## 🔐 User Roles & Authentication
Built on top of **Supabase Auth**, the login and sign-up pages are highly dynamic and role-specific:

* **Role-Based Access Control (RBAC):** Users must select their profile type during sign-up:
  1. **Farmer:** Simplified UI focused on rapid scanning, local alerts, and connecting with vets.
  2. **Veterinarian:** Advanced UI with teleconsultation queues, deep diagnostic data, and prescription capabilities.
  3. **Admin:** System oversight, epidemiological outbreak mapping, and user management.
* **Location & Profile Setup:** Sign-up includes location-based tagging to fuel the local Radar and Seasonal Threat mapping.

---

## 🧠 Deep Dive: AI Diagnostics & Smart AI

Our AI Inference Engine utilizes a multimodal approach to deliver clinical-grade diagnostics:

* **Computer Vision (EfficientNet):** A custom-trained, two-stage Convolutional Neural Network pipeline for precise dermatological lesion detection (e.g., Lumpy Skin Disease).
* **Biometric Estimation (YOLOv8):** Advanced visual geometry and spatial instance segmentation to estimate livestock Weight (kg) and Body Condition Score (BCS) without physical scales.
* **Voice Activity & Audio Processing:** PyTorch-based Autoencoders analyze respiratory MFCC spectrograms to detect invisible coughing and lung anomalies.
* **Critical NLP & DERT System:** The **Diagnostic Early Response & Triage (DERT)** system utilizes Natural Language Processing (NLP) to analyze user-inputted symptoms (via text or voice assistant), combining it with visual data to rank threat severity and recommend immediate actions.

---

## 🌍 Localization, Settings & UI Design

JeevRaksha is built to break digital literacy barriers in deep rural environments.

* **Native Display Translation:** The entire interface dynamically translates from English into regional languages: **Telugu, Tamil, and Malayalam** (alongside Hindi and Kannada).
* **Floating AI Voice Assistant:** Voice-guided navigation and symptom reporting for users unable to type.
* **UI Design Preferences:** A beautifully crafted, responsive UI (Tailwind CSS) offering contrast adjustments and theme toggles for outdoor visibility (Sunlight/Dark modes).
* **Advanced Settings:** Complete control over **Security** (password updates, session management) and **Notifications** (SMS/Push alerts for local disease outbreaks).

---

## 📈 Model Performance & Research (Confusion Matrices)

Our Computer Vision models were trained on a highly curated, custom livestock dataset using `EfficientNet` architectures. 

*(Note: Replace the placeholder images below with the actual output plots from your `train_stage1.py` and `train_species2.py` scripts!)*

### Species Classification Accuracy
The foundational model achieves high precision across 6 core livestock species.
> `![Species Confusion Matrix](link_to_your_species_confusion_matrix_image.png)`

### Two-Stage Disease Detection
The specialized dermatological models demonstrate robust sensitivity to critical pathologies, minimizing false negatives for highly contagious diseases.
> `![Stage 1 Disease Matrix](link_to_your_stage1_confusion_matrix_image.png)`
> `![Stage 2 Disease Matrix](link_to_your_stage2_confusion_matrix_image.png)`

---

## 🏗️ System Architecture

* **Frontend App:** **Next.js (React)** with Tailwind CSS for a lightning-fast, mobile-first Web App.
* **Backend & Database:** **Supabase** handling PostgreSQL relational data, secure authentication, and real-time scan history synchronization.
* **AI Inference Engine:** A high-speed **Flask** API routing multimodal payloads to PyTorch and Ultralytics (YOLO) deep learning pipelines.

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

Start the frontend server:

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

*Note: Ensure you have downloaded the heavy PyTorch model weights (`.pth` and `.pt` files) and placed them in the root directory.*

Start the backend API:

```bash
python app.py
# The AI Engine will listen on http://localhost:5000

```

---

*Developed with dedication for the future of rural agriculture and veterinary science.*

```

```
