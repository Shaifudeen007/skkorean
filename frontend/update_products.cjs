const fs = require('fs');

const content = fs.readFileSync('src/data/products.ts', 'utf8');
const match = content.match(/export const PRODUCTS = (\[[\s\S]*\]);/);
const products = eval('(' + match[1] + ')');

const koreanProducts = [
  {
    id: 83,
    name: "SEOUL GLUTAWHIP FOAMY FACE WASH",
    category: "Korean Products",
    description: "Radiant Glutathione Foamy Facewash (Low pH Balanced). Inspired by the gentle cleansing philosophy of K-beauty.",
    price: "₹1270",
    image: "/korean/seoul_glutawhip.png",
    longDescription: {
      keyBenefits: ["Vitamin E: Nourishes & protects the skin barrier", "Vitamin C: Brightens & enhances natural radiance", "Glutathione: Helps improve clarity & even skin tone"],
      wavelengths: [],
      handpiece: "",
      specifications: [
        { label: "Skin Suitability", value: "For All Skin Types" },
        { label: "Size", value: "150ml (5.07 fl. oz.)" },
        { label: "Formula Note", value: "Inspired by Korean Formula" },
        { label: "Composition", value: "Aqua, Ammonium Lauryl Sulphate, Triethanolamine, Sodium Lauryl Sulfate, Glycerin, Aloe Vera Extract, Ascorbic Acid 2 Glucoside, Decyl Glucoside, Cocamidopropyl Betaine, Polyquaternium-7, Olive Oil PEG 7 Esters, PEG 12 Dimethicone, PEG 40 Hydrogenated castor oil, D MDM Hydantoin, Methylisothiazolinone and Methylchloroisothi-azolinone, L-Glutathione, Organic Orange Oil, Tocopheryl Acetate & Fragrance." }
      ]
    }
  },
  {
    id: 84,
    name: "SEOUL UV SHIELD SPF 50 PA+++ SUNSCREEN",
    category: "Korean Products",
    description: "Ultra Light Sunscreen Gel (UVA/UVB Protection with Cooling Gel). Delivers powerful broad-spectrum protection with a lightweight, aqua-fresh texture.",
    price: "₹1660",
    image: "/korean/seoul_uv_shield.png",
    longDescription: {
      keyBenefits: ["Broad-spectrum UVA/UVB protection", "Hydrates & locks in moisture", "Cooling sensation for a refreshing feel", "Lightweight, non-greasy formula", "Invisible finish, no white cast", "Brightens & helps improve skin tone"],
      wavelengths: [],
      handpiece: "",
      specifications: [
        { label: "Skin Suitability", value: "For All Skin Types" },
        { label: "Size", value: "50g (1.69 fl. oz.)" },
        { label: "Key Actives", value: "Kakadu Plum Extract, Vitamin C, SPF 50 PA+++" },
        { label: "Composition", value: "Carbopol, Homosalate, Silk Protein Extract, Aristoflex AVC, Disodium EDTA, Allantoin, Hyaluronic Acid, Kakadu Plum Extract, Vitamin E, Phenoxyethanol (and) Ethylhexylglycerin, Triethanol Amine, Octyl Methoxy Cinnamate, Zinc PCA, Tinosorb M, Purified water." }
      ]
    }
  },
  {
    id: 85,
    name: "SEOUL VIT C 20% FUSION SERUM",
    category: "Korean Products",
    description: "Fusion Serum (Skin Radiance + Hydration Boost / Non-Greasy & Quick Absorbing). Powerful K-beauty inspired brightening serum specially formulated for Indian skin.",
    price: "₹1390",
    image: "/korean/seoul_vit_c.png",
    longDescription: {
      keyBenefits: ["Brightens dull skin & enhances glow", "Helps reduce dark spots & pigmentation", "Antioxidant protection against free radicals", "Hydrates & maintains skin moisture balance", "Lightweight, non-greasy & quick absorbing"],
      wavelengths: [],
      handpiece: "",
      specifications: [
        { label: "Skin Suitability", value: "For All Skin Types" },
        { label: "Size", value: "30ml (1.01 fl. oz.)" },
        { label: "Key Actives", value: "Vit C 20%, Niacinamide, Hyaluronic Acid" },
        { label: "Composition", value: "O-Ethyl-L-Ascorbic Acid, Hyaluronic Acid, Chamomile Extract, Liquorice Extract, Niacinamide, Sodium PCA, C10-30 Acrylates Crosspolymer, Phenoxyethanol, Ethylhexylglycerine, Disodium EDTA, Limonene, Linalool." }
      ]
    }
  },
  {
    id: 86,
    name: "SEOUL SPF ULTRA LIGHT HYDRATING UV MOISTURISER",
    category: "Korean Products",
    description: "Ultra Light Hydrating UV Moisturiser (With SPF30, Dermawhite™ & Vitamin C). Perfect balance of hydration and protection.",
    price: "₹1530",
    image: "/korean/seoul_spf_moisturiser.png",
    longDescription: {
      keyBenefits: ["Broad-spectrum UVA & UVB protection", "Provides long-lasting hydration & moisture retention", "Brightens skin & promotes even skin tone", "Ultra-light, non-greasy formula for daily comfort", "Strengthens skin barrier & protects against pollutants", "Leaves skin soft, fresh & radiant every day"],
      wavelengths: [],
      handpiece: "",
      specifications: [
        { label: "Skin Suitability", value: "For All Skin Types" },
        { label: "Size", value: "100g (1.69 fl. oz.)" },
        { label: "Key Actives", value: "Vitamin C, SPF30, Dermawhite™" },
        { label: "Composition", value: "Dm Water, Isoamyl Laurate, Decyl Oleate, Sargassum Fluitans/natans Extract (and) Xanthan Gum (and) Pentylene Glycol, Methylene Bis-benzotriazolyl Tetramethylbutylphenol, Cetearyl Alcohol (and) Polysorbate 60, Cetostearyl Alcohol, Caprylic/capric Triglyceride, Almond Oil, Phenoxyethanol (and) Ethylhexylglycerin, Aqua (and) Psidium Guajava Fruit Extract (and) Tartaric Acid (and) Disodium Edta (and) Sodium Sulfite (and) Sodium Metabisulfite (and) Glycerin (and) Butylene Glycol (and) Saxifraga Sarmentosa Extract (and) Carica Papaya (papaya) Fruit Extract, Fragrance, Ethyl Ascorbic Acid." }
      ]
    }
  },
  {
    id: 87,
    name: "SEOUL AM-PM HYDRATION CREAM",
    category: "Korean Products",
    description: "Hydration Cream (Day Night Moisturizer for Glowing Skin). Lightweight day and night moisturizer designed to nourish, hydrate, and revitalize the skin.",
    price: "₹2290",
    image: "/korean/seoul_am_pm_cream.png",
    longDescription: {
      keyBenefits: ["Provides long-lasting hydration", "Brightens & revives dull, tired skin", "Strengthens skin barrier & protects moisture", "Improves elasticity & skin firmness", "Lightweight, non-greasy formula", "Leaves skin soft, smooth & radiant"],
      wavelengths: [],
      handpiece: "",
      specifications: [
        { label: "Skin Suitability", value: "For All Skin Types (Suitable for sensitive skin)" },
        { label: "Size", value: "50g (1.76 fl. oz.)" },
        { label: "Key Actives", value: "Squalane, Glutathione, Collagen, Hyaluronic Acid, Niacinamide (B3)" },
        { label: "Composition", value: "Purified Water, Glycerin, Cetyl Ethylhexanoate, Cyclopentasiloxane, Dipropylene Glycol, Cyclohexasiloxane, Dimethicone, Glyceryl Stearate, Niacinamide, Macadamia Ternifolia Seed Oil, Stearyl Alcohol, Cetearyl Olivate, Cetearyl Alcohol Dimethicone/Vinyl Dimethicone Crosspolymer, Arginine, Butylene Glycol, Propanediol, Hydroxyacetophenone, 1,2-Hexanediol, Dipotassium Glycyrrhizate, Adenosine, Carbomer, Fragrance, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, Disodium EDTA, Hamamelis Virginiana (Witch Hazel) Leaf Extract, Melaleuca Alternifolia (Tea Tree) Leaf Extract, Hippophae Rhamnoides Fruit Extract, Glutathione (100ppm), Hydrolyzed Collagen, Squalane, Beta-Glucan, Ascorbic Acid, Sorbitan Olivate, PEG-100 Stearate, Panthenol, Stearic Acid, Glycosyl Trehalose, Hydrogenated Starch Hydrolysate." }
      ]
    }
  },
  {
    id: 88,
    name: "SEOUL BIOPEPTIDE+",
    category: "Korean Products",
    description: "Fusion Serum (Peptide + Hydration Serum / Non-Greasy & Quick Absorbing). Seoul BioPeptide + Fusion Serum is a lightweight, fast-absorbing serum formulated to hydrate, brighten, and support firmer-looking skin.",
    price: "₹1470",
    image: "/korean/seoul_biopeptide.png",
    longDescription: {
      keyBenefits: ["Intense hydration & moisture boost", "Brightens & evens skin tone", "Improves elasticity & firms skin", "Strengthens skin barrier", "Soothes & calms sensitive skin", "Leaves skin smooth, healthy & radiant"],
      wavelengths: [],
      handpiece: "",
      specifications: [
        { label: "Skin Suitability", value: "FOR ALL SKIN TYPES" },
        { label: "Size", value: "30ml (1.01 fl. oz.)" },
        { label: "Formula Note", value: "Inspired by Korean Formula" },
        { label: "Key Actives", value: "6 Peptide Complex, Hyaluronic Acid, Allantoin, Niacinamide (B3)" },
        { label: "Composition", value: "Demineralized Water, Dipropylene Glycol, Glycerin, Pentylene Glycol, 1,2-Hexanediol, Niacinamide, Ammonium Acryloyldimethyltaurate/VP Copolymer, Polyacrylate Crosspolymer-6, Butylene Glycol, Xanthan Gum, Ethylhexylglycerin, Adenosine, Polyquaternium-51, Disodium EDTA, Citric Acid, Caprylyl Glycol, Betaine, t-Butyl Alcohol, Sodium PCA, Sodium Lactate, Acetyl Hexapeptide-8, Copper Tripeptide-1, PCA, sh-Polypeptide-121, Serine, Alanine, Allantoin, Sodium Hyaluronic, Acetyl Glucosamine, Glycine, Glutamic Acid, Lysine HCl, Threonine, Dipeptide Diaminobutyroyl Benzylamide Diacetate, Arginine, Tocopherol, Oligopeptide-68, Proline, Dextran, Palmitoyl Tripeptide-8, Glycine Soja (Soybean) Oil, Hydrogenated Lecithin, Potassium Sorbate, Sodium Oleate." }
      ]
    }
  }
];

// Combine all existing, except machines
const nonMachineProducts = products.filter(p => p.category !== "Machine");

// Let's create the new machines based on user requirements.
// The user provided the new structure.
const newMachines = [
  {
    id: 1,
    name: "ADSS 4D Tech Laser USA FDA 1600W",
    category: "Machine",
    description: "Premium 4 Wavelength Diode and 4D Tech Lasers for powerful, precise, and comfortable treatments.",
    price: "",
    image: "/Products/Product1_enhanced.png",
    longDescription: {
      keyBenefits: ["15\\\" Color Touch LCD", "Water + Air + Semiconductor Cooling", "Effective & Permanent Hair Reduction", "Painless & Fast for All Skin Types", "24 Hours Continuous Operation"],
      wavelengths: [], handpiece: "", specifications: []
    }
  },
  {
    id: 2,
    name: "ADSS 4D Tech Laser USA FDA 2400W",
    category: "Machine",
    description: "Premium 4 Wavelength Diode and 4D Tech Lasers for powerful, precise, and comfortable treatments.",
    price: "",
    image: "/Products/image_10.png",
    longDescription: { keyBenefits: [], wavelengths: [], handpiece: "", specifications: [] }
  },
  {
    id: 3,
    name: "ADSS 4D Tech Laser",
    category: "Machine",
    description: "Premium 4 Wavelength Diode and 4D Tech Lasers for powerful, precise, and comfortable treatments.",
    price: "",
    image: "/Products/image_11.png",
    longDescription: { keyBenefits: [], wavelengths: [], handpiece: "", specifications: [] }
  },
  {
    id: 4,
    name: "Fractional CO2 Laser System",
    category: "Machine",
    description: "Advanced Skin Resurfacing with Metal Tube Technology. Featuring FDA-approved CO2 lasers with 7-Joint Articulated Arms for supreme precision and trusted clinical results.",
    price: "",
    image: "/Products/image_38.png",
    longDescription: {
      keyBenefits: ["Wavelength: 10600nm", "Power: 1–60W", "7-Joint Articulated Arm", "Scan Range: Max 20mm × 20mm", "Modes: Fractional, Pulse, Gynae"],
      wavelengths: [], handpiece: "", specifications: []
    }
  },
  {
    id: 5,
    name: "BV Laser CO2 Metal Tube Technology",
    category: "Machine",
    description: "Advanced Skin Resurfacing with Metal Tube Technology.",
    price: "",
    image: "/Products/image_38.png",
    longDescription: {
      keyBenefits: ["Metal Tube Technology", "7-Joint Articulated Arm", "Scan Modes: Order, Center, Random", "High Precision Technology"],
      wavelengths: [], handpiece: "", specifications: []
    }
  },
  {
    id: 6,
    name: "CO2 Laser Metal Tube Technology",
    category: "Machine",
    description: "Advanced Skin Resurfacing with Metal Tube Technology.",
    price: "",
    image: "/Products/image_38.png",
    longDescription: {
      keyBenefits: ["Pulse Interval: 1ms – 5000ms", "Pulse Width: 0.1ms – 10ms", "Ultra Precise Ablation", "Ideal for Acne Scar Treatments"],
      wavelengths: [], handpiece: "", specifications: []
    }
  },
  {
    id: 7,
    name: "BV Laser CO2 (Black & Rose Gold)",
    category: "Machine",
    description: "Advanced Skin Resurfacing with Metal Tube Technology.",
    price: "",
    image: "/Products/image_38.png",
    longDescription: {
      keyBenefits: ["Wavelength: 10600nm", "Power: 1–60W", "7-Joint Articulated Arm", "Surgical Cutting Probe", "1 Year Warranty"],
      wavelengths: [], handpiece: "", specifications: []
    }
  },
  {
    id: 8,
    name: "Q-Switched ND:YAG Laser",
    category: "Machine",
    description: "Advanced laser systems designed for pigmentation correction, tattoo removal, skin rejuvenation, and aesthetic treatments.",
    price: "",
    image: "/Products/image_37.png",
    longDescription: {
      keyBenefits: ["Pigmentation Treatment", "Tattoo Removal", "Skin Rejuvenation", "Professional Laser Performance"],
      wavelengths: [], handpiece: "", specifications: []
    }
  },
  {
    id: 9,
    name: "Crystal Pico Laser Gear",
    category: "Machine",
    description: "Advanced laser systems designed for pigmentation correction, tattoo removal, skin rejuvenation, and aesthetic treatments.",
    price: "",
    image: "/Products/Product1_enhanced.png",
    longDescription: {
      keyBenefits: ["Advanced Pico Technology", "Faster Treatment Sessions", "Precision Skin Correction", "Enhanced Patient Satisfaction"],
      wavelengths: [], handpiece: "", specifications: []
    }
  },
  {
    id: 10,
    name: "Active Pico BV Laser",
    category: "Machine",
    description: "Advanced laser systems designed for pigmentation correction, tattoo removal, skin rejuvenation, and aesthetic treatments.",
    price: "",
    image: "/Products/Product1_enhanced.png",
    longDescription: {
      keyBenefits: ["Double Laser Rods", "1064nm / 532nm in One Handle", "7-Joint Articulated Arm", "1000mJ Output Energy"],
      wavelengths: [], handpiece: "", specifications: []
    }
  },
  {
    id: 11,
    name: "Q-Switched ND:YAG Laser (Multi-Wavelength)",
    category: "Machine",
    description: "Advanced laser systems designed for pigmentation correction, tattoo removal, skin rejuvenation, and aesthetic treatments.",
    price: "",
    image: "/Products/image_37.png",
    longDescription: {
      keyBenefits: ["1064nm / 532nm / 585nm / 650nm", "Long Pulse Mode (100μs – 1000μs)", "SP, PTP & Genesis Modes", "Advanced Skin Solution"],
      wavelengths: [], handpiece: "", specifications: []
    }
  },
  {
    id: 12,
    name: "17 IN 1 Hydra Facial Machine",
    category: "Machine",
    description: "Premium hydra systems designed to deliver deep cleansing, hydration, oxygen infusion, skin rejuvenation, and advanced facial treatments.",
    price: "",
    image: "/Products/image_20.png",
    longDescription: {
      keyBenefits: ["Deep Cleansing", "Oxygen Infusion", "Skin Hydration", "Blackhead Removal", "Skin Tightening"],
      wavelengths: [], handpiece: "", specifications: []
    }
  },
  {
    id: 13,
    name: "17 IN 1 Hydra Plus Machine",
    category: "Machine",
    description: "Premium hydra systems designed to deliver deep cleansing, hydration, oxygen infusion, skin rejuvenation, and advanced facial treatments.",
    price: "",
    image: "/Products/image_18.png",
    longDescription: {
      keyBenefits: ["PDT Therapy", "Oxygen Spray", "RF Treatment", "Ultrasonic Technology", "Advanced Skin Rejuvenation"],
      wavelengths: [], handpiece: "", specifications: []
    }
  },
  {
    id: 14,
    name: "13 IN 1 Oxygen PDT Dynamic Hydra",
    category: "Machine",
    description: "Premium hydra systems designed to deliver deep cleansing, hydration, oxygen infusion, skin rejuvenation, and advanced facial treatments.",
    price: "",
    image: "/Products/image_21.png",
    longDescription: {
      keyBenefits: ["Multi-functional Treatment System", "Complete Facial Solution", "Advanced Anti-Aging Technologies", "Professional Clinic-Grade Performance"],
      wavelengths: [], handpiece: "", specifications: []
    }
  },
  {
    id: 15,
    name: "10 IN 1 Oxygen Hydra Alice Superbubble",
    category: "Machine",
    description: "Premium hydra systems designed to deliver deep cleansing, hydration, oxygen infusion, skin rejuvenation, and advanced facial treatments.",
    price: "",
    image: "/Products/image_19.png",
    longDescription: {
      keyBenefits: ["17 Powerful Functions", "Deep Skin Cleansing & Exfoliation", "Significant Hydration & Glow", "Complete Skin Rejuvenation Solution"],
      wavelengths: [], handpiece: "", specifications: []
    }
  },
  {
    id: 16,
    name: "8 IN 1 Alice Superbubble Max Hydra",
    category: "Machine",
    description: "Premium hydra systems designed to deliver deep cleansing, hydration, oxygen infusion, skin rejuvenation, and advanced facial treatments.",
    price: "",
    image: "/Products/image_22.png",
    longDescription: {
      keyBenefits: ["Facial Cleansing", "Hydration Therapy", "Skin Brightening", "Pore Cleaning"],
      wavelengths: [], handpiece: "", specifications: []
    }
  },
  {
    id: 17,
    name: "7 IN 1 Alice Super Bubble Oxygen Hydra Machine",
    category: "Machine",
    description: "Premium hydra systems designed to deliver deep cleansing, hydration, oxygen infusion, skin rejuvenation, and advanced facial treatments.",
    price: "",
    image: "/Products/image_23.png",
    longDescription: {
      keyBenefits: ["Multi-function Facial Treatments", "Enhanced Skin Rejuvenation", "Professional-Grade Technology"],
      wavelengths: [], handpiece: "", specifications: []
    }
  },
  {
    id: 18,
    name: "Premium Hydra Device",
    category: "Machine",
    description: "Model: 7 IN 1 Alice Super Bubble Oxygen Hydra Machine",
    price: "",
    image: "/Products/image_23.png",
    longDescription: {
      keyBenefits: ["Advanced Facial Care", "Skin Tightening", "Deep Nourishment", "Premium Clinic Performance"],
      wavelengths: [], handpiece: "", specifications: []
    }
  },
  {
    id: 19,
    name: "Advanced Cryo System",
    category: "Machine",
    description: "Model: 360 Cryo + EMS + 40K + RF. Complete Body Sculpting Solutions.",
    price: "",
    image: "/Products/image_42.png",
    longDescription: {
      keyBenefits: ["Advanced 4-in-1 Technology", "3000W High Power Output", "Fat Reduction & Body Contouring", "EMS Muscle Building & Toning"],
      wavelengths: [], handpiece: "", specifications: []
    }
  },
  {
    id: 20,
    name: "CRYO Sculpting Machine",
    category: "Machine",
    description: "Complete Body Sculpting Solutions.",
    price: "",
    image: "/Products/image_42.png",
    longDescription: {
      keyBenefits: ["Cryo + Cavitation + RF + Laser", "800W Efficient Output", "Fat Reduction & Contouring", "Skin Tightening & Rejuvenation"],
      wavelengths: [], handpiece: "", specifications: []
    }
  },
  {
    id: 21,
    name: "Professional Cryo Device",
    category: "Machine",
    description: "Complete Body Sculpting Solutions.",
    price: "",
    image: "/Products/image_42.png",
    longDescription: {
      keyBenefits: ["Advanced 10-in-1 Technology", "9 Handles + Lipo Plates", "80K Cavitation + Vacuum + RF", "Reduces Cellulite & Tones Muscles"],
      wavelengths: [], handpiece: "", specifications: []
    }
  },
  {
    id: 22,
    name: "Premium Cryolipolysis",
    category: "Machine",
    description: "Complete Body Sculpting Solutions.",
    price: "",
    image: "/Products/image_42.png",
    longDescription: {
      keyBenefits: ["Advanced Body Sculpting", "Precise Fat Freezing", "Non-Invasive Treatment", "Safe & Effective Body Contouring"],
      wavelengths: [], handpiece: "", specifications: []
    }
  },
  {
    id: 23,
    name: "Laser Hair Removal System",
    category: "Machine",
    description: "Advanced solutions for permanent hair reduction and stimulated hair regrowth.",
    price: "",
    image: "/Products/image_34.png",
    longDescription: {
      keyBenefits: ["Advanced Laser Technology", "Fast & Effective Results", "Safe for All Skin Types", "Premium Performance"],
      wavelengths: [], handpiece: "", specifications: []
    }
  },
  {
    id: 24,
    name: "Advanced Laser Hair Device",
    category: "Machine",
    description: "Advanced solutions for permanent hair reduction and stimulated hair regrowth.",
    price: "",
    image: "/Products/image_35.png",
    longDescription: {
      keyBenefits: ["Enhanced Precision Controls", "Comfortable Treatment", "High Power Output", "Reliable & Durable Design"],
      wavelengths: [], handpiece: "", specifications: []
    }
  },
  {
    id: 25,
    name: "A3 Plus AI Skin Tester",
    category: "Machine",
    description: "Premium AI-powered skin analysis equipment for professional clinics and dermatology centers.",
    price: "",
    image: "/Products/image_39.png",
    longDescription: { keyBenefits: [], wavelengths: [], handpiece: "", specifications: [] }
  },
  {
    id: 26,
    name: "A5 Plus AI Imager",
    category: "Machine",
    description: "Premium AI-powered skin analysis equipment for professional clinics and dermatology centers.",
    price: "",
    image: "/Products/image_39.png",
    longDescription: { keyBenefits: [], wavelengths: [], handpiece: "", specifications: [] }
  },
  {
    id: 27,
    name: "T8 AI Scalp Analyzer",
    category: "Machine",
    description: "Professional AI scalp diagnostic systems for advanced hair and scalp assessment.",
    price: "",
    image: "/Products/image_36.png",
    longDescription: { keyBenefits: [], wavelengths: [], handpiece: "", specifications: [] }
  },
  {
    id: 28,
    name: "AI Scalp Analyzer – Model 2",
    category: "Machine",
    description: "Professional AI scalp diagnostic systems for advanced hair and scalp assessment.",
    price: "",
    image: "/Products/image_36.png",
    longDescription: { keyBenefits: [], wavelengths: [], handpiece: "", specifications: [] }
  },
  {
    id: 29,
    name: "HIFU 7D",
    category: "Machine",
    description: "High-Intensity Focused Ultrasound systems for skin tightening, facial lifting, and non-invasive aesthetic treatments.",
    price: "",
    image: "/Products/image_40.png",
    longDescription: { keyBenefits: [], wavelengths: [], handpiece: "", specifications: [] }
  },
  {
    id: 30,
    name: "HIFU 10D",
    category: "Machine",
    description: "High-Intensity Focused Ultrasound systems for skin tightening, facial lifting, and non-invasive aesthetic treatments.",
    price: "",
    image: "/Products/image_40.png",
    longDescription: { keyBenefits: [], wavelengths: [], handpiece: "", specifications: [] }
  },
  {
    id: 31,
    name: "3 IN 1 HIFU",
    category: "Machine",
    description: "High-Intensity Focused Ultrasound systems for skin tightening, facial lifting, and non-invasive aesthetic treatments.",
    price: "",
    image: "/Products/image_40.png",
    longDescription: { keyBenefits: [], wavelengths: [], handpiece: "", specifications: [] }
  },
  {
    id: 32,
    name: "3 Motor Electric Derma Bed",
    category: "Machine",
    description: "Professional treatment beds designed for aesthetic clinics, dermatology centers, and beauty professionals.",
    price: "",
    image: "/Products/image_32.png",
    longDescription: { keyBenefits: [], wavelengths: [], handpiece: "", specifications: [] }
  },
  {
    id: 33,
    name: "Hydraulic Derma Bed",
    category: "Machine",
    description: "Professional treatment beds designed for aesthetic clinics, dermatology centers, and beauty professionals.",
    price: "",
    image: "/Products/image_33.png",
    longDescription: { keyBenefits: [], wavelengths: [], handpiece: "", specifications: [] }
  },
  {
    id: 34,
    name: "Heavy Duty Electric Derma Bed",
    category: "Machine",
    description: "Professional treatment beds designed for aesthetic clinics, dermatology centers, and beauty professionals.",
    price: "",
    image: "/Products/image_31.png",
    longDescription: { keyBenefits: [], wavelengths: [], handpiece: "", specifications: [] }
  }
];

// Re-assign images and details from old array where applicable
newMachines.forEach(nm => {
  const old = products.find(op => op.name.toLowerCase().includes(nm.name.toLowerCase()) || nm.name.toLowerCase().includes(op.name.toLowerCase()));
  if (old) {
    if (nm.image.startsWith('/Products')) {
       nm.image = old.image;
    }
    if (nm.longDescription.keyBenefits.length === 0 && old.longDescription && old.longDescription.keyBenefits) {
      nm.longDescription.keyBenefits = old.longDescription.keyBenefits;
    }
    if (old.longDescription) {
      nm.longDescription.specifications = old.longDescription.specifications;
      nm.longDescription.handpiece = old.longDescription.handpiece;
      nm.longDescription.wavelengths = old.longDescription.wavelengths;
    }
  }
});

const finalProducts = [...newMachines, ...nonMachineProducts, ...koreanProducts];

fs.writeFileSync('src/data/products.ts', 'export const PRODUCTS = ' + JSON.stringify(finalProducts, null, 2) + ';\n');
