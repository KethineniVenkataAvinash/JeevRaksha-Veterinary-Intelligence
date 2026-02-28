'use client';

import React from "react";
import { 
  HeartPulse, Cpu, BrainCircuit, 
  Waves, MessageSquare, Database, ArrowRight, Activity, 
  BarChart3, Globe, Bot, Scale, FileText, Video
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-20 animate-in fade-in duration-700 pb-24 px-4 sm:px-6 lg:px-8">
      
      {/* --- HERO SECTION --- */}
      <div className="text-center max-w-4xl mx-auto pt-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vet-blue-50 border border-vet-blue-100 text-vet-blue-700 font-bold text-sm mb-8 shadow-sm">
          <Activity className="h-4 w-4" /> JeevRaksha Platform Overview & Architecture 
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
          The Comprehensive <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-vet-blue-600 via-indigo-600 to-purple-600">
            JeevRaksha AI
          </span> Platform
        </h1>
        <p className="text-slate-500 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
          An enterprise-grade, multimodal artificial intelligence ecosystem built to democratize expert-level veterinary diagnostics, ensure biological security, and protect the agrarian economy of India.
        </p>
      </div>

      {/* --- THE MISSION & CORE PROBLEM --- */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-200 p-8 sm:p-12 relative overflow-hidden group hover:border-vet-blue-200 transition-colors duration-500">
        <div className="absolute -top-32 -right-32 h-80 w-80 bg-gradient-to-br from-vet-blue-100 to-purple-100 rounded-full blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900">Why JeevRaksha Exists</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              India is home to the largest livestock population in the world. However, transboundary viral diseases like <strong>Lumpy Skin Disease (LSD)</strong>, <strong>Foot-and-Mouth Disease (FMD)</strong>, and severe respiratory pathogens routinely inflict catastrophic economic damage on marginal dairy farmers due to delayed diagnoses.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              JeevRaksha acts as an instant, highly accurate early-warning radar. By analyzing visual symptoms, respiratory audio, and clinical inputs, the platform enables rapid spatial isolation, recommends DAHD-approved pharmacological protocols, and bridges the gap between rural farmers and certified veterinarians.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-100 text-center hover:border-vet-blue-300 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <p className="text-5xl font-extrabold text-vet-blue-600 mb-2">96%</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Vision Accuracy</p>
            </div>
            <div className="bg-slate-50/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-100 text-center hover:border-purple-300 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <p className="text-5xl font-extrabold text-purple-600 mb-2">&lt;2s</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Analysis Time</p>
            </div>
            <div className="bg-slate-50/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-100 text-center hover:border-vet-green-300 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <p className="text-5xl font-extrabold text-vet-green-600 mb-2">5+</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI Models</p>
            </div>
            <div className="bg-slate-50/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-100 text-center hover:border-slate-400 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <p className="text-5xl font-extrabold text-slate-800 mb-2">24/7</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Monitoring</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- PLATFORM FEATURES --- */}
      <div className="space-y-12 pt-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Platform Capabilities</h2>
          <p className="text-slate-500 text-lg">Every module built into JeevRaksha is designed for precision, speed, and usability.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-vet-blue-200 hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-14 w-14 bg-vet-blue-50 text-vet-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <BrainCircuit className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-3">Computer Vision</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Upload images of dermal anomalies. The AI utilizes fine-tuned <strong>EfficientNet-V2</strong> models to detect edge-maps and identify Lumpy Skin Disease, FMD blisters, and Mange.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-vet-green-200 hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-14 w-14 bg-vet-green-50 text-vet-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Waves className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-3">Acoustic Analysis</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Record an animal&apos;s cough or breathing. The system converts audio into <strong>MFCC Spectrograms</strong> to identify respiratory distress, pneumonia, and lung infections.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-3">Clinical NLP (BERT)</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Leveraging advanced <strong>Clinical BERT</strong> models to parse textual symptoms and conversational inputs, cross-referencing them against known veterinary pathologies for accurate triaging.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-purple-200 hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-14 w-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Scale className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-3">Biometric Estimation</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Using <strong>YOLOv8</strong> instance segmentation, the system calculates an animal&apos;s geometric mass to estimate Weight (kg) and Body Condition Score (BCS) without industrial scales.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-200 hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-14 w-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Bot className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-3">Voice-Activated AI</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              A continuously listening, hands-free voice assistant. Speak commands in multiple regional languages to instantly navigate the app and execute complex diagnostic tools.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-teal-200 hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-14 w-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-3">Advanced Analytics</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Real-time dashboards powered by <strong>Recharts</strong>. Visualize herd health rates, track disease outbreaks across timeframes, and generate downloadable comprehensive reports.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-rose-200 hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-14 w-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Video className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-3">Tele-Consultation</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Seamlessly connect marginal farmers with certified veterinarians through high-definition video links, enabling remote inspections and immediate professional guidance.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-14 w-14 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Globe className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-3">Regional Threat Radar</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              The dashboard adapts to your registered location, predicting localized disease risks and cross-referencing them with current seasonal pathogen data for proactive measures.
            </p>
          </div>

        </div>
      </div>

      

[Image of cloud computing architecture diagram]

      
      {/* --- ARCHITECTURE & TECH STACK --- */}
      <div className="pt-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Technical Architecture</h2>
          <p className="text-slate-500 text-lg">The robust, scalable infrastructure powering the JeevRaksha platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="flex items-start gap-5 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shrink-0"><Cpu className="h-7 w-7 text-slate-700" /></div>
             <div>
               <h3 className="font-extrabold text-xl text-slate-900 mb-2">Frontend App</h3>
               <p className="text-slate-600 leading-relaxed">Built on <strong>Next.js (App Router)</strong> and React. Designed to be completely responsive, highly accessible, and optimized for low-bandwidth rural environments.</p>
             </div>
          </div>
          <div className="flex items-start gap-5 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shrink-0"><Database className="h-7 w-7 text-slate-700" /></div>
             <div>
               <h3 className="font-extrabold text-xl text-slate-900 mb-2">Backend & Database</h3>
               <p className="text-slate-600 leading-relaxed">Powered by <strong>Supabase (PostgreSQL)</strong>. Handles secure authentication, stringent Row Level Security (RLS) policies, and encrypted image storage.</p>
             </div>
          </div>
          <div className="flex items-start gap-5 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shrink-0"><Bot className="h-7 w-7 text-slate-700" /></div>
             <div>
               <h3 className="font-extrabold text-xl text-slate-900 mb-2">AI Inference Engine</h3>
               <p className="text-slate-600 leading-relaxed">Python-based <strong>Flask REST APIs</strong> handle the heavy lifting. TensorFlow, PyTorch, and Hugging Face Transformers execute Vision, Audio, YOLO, and BERT models.</p>
             </div>
          </div>
          <div className="flex items-start gap-5 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shrink-0"><Globe className="h-7 w-7 text-slate-700" /></div>
             <div>
               <h3 className="font-extrabold text-xl text-slate-900 mb-2">Localization & Voice</h3>
               <p className="text-slate-600 leading-relaxed">Integrated Google Translate API combined with the browser&apos;s native Web Speech API provides real-time, zero-latency multilingual conversational routing.</p>
             </div>
          </div>
        </div>
      </div>

      {/* --- CALL TO ACTION --- */}
      <div className="mt-16 bg-gradient-to-br from-vet-blue-50 to-indigo-50 rounded-[2.5rem] p-10 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 border border-vet-blue-100/50 shadow-lg shadow-vet-blue-100/20">
         <div className="text-center md:text-left">
           <h3 className="text-3xl font-extrabold text-slate-900 mb-3">Ready to secure your herd?</h3>
           <p className="text-slate-600 text-lg max-w-xl">Start utilizing the diagnostic engine immediately to protect your livestock and optimize your yield.</p>
         </div>
         <Link href="/diagnose" className="bg-vet-blue-600 hover:bg-vet-blue-700 text-white font-bold h-16 px-10 rounded-2xl transition-all hover:scale-105 hover:shadow-xl hover:shadow-vet-blue-600/20 flex items-center justify-center gap-3 shrink-0 text-lg w-full md:w-auto">
           Launch Diagnostic Center <ArrowRight className="h-6 w-6" />
         </Link>
      </div>

      <p className="text-sm font-semibold text-slate-400 text-center pt-10 border-t border-slate-200 mt-16">
        JeevRaksha System | © {new Date().getFullYear()} Developed for Indian Agriculture
      </p>
    </div>
  );
}