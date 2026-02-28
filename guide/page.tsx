'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, BookOpen, Syringe, ShieldAlert, Activity, AlertTriangle, Bug, Stethoscope, Briefcase, FileText, MapPin, Calendar, Landmark, Coins, Printer, CalendarClock } from 'lucide-react';

// --- COMPREHENSIVE VETERINARY DISEASE DATABASE ---
const diseasesData = [
  // ================= CATTLE & BUFFALO DISEASES =================
  {
    id: "lsd",
    name: "Lumpy Skin Disease (LSD)",
    species: ["Cattle", "Buffalo"],
    basicId: "Viral (Family: Poxviridae, Genus: Capripoxvirus) - Primary: Cattle, occasionally Buffalo",
    etiology: "Large double-stranded DNA virus. Survives in dried scabs for 3–6 months. Heat sensitive above 55°C but protected in organic matter.",
    transmission: "Primary Vectors: Mosquitoes, Stable flies, Ticks. Secondary: Contaminated needles, Direct contact. Incubation: 4–14 days. Not zoonotic.",
    pathogenesis: "Virus enters bloodstream, attacks endothelial cells. Causes vasculitis leading to edema, skin necrosis, and nodular growth.",
    clinical: "Early: Fever > 40°C, Depression, reduced appetite, drop in milk yield. Advanced: Firm nodules (2–5 cm diameter), swollen legs (pitting edema).",
    diagnosis: "Field: Fever, Hard nodules, Leg swelling. Lab: PCR, Virus isolation, ELISA.",
    treatment: "No specific antiviral cure. Oxytetracycline (10 mg/kg IM) for 3-5 days. Meloxicam (0.5 mg/kg IM). Chlorpheniramine maleate.",
    prevention: "Goat Pox vaccine (heterologous) or LSD specific vaccine. First dose above 4 months age.",
    govPrograms: "National LSD Vaccination Drive, Movement restriction during outbreaks.",
    economic: "Milk drop: 30–50%; Abortion risk: 10%; Hide damage. Treatment cost: ₹800–₹2000.",
    publicHealth: "Not zoonotic. Indirect impact via milk supply disruption.",
    locations: "Rajasthan, Gujarat, Punjab, Haryana, Uttar Pradesh, Maharashtra.",
    season: "Peak: July–October (Monsoon).",
    caseStudy: "Rajasthan, 2022. 40-cow dairy farm. 28 cows infected. Milk dropped 45%. 3 deaths. Recovery in 4 weeks."
  },
  {
    id: "fmd",
    name: "Foot-and-Mouth Disease (FMD)",
    species: ["Cattle", "Buffalo", "Sheep", "Goat"],
    basicId: "Viral (Picornaviridae, Genus: Aphthovirus) - Primary: Cattle, Buffalo, Sheep, Goats, Pigs",
    etiology: "Single-stranded RNA virus. Serotypes in India: O (most common), A, Asia-1. Survives in cool moist conditions.",
    transmission: "Primary: Aerosol (airborne). Secondary: Direct contact, contaminated equipment, milk. Incubation: 2–14 days. Rare in humans.",
    pathogenesis: "Replicates in pharynx, enters bloodstream, targets epithelial cells causing vesicle formation and painful ulcers on tongue, gums, lips, hooves.",
    clinical: "Fever (> 40°C), excess salivation (rope-like drool), smacking lips, blisters on tongue & mouth, lameness due to hoof blisters.",
    diagnosis: "Field: Sudden salivation, mouth blisters, lameness. Lab: PCR.",
    treatment: "No antiviral cure. Potassium permanganate mouth wash (1:1000). Copper sulfate footbath. Oxytetracycline to prevent secondary infection.",
    prevention: "Trivalent inactivated FMD vaccine. First dose: 4 months age, Booster every 6 months.",
    govPrograms: "National Animal Disease Control Programme (NADCP).",
    economic: "Severe milk loss (50-80%), reduced fertility. Billions annually in losses.",
    publicHealth: "Rare zoonotic cases. Milk safe after boiling.",
    locations: "Nationwide, especially in unvaccinated herds.",
    season: "Peak Seasons: Winter, Post-monsoon.",
    caseStudy: "Uttar Pradesh, 2023. 60 cow dairy. 25 affected. Milk drop 70%. Recovered in 3 weeks."
  },
  {
    id: "hs",
    name: "Hemorrhagic Septicemia (HS) / Gal-Ghotu",
    species: ["Buffalo", "Cattle"],
    basicId: "Bacterial (Septicemic) - Primary: Buffalo (most susceptible), Cattle",
    etiology: "Pasteurella multocida (Serotype B:2). Gram-negative coccobacillus. Survives days in moist soil. Peak survival during Monsoon.",
    transmission: "Inhalation of infected droplets, contaminated water troughs. Incubation: 6 hours – 3 days (very fast).",
    pathogenesis: "Bacteria multiply rapidly in respiratory tract, enter bloodstream, release endotoxins. Massive vascular damage and severe throat edema.",
    clinical: "Sudden high fever (> 41°C), severe throat swelling, brisket edema, grunting breathing sound, tongue protrusion. Death in 24-48 hrs.",
    diagnosis: "Field: Sudden monsoon outbreak, neck swelling. Lab: PCR, Blood smear (bipolar bacteria).",
    treatment: "Immediate treatment critical. Oxytetracycline (10 mg/kg IM/IV) or Ceftiofur. Meloxicam, Chlorpheniramine, IV Normal saline.",
    prevention: "Alum-precipitated or Oil-adjuvant HS vaccine. First dose: 6 months age, annual booster before monsoon.",
    govPrograms: "Mass vaccination drives before monsoon season.",
    economic: "Milk drop: 50–80%. Treatment cost: ₹1000–₹3000 per animal. Extremely high mortality if untreated.",
    publicHealth: "Rare zoonotic cases in immunocompromised humans. Avoid handling without gloves.",
    locations: "Assam, West Bengal, Bihar, UP, Rajasthan, Madhya Pradesh.",
    season: "Peak Months: July–September (Monsoon).",
    caseStudy: "Bihar, 2024. 30 buffalo herd. 12 died within 3 days. Unvaccinated. Mass vaccination post-outbreak."
  },
  {
    id: "ringworm",
    name: "Ringworm (Dermatophytosis)",
    species: ["Cattle", "Buffalo", "Goat", "Sheep", "Camel", "Horse"],
    basicId: "Fungal disease - Primary: Cattle, Buffalo, Goats, Sheep, Horses, Camels",
    etiology: "Trichophyton verrucosum (Cattle/Buffalo), Trichophyton mentagrophytes (Goats/Sheep). Survives in shed walls/wood for 6–12 months.",
    transmission: "Direct skin contact, shared grooming tools. Incubation: 7-21 days. Zoonotic: Yes.",
    pathogenesis: "Fungal spores invade keratin layer, spread radially outward. Immune system heals center, creating characteristic ring shape.",
    clinical: "Circular lesion (2–6 cm), grayish-white crust, hair falls off, dry scaly center. Perfect circular symmetry.",
    diagnosis: "Field: Circular hairless patches, Gray crust. Wood’s Lamp Test. Lab: Fungal culture, PCR.",
    treatment: "Enilconazole (0.2% spray). 2–5% Tincture iodine daily. Severe cases: Griseofulvin orally.",
    prevention: "Isolate infected animals. Disinfect with 1% formalin. Reduce overcrowding.",
    govPrograms: "Farm management and biosecurity protocols.",
    economic: "Reduced weight gain in calves (5–10%), hide rejection. Labor treatment cost: ₹200–₹800.",
    publicHealth: "Highly zoonotic. Farmers commonly infected on arms, neck, hands.",
    locations: "Uttar Pradesh, Rajasthan, Maharashtra, Punjab, Karnataka.",
    season: "Monsoon (July–September) and Winter housing period.",
    caseStudy: "Maharashtra, 2023. 20 calf unit. 12 calves infected through shared brush. Controlled in 3 weeks."
  },
  {
    id: "mange",
    name: "Mange (Sarcoptic / Psoroptic)",
    species: ["Cattle", "Buffalo", "Goat", "Sheep", "Camel", "Horse"],
    basicId: "Parasitic (Ectoparasitic skin disease) - Mites",
    etiology: "Burrowing mite (Sarcoptes scabiei). Highly contagious. Survive off host 5–20 days.",
    transmission: "Direct contact, shared ropes. Incubation: 10–14 days. Zoonotic: Temporary itching in humans.",
    pathogenesis: "Female mite burrows into epidermis, lays eggs. Triggers severe itching (pruritus) and skin thickening.",
    clinical: "Patchy hair loss, thick gray crusts, red inflamed skin, severe rubbing against poles. Skin becomes wrinkled and bleeds.",
    diagnosis: "Field: Severe itching, thick crusted skin. Lab: Deep skin scraping, microscopy.",
    treatment: "Ivermectin (0.2 mg/kg SC. Repeat after 10–14 days). Amitraz spray (0.025%). Treat entire herd simultaneously.",
    prevention: "Isolate affected, disinfect sheds with 1% lime wash.",
    govPrograms: "Routine biosecurity protocols.",
    economic: "Milk drop: 20–40%, Weight loss: 10–15%, Hide damage.",
    publicHealth: "Sarcoptic mange causes temporary itching in humans. Self-limiting.",
    locations: "Rajasthan, Uttar Pradesh, Madhya Pradesh, Maharashtra, Karnataka.",
    season: "Winter (Nov–Feb), Late Monsoon.",
    caseStudy: "UP, 2024. 15 dairy cows. 9 developed sarcoptic mange. Milk drop: 35%. Ivermectin administered."
  },
  {
    id: "papillomatosis",
    name: "Bovine Papillomatosis (Warts)",
    species: ["Cattle", "Buffalo"],
    basicId: "Viral (Bovine Papillomavirus - BPV)",
    etiology: "Double-stranded DNA virus (BPV-1, 2, 3). Highly resistant in the environment.",
    transmission: "Direct skin contact, Milking equipment, Castration tools. Incubation: 1–8 months. Not zoonotic.",
    pathogenesis: "Virus enters skin wound, infects basal epithelial cells, causing uncontrolled benign tumor formation.",
    clinical: "Solid cauliflower-like growths or warts protruding from skin. Frequently on head, neck, shoulders, and teats.",
    diagnosis: "Field: Visible cauliflower growth on young animal. Lab: PCR.",
    treatment: "Most regress naturally. Autogenous Vaccine (crushed wart tissue). Surgical removal for teat warts.",
    prevention: "Disinfect equipment, use sterile needles.",
    govPrograms: "No commercial universal BPV vaccine widely used in India.",
    economic: "Milk drop (teat cases), veterinary surgery cost ₹500–₹2000, hide damage.",
    publicHealth: "Not zoonotic. Milk safe for consumption.",
    locations: "Punjab, Haryana, Uttar Pradesh, Maharashtra, Karnataka.",
    season: "No strict seasonal pattern. Higher in winter.",
    caseStudy: "Punjab Dairy Farm, 2023. 25 cows. 8 developed teat papillomas. Milk drop 20%. Regression in 6 weeks."
  },
  {
    id: "ibr",
    name: "Infectious Bovine Rhinotracheitis (IBR) / Red Nose",
    species: ["Cattle"],
    basicId: "Viral (Respiratory & Reproductive) - Bovine Herpesvirus-1",
    etiology: "Double-stranded DNA enveloped virus. Establishes lifelong latent infection.",
    transmission: "Aerosol (coughing, sneezing), Semen. Incubation: 2-6 days. Not zoonotic.",
    pathogenesis: "Infects nasal mucosa, enters bloodstream, reaches uterus causing abortion.",
    clinical: "Fever > 40°C, Red inflamed nostrils ('Red Nose'), yellow nasal discharge, rapid breathing, late-term abortions.",
    diagnosis: "Field: Red nose, sudden abortion storm. Lab: PCR.",
    treatment: "No antiviral cure. Oxytetracycline (10 mg/kg IM) or Enrofloxacin. Meloxicam, Vitamin AD3E.",
    prevention: "Vaccination (MLV or Inactivated) at 4-6 months age. Mandatory screening for breeding bulls.",
    govPrograms: "Mandatory semen testing and PCR screening of breeding bulls at AI Centers.",
    economic: "Loss per abortion ₹15,000–₹40,000, repeat breeding, milk drop.",
    publicHealth: "Not zoonotic.",
    locations: "Punjab, Haryana, Uttar Pradesh, Gujarat, Karnataka.",
    season: "Winter, Transport stress periods.",
    caseStudy: "Haryana Dairy, 2024. 60 cows. 8 abortions in 2 weeks. PCR confirmed IBR."
  },
  {
    id: "btb",
    name: "Bovine Tuberculosis (bTB)",
    species: ["Cattle", "Buffalo", "Goat"],
    basicId: "Bacterial (Chronic Granulomatous Disease)",
    etiology: "Mycobacterium bovis. Acid-fast bacillus, slow-growing, thick waxy wall. Survives months in dark, moist environments.",
    transmission: "Inhalation of infected aerosols, ingestion of contaminated milk. Incubation: Months to years. Zoonotic: Yes.",
    pathogenesis: "Bacteria enter lungs, survive inside macrophages, form granulomas (tubercles). Slow tissue destruction.",
    clinical: "Early: None. Advanced: Chronic hacking cough, progressive severe weight loss, exercise intolerance.",
    diagnosis: "Field: Chronic cough, progressive wasting. Lab: Tuberculin Skin Test (TST).",
    treatment: "Treatment of bovine TB in cattle is NOT recommended in India due to public health risks.",
    prevention: "Infected animals are culled or isolated permanently. Pasteurization of milk.",
    govPrograms: "Test and cull policy. Segregation of positive animals.",
    economic: "Chronic milk loss, reduced fertility, trade restrictions.",
    publicHealth: "Highly zoonotic. Human infection causes Tuberculosis via raw milk.",
    locations: "Punjab, Haryana, Uttar Pradesh, Maharashtra, Karnataka.",
    season: "Year-round, heightened risk in high-density housing.",
    caseStudy: "Punjab, 2023. 100 cow dairy. 12 positive on skin test. Strict pasteurization enforced."
  },
  {
    id: "brd",
    name: "Bovine Respiratory Disease (BRD) Complex / Pneumonia",
    species: ["Cattle", "Buffalo"],
    basicId: "Multifactorial (Viral + Bacterial + Stress)",
    etiology: "Primary Viruses (IBR, BRSV) + Secondary Bacteria (Mannheimia, Pasteurella) + Stress triggers.",
    transmission: "Aerosol droplets. Incubation: 2-7 days.",
    pathogenesis: "Stress weakens immunity. Virus damages respiratory lining. Bacteria invade lungs causing severe inflammation.",
    clinical: "Fever > 40°C, thick yellow nasal discharge, drooping ears, rapid shallow breathing, open-mouth breathing.",
    diagnosis: "Field: Fever + nasal discharge + rapid breathing. Lab: PCR, Bacterial culture.",
    treatment: "Early aggressive antibiotics (Ceftiofur or Enrofloxacin). Meloxicam. IV Fluids.",
    prevention: "Multivalent BRD vaccines. Minimize transport stress, improve ventilation.",
    govPrograms: "Standard farm biosecurity and vaccination.",
    economic: "Major calf mortality (20-50% if untreated).",
    publicHealth: "Not zoonotic.",
    locations: "Widespread (Endemic across India).",
    season: "Winter (Dec–Feb), Monsoon (July–Sept).",
    caseStudy: "Haryana, 2024. 40 calf rearing unit. 15 calves developed pneumonia. 2 deaths."
  },
  {
    id: "rabies",
    name: "Rabies (Mad Dog Disease)",
    species: ["Cattle", "Buffalo", "Goat", "Sheep", "Camel", "Horse"],
    basicId: "Viral (Neurological) - Rhabdoviridae",
    etiology: "Rabies virus. Bullet-shaped enveloped virus. Survives poorly outside host.",
    transmission: "Bite from infected dog. Incubation: 2 weeks – 3 months. Highly Zoonotic.",
    pathogenesis: "Virus replicates locally in muscle, travels along nerves to spinal cord, reaches brain causing encephalitis.",
    clinical: "Furious: Aggression, excessive bellowing, hypersensitivity. Paralytic: Hind limb weakness, drooping jaw, paralysis.",
    diagnosis: "Field: Dog bite history + neurological signs. Lab: dFAT on brain tissue.",
    treatment: "No treatment once clinical signs appear. Animal must be isolated and humanely euthanized.",
    prevention: "Livestock Schedule vaccination (Raksharab). Immediate wound washing post-exposure.",
    govPrograms: "National Rabies Control Programme (NRCP).",
    economic: "Death of valuable cattle, human treatment costs.",
    publicHealth: "Extremely serious zoonotic disease. Fatal to humans.",
    locations: "Widespread, especially rural areas.",
    season: "Year-round.",
    caseStudy: "Uttar Pradesh, 2024. Cow bitten by stray dog developed aggression after 1 month. Two farm workers received PEP."
  },
  {
    id: "brucellosis",
    name: "Brucellosis",
    species: ["Cattle", "Buffalo", "Goat", "Sheep"],
    basicId: "Bacterial (Reproductive & Zoonotic)",
    etiology: "Brucella abortus (Cattle/Buffalo). Gram-negative intracellular bacterium. Survives months in aborted fetus tissues.",
    transmission: "Contact with aborted fetus, placenta, uterine discharge. Incubation: Weeks to months. Highly Zoonotic.",
    pathogenesis: "Bacteria engulfed by macrophages, travel to reproductive organs. Causes placentitis and fetal death in pregnant cows.",
    clinical: "In Cows: Abortion in last trimester, retained placenta, repeat breeding. In Bulls: Swollen testicles, infertility.",
    diagnosis: "Field: Late-term abortion storm. Serology: Rose Bengal Test (RBT), ELISA. Lab: PCR.",
    treatment: "Treatment is NOT recommended due to chronic carrier state and public health risks. Isolated permanently.",
    prevention: "Brucella abortus S19 vaccine (Female calves: 4–8 months age).",
    govPrograms: "National Animal Disease Control Programme (NADCP).",
    economic: "Abortion loss ₹15,000–₹50,000 per case, milk drop 10–25%.",
    publicHealth: "Very serious zoonotic disease (Undulating fever in humans). Raw milk consumption is a major risk.",
    locations: "Punjab, Haryana, Uttar Pradesh, Rajasthan, Gujarat, Karnataka.",
    season: "Year-round, vulnerability during 5-9 months of pregnancy.",
    caseStudy: "Rajasthan, 2024. 50 cow dairy. 6 abortions in 2 months. RBT positive. Milk production dropped 20%."
  },
  {
    id: "blackquarter",
    name: "Black Quarter (BQ) / Black-leg",
    species: ["Cattle", "Buffalo"],
    basicId: "Bacterial (Clostridial, Toxemic)",
    etiology: "Clostridium chauvoei. Spore-forming anaerobic rod. Spores survive in soil for years.",
    transmission: "Ingestion of spores from contaminated soil. Trigger: Muscle injury, heavy exercise. Incubation: 1–5 days.",
    pathogenesis: "Spores germinate after trigger, release toxins causing muscle necrosis, gas production, and severe toxemia. Death due to septic shock.",
    clinical: "Sudden fever (> 41°C), lameness. Hot, painful muscle swelling, crepitus (crackling sound due to gas). Rapid death.",
    diagnosis: "Field: Young healthy animal, sudden lameness, gas-filled muscle swelling. Lab: Smear from muscle (Gram-positive rods).",
    treatment: "Immediate treatment required. High-Dose Penicillin (20,000–40,000 IU/kg IM). Oxytetracycline.",
    prevention: "Black Quarter Vaccine (Clostridial toxoid). First dose: 6 months age. Annual vaccination before monsoon.",
    govPrograms: "Deep burial of carcass with lime protocols.",
    economic: "Sudden loss of healthy young animals. Major rural economic impact. Untreated mortality 80-100%.",
    publicHealth: "Not zoonotic. Carcass handling must follow safety protocols.",
    locations: "Flood-prone areas, Black cotton soil regions.",
    season: "Monsoon (July–September).",
    caseStudy: "Madhya Pradesh, 2024. 20 cattle herd. 3 young bulls died within 24 hrs. Postmortem confirmed BQ."
  },
  {
    id: "milkfever",
    name: "Milk Fever (Hypocalcemia)",
    species: ["Cattle"],
    basicId: "Metabolic (Nutritional / Endocrine imbalance)",
    etiology: "Sudden demand for calcium at onset of lactation. Blood calcium drops below 7 mg/dL.",
    transmission: "Not infectious. Not contagious.",
    pathogenesis: "Blood calcium drops, nerve transmission impaired, muscle contraction weakens. Leads to weak limbs, reduced rumen motility, and eventually cardiac failure.",
    clinical: "Stage 2: Cow sitting in sternal position, neck bent to side ('S-shaped neck'), cold ears, dry muzzle. Stage 3: Unconsciousness.",
    diagnosis: "Field: Recent calving history, recumbent cow, cold ears, weak pulse. Lab: Serum calcium test.",
    treatment: "Calcium Borogluconate (400–500 ml IV slowly). Subcutaneous Calcium. Oral Calcium Gel.",
    prevention: "Low calcium diet during dry period. Preventive Oral Calcium given at calving.",
    govPrograms: "Nutritional management advisories.",
    economic: "Milk loss: 20–40% in early lactation. Treatment cost: ₹300–₹800.",
    publicHealth: "Not zoonotic. Milk safe after recovery.",
    locations: "Widespread across dairy regions.",
    season: "Occurs within 24–72 hours after calving.",
    caseStudy: "Punjab Dairy, 2024. 3 Jersey cows affected within 24 hrs of calving. Treated with 500 ml calcium IV. All recovered."
  },
  {
    id: "buffalopox",
    name: "Buffalo Pox",
    species: ["Buffalo", "Cattle"],
    basicId: "Viral (Poxvirus) - Vaccinia virus",
    etiology: "Double-stranded DNA virus. Survives in dried scabs for weeks–months.",
    transmission: "Direct contact during milking. Milker’s hands. Incubation: 3–7 days. Zoonotic: Yes.",
    pathogenesis: "Virus enters through skin cracks, infects epithelial cells, forms vesicles → pustules → scabs.",
    clinical: "Small red macules, pain during milking. Raised papules, fluid-filled vesicles, teat swelling, thick brown scabs.",
    diagnosis: "Field: Vesicles on teats, painful milking, milker hand lesions. Lab: PCR.",
    treatment: "No specific antiviral treatment. Topical Antiseptic: Povidone Iodine. Gentamicin spray.",
    prevention: "Wear gloves during milking, disinfect teats before & after milking. No routine commercial vaccine widely available.",
    govPrograms: "Hygiene promotion protocols.",
    economic: "Severe milk drop (up to 70%), painful milking. Treatment cost ₹1000–₹2500.",
    publicHealth: "Zoonotic risk to milkers (painful nodular lesions on fingers). Milk should be boiled.",
    locations: "Widespread in buffalo rearing states.",
    season: "Post-monsoon, Winter housing.",
    caseStudy: "Maharashtra Dairy, 2024. 18 lactating buffaloes. 10 developed teat vesicles. Milk drop: 60%. Milker developed hand lesions."
  },
  {
    id: "rainscald",
    name: "Dermatophilosis (Rain Scald / Rain Rot)",
    species: ["Cattle", "Buffalo", "Sheep", "Goat", "Horse"],
    basicId: "Bacterial (Skin infection)",
    etiology: "Dermatophilus congolensis. Gram-positive branching filamentous bacterium ('railroad track' appearance).",
    transmission: "Direct contact, shared grooming tools, ticks & biting flies. Incubation: 1–2 weeks.",
    pathogenesis: "Prolonged moisture weakens skin barrier, bacteria invade epidermis. Causes matted hair and thick crust formation.",
    clinical: "Thick dirty-yellow crusts, 'paint brush' lesions (tufts of hair sticking out), matted hair on back, neck, rump.",
    diagnosis: "Field: Recent rainfall exposure, crusty scabs on back. Lab: Smear from scab (Gram stain).",
    treatment: "Oxytetracycline (10–20 mg/kg IM). Remove scabs gently, apply Povidone iodine.",
    prevention: "Provide dry shelter, improve drainage, dry animals after rain. Disinfection with 1% formalin spray.",
    govPrograms: "Shelter management advisories.",
    economic: "Milk reduction, hide damage, wool loss in sheep. Treatment cost ₹500–₹1500.",
    publicHealth: "Rarely zoonotic. Use gloves.",
    locations: "Flood-prone areas.",
    season: "Monsoon (July–September).",
    caseStudy: "Karnataka, 2024. 22 buffalo herd. 14 affected after heavy rains. Treated with oxytetracycline."
  },
  {
    id: "ticks",
    name: "Tick Infestations",
    species: ["Cattle", "Buffalo", "Goat", "Sheep", "Camel", "Horse"],
    basicId: "Parasitic (Ectoparasite – Arthropod)",
    etiology: "Rhipicephalus microplus, Hyalomma anatolicum. Blood-sucking 3-host life cycle. Thrive in warm humid climate.",
    transmission: "Pasture grazing, Direct animal contact.",
    pathogenesis: "Sucks blood leading to anemia. Transmits secondary fevers like Babesiosis, Theileriosis.",
    clinical: "Visible ticks, anemia (pale gums), weakness.",
    diagnosis: "Field: Visual tick presence, pale mucous membranes.",
    treatment: "Ivermectin (0.2 mg/kg SC) OR Deltamethrin Spray. Treat entire herd simultaneously.",
    prevention: "Rotate grazing fields, lime wash walls, pre-monsoon acaricide rotation.",
    govPrograms: "Pest control awareness.",
    economic: "Milk loss 20–40%, tick fever mortality. Treatment cost ₹500–₹2000.",
    publicHealth: "Proper PPE recommended during treatment. Ticks can transmit diseases to humans.",
    locations: "Widespread, especially in free-grazing zones.",
    season: "Monsoon & Post-monsoon (July–October).",
    caseStudy: "Andhra Pradesh, 2024. Heavy tick load post-monsoon. 6 developed Babesiosis. Ivermectin applied."
  },

  // ================= GOAT & SHEEP DISEASES =================
  {
    id: "goatpox",
    name: "Goat Pox",
    species: ["Goat"],
    basicId: "Viral (Family: Poxviridae) - Goat Pox Virus (GTPV)",
    etiology: "Large double-stranded DNA virus. Survives in scabs for months.",
    transmission: "Direct contact, Aerosol droplets. Incubation Period: 4–8 days. Not zoonotic.",
    pathogenesis: "Virus replicates in lymph nodes, enters bloodstream, targets skin forming macules → papules → nodules.",
    clinical: "High fever (> 40°C). Red spots, raised firm nodules on muzzle, ears, eyelids, underbelly. High mortality in young kids.",
    diagnosis: "Field: Fever + nodular skin lesions. Laboratory: PCR.",
    treatment: "No specific antiviral cure. Oxytetracycline (10 mg/kg IM). Povidone iodine on lesions.",
    prevention: "Goat Pox Live Vaccine. First dose: 3 months age. Annual booster.",
    govPrograms: "State-level vaccination campaigns during outbreaks.",
    economic: "Kid mortality (50-80%), milk loss, growth retardation.",
    publicHealth: "Not zoonotic.",
    locations: "Widespread, especially in Rajasthan and semi-arid zones.",
    season: "Winter, Post-monsoon.",
    caseStudy: "Rajasthan, 2024. 80-goat flock. 35 affected. 10 kid deaths. Vaccination campaign initiated."
  },
  {
    id: "orf",
    name: "Orf (Contagious Ecthyma / Sore Mouth)",
    species: ["Goat", "Sheep"],
    basicId: "Viral (Skin disease) - Orf Virus (Parapoxvirus)",
    etiology: "Double-stranded DNA virus. Survives in dried scabs for months to years.",
    transmission: "Direct contact, Thorny grazing plants causing mouth injuries. Incubation: 3–7 days. Zoonotic: Yes.",
    pathogenesis: "Virus enters through skin injury, infects epithelial cells, forms thick scabs on Lips, Muzzle, Udder.",
    clinical: "Thick, crusted scabs, bleeding cracks around lips and mouth. Pain during feeding, severe weight loss.",
    diagnosis: "Field: Thick scabs on lips, pain during feeding. Laboratory: PCR.",
    treatment: "Topical Antiseptic: Povidone iodine. Antibiotic Spray: Gentamicin. Systemic Antibiotics if severe.",
    prevention: "Live attenuated Orf vaccine used in endemic areas. Isolate infected animals, wear gloves.",
    govPrograms: "Biosecurity advisory and local vaccination.",
    economic: "Reduced weight gain, growth retardation.",
    publicHealth: "Zoonotic disease (Painful nodular lesion on human hands). Gloves recommended.",
    locations: "Thorny grazing areas across India (e.g., Telangana).",
    season: "Winter, Monsoon.",
    caseStudy: "Telangana, 2024. 60-goat flock. 22 affected. Treated with topical antiseptic. Recovered in 3 weeks."
  },
  {
    id: "ppr",
    name: "Peste des Petits Ruminants (PPR) / Goat Plague",
    species: ["Goat", "Sheep"],
    basicId: "Viral (Systemic) - PPR Virus (PPRV)",
    etiology: "Single-stranded RNA virus (Morbillivirus). Fragile outside host. Spreads rapidly in crowded flocks.",
    transmission: "Primary Route: Aerosol (coughing/sneezing). Incubation Period: 4–6 days. Not zoonotic.",
    pathogenesis: "Replicates in lymphoid tissue causing immunosuppression, severe pneumonia, enteritis, and dehydration.",
    clinical: "High fever (> 40.5°C), thick yellow nasal discharge, mouth ulcers, foul-smelling watery diarrhea, severe pneumonia.",
    diagnosis: "Field: Fever + mouth ulcers + diarrhea. Laboratory: PCR (Gold standard).",
    treatment: "No antiviral cure. Broad-Spectrum Antibiotics (Oxytetracycline/Enrofloxacin). IV Normal saline.",
    prevention: "PPR Live Attenuated Vaccine. First dose: 3 months age. Booster every 3 years.",
    govPrograms: "National PPR Control Programme (Free vaccination campaigns).",
    economic: "Massive kid mortality (50-90% unvaccinated), severe weight loss.",
    publicHealth: "Not zoonotic.",
    locations: "Widespread (e.g., Uttar Pradesh).",
    season: "Winter, Post-monsoon.",
    caseStudy: "Uttar Pradesh, 2024. 100 goat flock. 65 infected. 35 kid deaths. Emergency vaccination for nearby flocks."
  },
  {
    id: "ccpp",
    name: "Contagious Caprine Pleuropneumonia (CCPP)",
    species: ["Goat"],
    basicId: "Bacterial (Mycoplasmal respiratory disease)",
    etiology: "Mycoplasma capricolum subsp. capripneumoniae. No cell wall (penicillin ineffective). Fragile outside host.",
    transmission: "Primary Route: Aerosol droplets. Incubation Period: 3–7 days. Not zoonotic.",
    pathogenesis: "Bacteria inhaled, colonize lung tissue, cause severe fibrinous pneumonia and fluid accumulation.",
    clinical: "High fever (> 41°C), severe coughing, standing with neck extended, mouth open breathing, severe chest pain.",
    diagnosis: "Field: Severe respiratory distress, high mortality. Postmortem: Straw-colored fluid in chest cavity.",
    treatment: "Early treatment crucial. Tylosin (Drug of Choice: 10 mg/kg IM). Oxytetracycline / Enrofloxacin.",
    prevention: "CCPP vaccine available in endemic regions.",
    govPrograms: "Regional vaccination drives.",
    economic: "High mortality (untreated 60-80%). Treatment cost ₹500–₹2000 per goat.",
    publicHealth: "Not zoonotic.",
    locations: "Endemic regions (e.g., Rajasthan).",
    season: "Winter, Stress periods.",
    caseStudy: "Rajasthan, 2024. 75 goat flock. 30 developed respiratory distress. 18 deaths. Tylosin treatment initiated."
  },
  {
    id: "worms",
    name: "Gastrointestinal Parasites (Worms / Haemonchus)",
    species: ["Goat", "Sheep", "Camel"],
    basicId: "Parasitic (Endoparasitic – Nematodes primarily)",
    etiology: "Haemonchus contortus (Barber’s pole worm). Blood-sucking nematode. Eggs hatch in 3–5 days.",
    transmission: "Grazing on contaminated pasture. Incubation Period: 2–4 weeks. Not zoonotic.",
    pathogenesis: "Larvae attach to stomach lining, suck blood continuously. Causes life-threatening anemia.",
    clinical: "Pale eyelids (anemia), weakness, 'Bottle jaw' (fluid swelling under jaw), sudden death in kids.",
    diagnosis: "Field: Pale mucous membranes, Bottle jaw. Laboratory: Fecal egg count (FEC), low PCV.",
    treatment: "Albendazole (10 mg/kg orally) or Ivermectin (0.2 mg/kg SC). Iron injection, Vitamin B complex for anemia.",
    prevention: "Rotational grazing. FAMACHA-guided selective deworming.",
    govPrograms: "Strategic deworming advisory and anti-parasitic distribution.",
    economic: "Reduced weight gain, kid mortality. Major threat to small farmers.",
    publicHealth: "Maintain hygiene during handling feces.",
    locations: "Widespread, highly active in humid zones.",
    season: "Monsoon (July–September).",
    caseStudy: "Telangana, 2024. 120 goat flock. 40 kids severely anemic. Treated with Albendazole. Mortality stopped in 1 week."
  },
  {
    id: "enterotoxemia",
    name: "Enterotoxemia (Overeating Disease / Pulpy Kidney)",
    species: ["Sheep", "Goat"],
    basicId: "Bacterial (Toxemic, Clostridial)",
    etiology: "Clostridium perfringens Type D. Spore-forming anaerobic bacterium. Produces potent epsilon toxin.",
    transmission: "Not contagious in traditional sense. Triggered by sudden diet change (lush pasture, excess grain).",
    pathogenesis: "Rapid bacterial multiplication → Excess toxin production. Absorbed into bloodstream, targets Brain and Kidneys.",
    clinical: "Peracute Form: Sudden death of healthy animal with no warning signs. Acute Form: Severe abdominal pain, convulsions.",
    diagnosis: "Field: Sudden death in well-fed lamb/kid, recent diet change. Postmortem: 'Pulpy Kidney'. Lab: Toxin ELISA.",
    treatment: "Treatment often unsuccessful if advanced. Antitoxin. High-Dose Penicillin (20,000–40,000 IU/kg IM).",
    prevention: "Enterotoxemia Vaccine (Clostridial Toxoid) at 3 months. Gradual diet change.",
    govPrograms: "State vaccination drives prior to seasonal transitions.",
    economic: "Sudden loss of best-growing animals.",
    publicHealth: "Not zoonotic.",
    locations: "Widespread across intensive rearing systems.",
    season: "Post-monsoon green grazing, Winter fattening period.",
    caseStudy: "Maharashtra, 2024. 150 goat farm. 12 sudden kid deaths after high-grain diet shift. Vaccination + feed adjustment implemented."
  },
  {
    id: "johnes",
    name: "Johne’s Disease (Paratuberculosis)",
    species: ["Cattle", "Buffalo", "Goat", "Sheep"],
    basicId: "Chronic bacterial - Mycobacterium avium subsp. paratuberculosis (MAP)",
    etiology: "Acid-fast bacillus, slow-growing, very resistant. Survives in soil & manure for months to 1 year.",
    transmission: "Ingestion of contaminated feces. Incubation Period: 1–5 years (very slow disease).",
    pathogenesis: "Bacteria invade macrophages causing chronic granulomatous inflammation. Results in thickened intestinal wall, poor nutrient absorption.",
    clinical: "Cattle: Chronic watery diarrhea, progressive weight loss. Goats & Sheep: Severe weight loss, usually NO diarrhea. Advanced: Skeletal appearance, death.",
    diagnosis: "Field: Chronic diarrhea, weight loss despite appetite. Gold Standard: Fecal PCR. Serology: ELISA.",
    treatment: "No effective treatment in livestock. Antibiotic therapy not recommended.",
    prevention: "Separate calves from adult feces, regular ELISA screening, culling positive animals.",
    govPrograms: "Screening and culling protocols.",
    economic: "Chronic milk loss, early culling.",
    publicHealth: "Possible link to Crohn’s disease. Raw milk consumption discouraged.",
    locations: "Widespread, especially in mixed-age housing.",
    season: "Non-seasonal, chronic progression.",
    caseStudy: "Punjab Dairy, 2024. 120-cow herd. 18 cows chronic diarrhea. ELISA positive. Segregation implemented."
  },
  {
    id: "sheeppox",
    name: "Sheep Pox",
    species: ["Sheep"],
    basicId: "Viral (Poxviridae) - Sheep Pox Virus (SPPV)",
    etiology: "Large double-stranded DNA virus. Highly stable in scab material. Survives in dried scabs for months.",
    transmission: "Primary Route: Aerosol droplets, Direct contact. Incubation Period: 4–10 days. Not zoonotic.",
    pathogenesis: "Virus replicates in lymph nodes, targets skin forming macules → papules → nodules, scab formation.",
    clinical: "High fever (> 41°C). Red spots, raised firm nodules, thick scabs on wool-less parts (Face, ears, groin, underbelly).",
    diagnosis: "Field: Fever + nodular skin lesions. Laboratory: PCR (Gold standard).",
    treatment: "No antiviral cure. Broad-Spectrum Antibiotics: Oxytetracycline (10 mg/kg IM). Meloxicam. Povidone iodine.",
    prevention: "Sheep Pox Live Attenuated Vaccine. First dose: 3 months age, Annual booster.",
    govPrograms: "Regional vaccination campaigns.",
    economic: "Lamb mortality (20-50%), wool damage, weight loss.",
    publicHealth: "Not zoonotic.",
    locations: "Endemic in major sheep rearing states (e.g., Rajasthan).",
    season: "Winter, Post-monsoon.",
    caseStudy: "Rajasthan, 2024. 200 sheep flock. 60 infected. 18 lamb deaths. Vaccination initiated. Outbreak controlled in 4 weeks."
  },
  {
    id: "sheepscab",
    name: "Sheep Scab (Psoroptic Mange)",
    species: ["Sheep"],
    basicId: "Parasitic - Psoroptes ovis",
    etiology: "Microscopic mite. Non-burrowing surface feeder. Survives off-host for 10–17 days.",
    transmission: "Primary Route: Direct sheep-to-sheep contact. Incubation Period: 2–6 weeks.",
    pathogenesis: "Mites feed on lymph fluid, cause intense inflammation, thick crust formation, and severe itching.",
    clinical: "Intense agonizing itching, wool pulling, massive bald patches, thick yellow bleeding crusts, matted fleece.",
    diagnosis: "Field: Intense itching, wool loss patches. Laboratory: Skin scraping.",
    treatment: "Ivermectin (0.2 mg/kg SC). Amitraz Dip (0.025%). Treat entire flock simultaneously.",
    prevention: "Quarantine new sheep (21 days), treat before housing.",
    govPrograms: "Flock management and biosecurity advisories.",
    economic: "Total wool loss, severe weight loss, reduced market value.",
    publicHealth: "Not a significant risk.",
    locations: "Widespread (e.g., Rajasthan).",
    season: "Winter, Post-shearing.",
    caseStudy: "Rajasthan, 2024. 150 sheep flock. 60 affected. Severe wool loss. Treated with Ivermectin."
  },
  {
    id: "flystrike",
    name: "Fleece Rot & Flystrike (Myiasis)",
    species: ["Sheep"],
    basicId: "Bacterial & Parasitic Maggot Infestation",
    etiology: "Wet fleece bacteria (Pseudomonas aeruginosa) attracts blowflies (Chrysomya bezziana).",
    transmission: "Flies lay eggs directly on wet, soiled sheep wounds or feces-stained wool.",
    pathogenesis: "Maggots hatch, burrow into skin, release enzymes, destroy tissue rapidly leading to severe toxemia.",
    clinical: "Foul smell, brown/green discharge, visible maggots, open bleeding wounds, severe weakness, shock.",
    diagnosis: "Field: Foul odor, maggots visible, painful reaction.",
    treatment: "Immediate treatment critical. Clip wool around lesion. Ivermectin SC. Povidone iodine wash, Negasunt powder. Oxytetracycline.",
    prevention: "Shearing before monsoon, maintain clean hindquarters, insecticide sprays.",
    govPrograms: "Pre-monsoon shearing campaigns.",
    economic: "High mortality (30-70% in 3-5 days if untreated), wool loss.",
    publicHealth: "Rare zoonotic occurrence.",
    locations: "Regions with heavy monsoon rains.",
    season: "Monsoon, Post-monsoon (July–September).",
    caseStudy: "Maharashtra, 2024. 180 sheep flock. 25 cases during heavy rain. Immediate clipping + ivermectin. No deaths."
  },
  {
    id: "bluetongue",
    name: "Bluetongue",
    species: ["Sheep", "Goat"],
    basicId: "Viral (Vector-borne) - Bluetongue Virus (BTV)",
    etiology: "Double-stranded RNA virus. Vector: Culicoides biting midges.",
    transmission: "Bite of infected Culicoides midge. Incubation Period: 5–10 days. Not zoonotic.",
    pathogenesis: "Virus damages blood vessel lining leading to vascular leakage, edema, and hemorrhage in Tongue, Lips, Lungs, Hooves.",
    clinical: "Facial swelling, swollen lips, cyanotic (bluish) tongue. Mouth ulcers, lameness (coronitis).",
    diagnosis: "Field: Fever + facial swelling + lameness + monsoon season. Laboratory: PCR.",
    treatment: "No specific antiviral cure. Oxytetracycline (10 mg/kg IM). Meloxicam. Fluid Therapy.",
    prevention: "Inactivated Bluetongue vaccines (First dose: 3 months age). Vector Control (Deltamethrin spray).",
    govPrograms: "Vector control initiatives and regional vaccination.",
    economic: "Lamb mortality (10-30%), weight loss, fertility reduction.",
    publicHealth: "Not zoonotic.",
    locations: "Irrigated agricultural zones, river basins (e.g., Telangana).",
    season: "July–September (Monsoon).",
    caseStudy: "Telangana, 2024. 250 sheep flock. 70 infected. 15 deaths. Severe facial swelling. Vaccination + vector control implemented."
  },

  // ================= CAMEL DISEASES =================
  {
    id: "camel_mange",
    name: "Sarcoptic Mange (Khujli)",
    species: ["Camel", "Cattle", "Buffalo", "Goat", "Sheep"],
    basicId: "Parasitic - Sarcoptes scabiei",
    etiology: "Burrowing microscopic parasite. Survives off-host for 2–3 weeks. Spread increases during winter.",
    transmission: "Direct skin-to-skin contact. Incubation: 1–3 weeks. Zoonotic: Yes (temporary itching).",
    pathogenesis: "Female mite burrows into skin, lays eggs. Intense allergic reaction causes severe itching, skin thickening.",
    clinical: "Agonizing itching, hair loss patches, thick gray crust, wrinkled bleeding skin. Severe emaciation.",
    diagnosis: "Field: Intense itching, thick crusts. Laboratory: Deep skin scraping.",
    treatment: "Ivermectin (Drug of Choice: 0.2 mg/kg SC, repeat after 10–14 days). Amitraz spray (0.025%). Treat entire herd.",
    prevention: "Isolate affected animals, disinfect sheds, routine parasite control.",
    govPrograms: "Routine parasite control advisories.",
    economic: "Severe cases in camels may cause death due to emaciation. Hide damage, weight loss.",
    publicHealth: "Zoonotic (temporary skin itching). Wear gloves.",
    locations: "Camel rearing zones (e.g., Rajasthan).",
    season: "Peak Season: Winter.",
    caseStudy: "Rajasthan Camel Farm, 2024. 40 camels. 18 developed severe crusting. Ivermectin administered. Recovery in 3 weeks."
  },
  {
    id: "camelpox",
    name: "Camel Pox",
    species: ["Camel"],
    basicId: "Viral (Orthopoxvirus) - Camel Pox Virus (CMLV)",
    etiology: "Large double-stranded DNA virus. Survives in dried scabs for months.",
    transmission: "Direct contact. Incubation Period: 4–15 days. Rare zoonotic cases reported.",
    pathogenesis: "Virus targets skin epithelial cells resulting in macules → papules → vesicles → scabs.",
    clinical: "Fever (> 40°C). Raised nodules, thick scabs predominantly on hairless parts: lips, muzzle, eyelids, nostrils, underbelly.",
    diagnosis: "Field: Nodular lesions on hairless areas, Fever. Laboratory: PCR.",
    treatment: "No specific antiviral cure. Oxytetracycline (10 mg/kg IM). Meloxicam. Povidone iodine.",
    prevention: "Camel Pox vaccine available (6 months age, annual booster).",
    govPrograms: "Vaccination in camel-rearing regions.",
    economic: "Calf mortality (20-40%), milk drop, weight loss.",
    publicHealth: "Rare zoonotic cases (mild localized skin lesions). Use gloves.",
    locations: "Endemic to camel-rearing regions (e.g., Rajasthan).",
    season: "Winter, Post-monsoon.",
    caseStudy: "Rajasthan, 2024. 60 camel herd. 18 developed lip nodules. Supportive treatment given. Controlled in 3 weeks."
  },
  {
    id: "crdc",
    name: "Camelidae Respiratory Disease Complex (CRDC)",
    species: ["Camel"],
    basicId: "Multifactorial Respiratory Syndrome",
    etiology: "Viral (Camel Parainfluenza) + Bacterial (Pasteurella multocida). Triggers: Dust storms, transport stress, sudden cold.",
    transmission: "Primary Route: Aerosol droplets. Incubation Period: 3–7 days. Not zoonotic.",
    pathogenesis: "Stress weakens immunity, virus damages respiratory epithelium, bacteria colonize. Results in bronchopneumonia.",
    clinical: "Thick mucous discharge, coughing, rapid breathing, head lowered. Advanced: Labored breathing, open-mouth breathing.",
    diagnosis: "Field: Respiratory distress + stress history.",
    treatment: "Broad-Spectrum Antibiotics: Oxytetracycline (10–20 mg/kg IM) or Enrofloxacin. NSAIDs: Meloxicam. IV fluids.",
    prevention: "Avoid long-distance transport stress, provide proper ventilation, 21-day quarantine.",
    govPrograms: "Transport safety regulations for livestock.",
    economic: "Weight loss, milk drop, transport-related mortality (untreated: 20-40%).",
    publicHealth: "Not zoonotic.",
    locations: "Desert and transport corridors.",
    season: "Winter, Post-monsoon, Dust storm periods.",
    caseStudy: "Rajasthan, 2024. 50 camels transported 300 km. 12 developed pneumonia. 2 calf deaths. Outbreak controlled in 2 weeks."
  },
  {
    id: "surra",
    name: "Trypanosomiasis (Surra)",
    species: ["Camel", "Horse"],
    basicId: "Blood Parasite - Trypanosoma evansi",
    etiology: "Trypanosoma evansi. Microscopic blood parasite. Transmitted by biting horseflies.",
    transmission: "Bite of infected horseflies. Not contagious directly. Peak transmission in monsoon.",
    pathogenesis: "Parasite multiplies in blood, destroys red blood cells causing severe anemia and systemic exhaustion.",
    clinical: "Intermittent fever, extreme progressive emaciation (hump disappears), pale mucous membranes, edema under belly.",
    diagnosis: "Field: Extreme wasting, fever, fly bites. Lab: Blood smear microscopy.",
    treatment: "Quinapyramine sulfate/chloride (SC) or Suramin. Supportive fluid therapy and iron.",
    prevention: "Fly control, prophylactic injection of trypanocidal drugs before monsoon.",
    govPrograms: "Vector control and prophylactic campaigns in desert areas.",
    economic: "Most critical disease in camels. Complete loss of working capacity, high mortality if untreated.",
    publicHealth: "Not zoonotic.",
    locations: "Rajasthan, Gujarat, and equine zones.",
    season: "Monsoon and immediate post-monsoon.",
    caseStudy: "Rajasthan, 2024. Camel lost hump completely over 2 months. Blood smear positive for T. evansi. Treated with Quinapyramine."
  },

  // ================= EQUINE (HORSE) DISEASES =================
  {
    id: "sarcoids",
    name: "Sarcoids (Equine Sarcoids)",
    species: ["Horse"],
    basicId: "Neoplastic (Skin tumor) - Associated with Bovine Papillomavirus",
    etiology: "BPV-1 & BPV-2. Risk Factors: Flies (mechanical transmission), Skin injuries.",
    transmission: "Virus enters via skin trauma. Possible fly transmission. Incubation: Weeks to months. Not zoonotic.",
    pathogenesis: "BPV infects skin fibroblasts, causes abnormal cell proliferation. Sarcoids do NOT metastasize but grow aggressively at local site.",
    clinical: "Flat scaly patches, warty growths, or large fleshy bleeding nodules. Found on Face, Groin, Under tail, Chest, Wound sites.",
    diagnosis: "Field: Persistent skin growth. Laboratory: Biopsy (Gold standard).",
    treatment: "Surgical Excision, Cryotherapy (liquid nitrogen), Imiquimod Cream. Surgical removal alone often leads to recurrence.",
    prevention: "Early detection, protect wounds from flies. No vaccine available.",
    govPrograms: "Equine health management advisories.",
    economic: "Reduced working capacity, cosmetic devaluation. Treatment cost ₹2000–₹15000.",
    publicHealth: "Not zoonotic.",
    locations: "Fly-infested environments across India.",
    season: "Year-round, peaks with fly population.",
    caseStudy: "Maharashtra, 2024. Cart horse with facial sarcoid (fleshy bleeding mass). Surgical removal + cryotherapy. No recurrence after 1 year."
  },
  {
    id: "sweetitch",
    name: "Sweet Itch (Summer Eczema)",
    species: ["Horse"],
    basicId: "Allergic (Hypersensitivity reaction)",
    etiology: "Allergy to biting midges (Culicoides spp.) saliva. Environmental Risk: Warm humid weather, Stagnant water.",
    transmission: "Not contagious between horses. Midge bites horse → Immune system overreacts.",
    pathogenesis: "Severe itching develops, chronic inflammation leads to skin thickening, hair loss, and secondary bacterial infections.",
    clinical: "Agonizing itching, tail swishing. Hair loss on mane and tail, thickened wrinkled skin, open weeping bleeding wounds.",
    diagnosis: "Field: Seasonal itching, mane & tail hair loss, no parasites detected.",
    treatment: "Management-based. Corticosteroids (Dexamethasone), Antihistamines, Calamine lotion. Deltamethrin spray.",
    prevention: "Stable horses during dusk, fly sheets, remove stagnant water.",
    govPrograms: "Stagnant water clearance initiatives.",
    economic: "Reduced performance, cosmetic damage.",
    publicHealth: "Not zoonotic.",
    locations: "Areas with high midge populations.",
    season: "Summer, Monsoon.",
    caseStudy: "Karnataka, 2024. 12-horse stable. 5 developed severe mane loss. Fly sheets + corticosteroids used. Condition controlled in 2 weeks."
  },
  {
    id: "strangles",
    name: "Strangles",
    species: ["Horse"],
    basicId: "Bacterial (Upper respiratory infection)",
    etiology: "Streptococcus equi subsp. equi. Gram-positive cocci. Highly contagious. Survives weeks in water buckets.",
    transmission: "Direct horse-to-horse contact, shared water troughs, grooming tools. Incubation: 3–14 days. Not zoonotic.",
    pathogenesis: "Bacteria enter nasal passages, invade lymph nodes (Submandibular, Retropharyngeal), form abscesses.",
    clinical: "High fever (> 39.5°C), thick yellow nasal discharge, massive swelling under jaw. Abscess rupture with pus drainage.",
    diagnosis: "Field: Fever + swollen lymph nodes + thick nasal discharge. Laboratory: PCR (Gold standard).",
    treatment: "Procaine Penicillin (22,000 IU/kg IM; 5–7 days). Warm compress on abscess, drain once mature, flush with antiseptic.",
    prevention: "Isolate infected horses, separate water buckets. Intranasal Strangles vaccine available.",
    govPrograms: "Strict quarantine enforcement in racing stables.",
    economic: "Training interruption, quarantine expense. Major issue in Racing stables.",
    publicHealth: "Not zoonotic.",
    locations: "Equestrian centers, Racing circuits (e.g., Pune).",
    season: "Winter, Early summer.",
    caseStudy: "Pune Racing Stable, 2024. 20 horses. 6 developed fever + jaw swelling. Stable quarantined 4 weeks."
  },
  {
    id: "equine_flu",
    name: "Equine Herpesvirus (EHV) & Equine Influenza",
    species: ["Horse"],
    basicId: "Highly Contagious Viral Respiratory/Neurological Diseases",
    etiology: "EHV-1/4 (DNA virus, causes lifelong latency). Equine Influenza A (H3N8 RNA virus, mutates frequently).",
    transmission: "Aerosol droplets, Direct contact. Not zoonotic.",
    pathogenesis: "EHV: Targets respiratory epithelium, Uterus (abortions), CNS (neurological form). Influenza: Destroys respiratory cilia.",
    clinical: "High fever (>40°C), dry harsh cough, thick nasal discharge. EHV-1 specific: Late abortion, hind-limb weakness, paralysis.",
    diagnosis: "Laboratory: PCR (Gold standard), Rapid antigen tests.",
    treatment: "Supportive care (NSAIDs, IV fluids). Broad-spectrum antibiotics if secondary infection. Rest (minimum 3 weeks).",
    prevention: "EHV vaccine available. Equine Influenza vaccination mandatory in racing circuits (Booster every 6 months).",
    govPrograms: "Mandatory vaccination rules in racing circuits.",
    economic: "Major racing disruptions, training loss, abortion losses.",
    publicHealth: "Not zoonotic.",
    locations: "Equestrian hubs, Racing circuits nationwide.",
    season: "During events where many horses mix.",
    caseStudy: "Standard racing protocol requires strict 6-month boosters to prevent devastating stable outbreaks."
  },
  {
    id: "colic",
    name: "Colic",
    species: ["Horse"],
    basicId: "Gastrointestinal emergency (Syndrome of abdominal pain)",
    etiology: "Spasmodic, Impaction, Gas, Displacement/Torsion, Sand Colic. Risk Factors: Poor-quality dry fodder, sudden diet change, dehydration.",
    transmission: "Not contagious. Purely digestive disorder.",
    pathogenesis: "Feed imbalance or obstruction occurs, leading to gas accumulation, intestinal stretching, and severe pain. Torsion cuts off blood supply.",
    clinical: "Pawing ground, looking at flank, violent rolling, sweating, lying flat, cold extremities, shock.",
    diagnosis: "Field Examination: Heart rate, gut sounds, rectal examination.",
    treatment: "Emergency condition. Pain Management: Flunixin meglumine IV. Antispasmodics: Buscopan. IV fluids. Surgery for torsion.",
    prevention: "Avoid sudden diet change, strategic parasite control, ensure water access.",
    govPrograms: "Veterinary emergency care infrastructure.",
    economic: "Leading cause of premature death. Emergency treatment cost ₹5000–₹50000. Surgery cost ₹50,000+.",
    publicHealth: "Not zoonotic.",
    locations: "Widespread, universally affecting equines.",
    season: "Summer dehydration, Post-transport.",
    caseStudy: "Pune Racing Stable, 2024. Racehorse rolling & sweating. Diagnosed impaction colic. IV fluids + pain control. Recovered within 24 hrs."
  }
];

function GuideContent() {
  const searchParams = useSearchParams();
  const queryDisease = searchParams.get('disease');
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("All");
  const [selectedDisease, setSelectedDisease] = useState(diseasesData[0]);
  const detailsRef = useRef<HTMLDivElement>(null);

  const speciesList = ["All", "Cattle", "Buffalo", "Goat", "Sheep", "Camel", "Horse"];

  // If a user clicks a link from the dashboard, auto-select it and scroll to it
  useEffect(() => {
    if (queryDisease) {
      const found = diseasesData.find(d => d.id === queryDisease);
      if (found) {
        setSelectedDisease(found);
        setSelectedSpecies("All");
        setTimeout(() => {
          detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [queryDisease]);

  const filteredDiseases = diseasesData.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecies = selectedSpecies === "All" || d.species.includes(selectedSpecies);
    return matchesSearch && matchesSpecies;
  });

  return (
    <div className="flex flex-col gap-10">
      {/* 1. HEADER, SEARCH & TABS (Hidden on Print) */}
      <div className="space-y-6 print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold text-vet-blue-900 flex items-center gap-3 tracking-tight">
            <BookOpen className="h-8 w-8 text-vet-blue-600" /> Clinical Reference Guide
          </h1>
          <p className="text-slate-500 mt-2 text-base">Look up any disease to find symptoms, causes, and the right treatment.</p>
        </div>

        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search for diseases (e.g. Lumpy Skin, Mastitis)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-vet-blue-500 focus:ring-4 focus:ring-vet-blue-500/10 transition-all text-slate-700 shadow-sm"
          />
        </div>

        <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
          {speciesList.map((species) => (
            <button
              key={species}
              onClick={() => {
                setSelectedSpecies(species);
                const newFiltered = diseasesData.filter(d => 
                  (species === "All" || d.species.includes(species)) && d.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                if(newFiltered.length > 0) setSelectedDisease(newFiltered[0]);
              }}
              className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all border ${
                selectedSpecies === species 
                ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {species}
            </button>
          ))}
        </div>
      </div>

      {/* 2. DISEASES HORIZONTAL SCROLL BOX (Hidden on Print) */}
      <div className="print:hidden">
        <h3 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wider">Select a Disease ({filteredDiseases.length})</h3>
        
        {filteredDiseases.length === 0 ? (
           <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center text-slate-400 flex flex-col items-center">
             <Stethoscope className="h-16 w-16 mb-4 opacity-20" />
             <p className="font-medium text-lg text-slate-500">No diseases found matching your search.</p>
           </div>
        ) : (
          <div className="max-h-[280px] overflow-y-auto pr-2 custom-scrollbar bg-white border border-slate-200 rounded-2xl p-4 shadow-inner">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredDiseases.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                     setSelectedDisease(d);
                     setTimeout(() => detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                  }}
                  className={`text-left p-4 rounded-xl transition-all border shadow-sm flex flex-col justify-center ${
                    selectedDisease?.id === d.id 
                    ? 'bg-vet-blue-50 border-vet-blue-400 ring-1 ring-vet-blue-400 scale-[1.02]' 
                    : 'bg-white border-slate-200 hover:border-vet-blue-300 hover:shadow-md'
                  }`}
                >
                  <h4 className={`font-bold text-base leading-tight ${selectedDisease?.id === d.id ? 'text-vet-blue-900' : 'text-slate-800'}`}>
                    {d.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 font-medium uppercase tracking-wide">
                    {d.species.join(", ")}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. SELECTED DISEASE DETAILS */}
      {selectedDisease && (
        <div 
          ref={detailsRef} 
          className="w-full bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-10 lg:p-12 scroll-mt-6 print:border-none print:shadow-none print:p-0 print:m-0"
          style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
        >
            <div className="hidden print:flex justify-between items-start border-b-4 border-slate-800 pb-6 mb-8">
               <div className="flex items-center gap-5">
                 <img src="/logo.png" alt="JeevRaksha Logo" className="h-20 w-20 object-contain" />
                 <div>
                   <h2 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight">Official Clinical Protocol</h2>
                   <p className="text-vet-blue-800 font-bold text-lg tracking-widest mt-1">JEEVRAKSHA AI VETERINARY SYSTEM</p>
                 </div>
               </div>
               <div className="text-right">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Generated On</p>
                  <p className="text-lg font-bold text-slate-900 flex items-center justify-end gap-2"><CalendarClock className="h-5 w-5"/> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
               </div>
            </div>

            <div className="border-b border-slate-200 pb-8 mb-8 flex justify-between items-start print:border-b-0 print:pb-0">
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedDisease.species.map(s => (
                    <span key={s} className="bg-slate-100 text-slate-700 border border-slate-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">{s}</span>
                  ))}
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">{selectedDisease.name}</h2>
                <p className="text-vet-blue-600 font-bold mt-3 text-base lg:text-lg">{selectedDisease.basicId}</p>
              </div>
              
              <button 
                onClick={() => window.print()} 
                className="print:hidden flex items-center gap-2 bg-slate-800 text-white px-5 py-3 rounded-xl font-bold hover:bg-slate-900 transition-colors shadow-md"
              >
                <Printer className="h-5 w-5" /> Print Protocol
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 print:border-slate-300">
                <div className="flex flex-col gap-1.5">
                   <span className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest"><MapPin className="h-4 w-4"/> Major Locations</span>
                   <span className="text-base font-medium text-slate-800 leading-relaxed">{selectedDisease.locations || 'Widespread'}</span>
                </div>
                <div className="flex flex-col gap-1.5 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 print:border-slate-300">
                   <span className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest"><Calendar className="h-4 w-4"/> Peak Season</span>
                   <span className="text-base font-medium text-slate-800 leading-relaxed">{selectedDisease.season || 'Year-round'}</span>
                </div>
                <div className="flex flex-col gap-1.5 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 print:border-slate-300">
                   <span className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest"><Landmark className="h-4 w-4"/> Gov. Programs</span>
                   <span className="text-base font-medium text-slate-800 leading-relaxed">{selectedDisease.govPrograms || 'Standard Biosecurity'}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 print:flex print:flex-col print:gap-8">
              
              <div className="space-y-8">
                  <div className="print:break-inside-avoid">
                    <h3 className="flex items-center gap-2 text-xl font-extrabold text-slate-800 mb-3"><Bug className="h-6 w-6 text-vet-blue-600"/> Causative Agent (Etiology)</h3>
                    <p className="text-slate-600 text-base leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100 print:border-slate-300 print:text-black">{selectedDisease.etiology}</p>
                  </div>

                  <div className="print:break-inside-avoid">
                    <h3 className="flex items-center gap-2 text-xl font-extrabold text-slate-800 mb-3"><Activity className="h-6 w-6 text-vet-blue-600"/> Transmission & Pathogenesis</h3>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4 print:border-slate-300">
                      <p className="text-slate-600 text-base leading-relaxed print:text-black"><strong className="text-slate-800 print:text-black">Spread:</strong> {selectedDisease.transmission}</p>
                      <div className="border-t border-slate-200 print:border-slate-300"></div>
                      <p className="text-slate-600 text-base leading-relaxed print:text-black"><strong className="text-slate-800 print:text-black">Internal Mechanism:</strong> {selectedDisease.pathogenesis}</p>
                    </div>
                  </div>
              </div>

              <div className="space-y-8">
                  <div className="print:break-inside-avoid">
                    <h3 className="flex items-center gap-2 text-xl font-extrabold text-slate-800 mb-3"><AlertTriangle className="h-6 w-6 text-red-600"/> Clinical Signs & Diagnosis</h3>
                    <div className="bg-red-50 p-5 rounded-2xl border border-red-100 space-y-4 print:border-red-300">
                      <p className="text-slate-700 text-base leading-relaxed print:text-black"><strong className="text-slate-900 print:text-black">Symptoms:</strong> {selectedDisease.clinical}</p>
                      <div className="border-t border-red-200/50 print:border-red-300"></div>
                      <p className="text-slate-700 text-base leading-relaxed print:text-black"><strong className="text-slate-900 print:text-black">Diagnosis:</strong> {selectedDisease.diagnosis}</p>
                    </div>
                  </div>

                  <div className="print:break-inside-avoid">
                    <h3 className="flex items-center gap-2 text-xl font-extrabold text-slate-800 mb-3"><Syringe className="h-6 w-6 text-vet-green-600"/> Treatment & Prevention</h3>
                    <div className="bg-vet-green-50 p-5 rounded-2xl border border-vet-green-100 space-y-4 print:border-vet-green-300">
                      <p className="text-slate-700 text-base leading-relaxed print:text-black"><strong className="text-slate-900 print:text-black">Medication:</strong> {selectedDisease.treatment}</p>
                      <div className="border-t border-vet-green-200/50 print:border-vet-green-300"></div>
                      <p className="text-slate-700 text-base leading-relaxed print:text-black"><strong className="text-slate-900 print:text-black">Protocols:</strong> {selectedDisease.prevention}</p>
                    </div>
                  </div>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 print:flex print:flex-col print:gap-6 print:mt-8">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 print:border-slate-300 print:break-inside-avoid">
                    <h4 className="font-bold text-slate-800 text-base mb-2 flex items-center gap-2"><Coins className="h-5 w-5 text-slate-400"/> Economic Impact</h4>
                    <p className="text-slate-600 text-sm leading-relaxed print:text-black">{selectedDisease.economic}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 print:border-slate-300 print:break-inside-avoid">
                    <h4 className="font-bold text-slate-800 text-base mb-2 flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-slate-400"/> Public Health</h4>
                    <p className="text-slate-600 text-sm leading-relaxed print:text-black">{selectedDisease.publicHealth}</p>
                </div>
            </div>

            <div className="bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-700 text-white mt-6 print:break-inside-avoid print:bg-slate-100 print:border-slate-300 print:text-slate-900">
                <h4 className="font-extrabold text-lg mb-3 flex items-center gap-3"><FileText className="h-6 w-6 text-slate-400 print:text-slate-600"/> Real Indian Farm Case Study</h4>
                <p className="text-slate-300 text-base italic leading-relaxed print:text-slate-700">"{selectedDisease.caseStudy}"</p>
            </div>

            <div className="hidden print:flex justify-between items-end mt-20 pt-8 border-t-2 border-slate-800 print:break-inside-avoid">
                <div className="text-center">
                  <div className="w-64 border-b border-slate-800 mb-2"></div>
                  <p className="font-bold text-sm text-slate-800 uppercase tracking-widest">Authorized Signature</p>
                </div>
                <div className="text-center">
                  <div className="w-64 border-b border-slate-800 mb-2"></div>
                  <p className="font-bold text-sm text-slate-800 uppercase tracking-widest">Official Seal / Stamp</p>
                </div>
            </div>
            
        </div>
      )}
    </div>
  );
}

// Wrapper to prevent Next.js build errors when using useSearchParams
export default function GuidePage() {
  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-24 print:m-0 print:p-0">
      <Suspense fallback={<div className="p-12 text-center text-slate-500 font-bold">Loading Guide Database...</div>}>
        <GuideContent />
      </Suspense>
    </div>
  );
}