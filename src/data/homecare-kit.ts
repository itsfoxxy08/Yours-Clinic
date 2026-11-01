export interface KitCategory {
  id: string;
  title: string;
  shortDescription: string;
  productCount: number;
  iconName: "Stethoscope" | "Flame" | "Snowflake" | "Bandage" | "Sparkles" | "HeartPulse";
  accentColor: string;
  badge: string;
}

export interface KitProductItem {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  manufacturer: string;
  packSize: string;
  quantityIncluded: number;
  form:
    | "Liquid Dilution"
    | "Biochemic Tablet"
    | "External Ointment / Gel"
    | "Hair & Scalp Oil"
    | "Botanical Syrup";
  standardPotency?: string;
  estimatedMrp: number;
  expiryInfo: string;
  storage: string;
  pharmacopoeia:
    | "HPI (Homeopathic Pharmacopoeia of India)"
    | "GHP (German Homeopathic Pharmacopoeia)"
    | "Standard";
  description: string;
  safetyNote: string;
  ingredients: string;
}

export interface HomeCareKitConfig {
  id: string;
  title: string;
  tagline: string;
  subtitle: string;
  description: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
  inStock: boolean;
  stockCount: number;
  totalProductsCount: number;
  shipping: {
    isFree: boolean;
    cost: number;
    estimatedDays: string;
    courierPartners: string[];
  };
  boxIncludes: string[];
  highlights: { title: string; desc: string; icon: string }[];
}

export const HOMECARE_KIT_CONFIG: HomeCareKitConfig = {
  id: "homecare-essentials-kit",
  title: "HomeCare Essentials Kit",
  tagline: "Everyday Wellness, All in One Place.",
  subtitle:
    "A thoughtfully curated collection of homeopathic healthcare essentials for convenient access to commonly used products at home.",
  description:
    "Designed under the clinical guidance of Yours Clinic practitioners, this household kit provides 15 standard, sealed homeopathic formulations suited for everyday, self-limiting household healthcare needs. Packaged in a compact, organized travel case complete with our accredited clinician usage and safety handbook.",
  mrp: 2499,
  sellingPrice: 1899,
  discountPercentage: 24,
  inStock: true,
  stockCount: 42,
  totalProductsCount: 15,
  shipping: {
    isFree: true,
    cost: 0,
    estimatedDays: "2 – 4 business days",
    courierPartners: ["BlueDart Express", "Delhivery Healthcare", "DTDC Priority"],
  },
  boxIncludes: [
    "15 Standard Homeopathic Formulations (Sealed, Original Packs)",
    "Hardbound Household Safety & Dosage Reference Guide by Dr. Sumit Jha",
    "Thermal & Shock-Resistant Padded Medicine Storage Bag",
    "Pre-measured Medicine Dropper & Clean Storage Vials",
    "Complimentary 15-day Doctor Follow-Up Consultation Access",
  ],
  highlights: [
    {
      title: "Clinic Curated",
      desc: "Selected by qualified homeopathic practitioners",
      icon: "ShieldCheck",
    },
    {
      title: "HPI & GMP Certified",
      desc: "Standard pharmacopoeia compliant remedies",
      icon: "Award",
    },
    {
      title: "Free Express Shipping",
      desc: "Safe doorstep delivery across all Indian pin codes",
      icon: "Truck",
    },
    {
      title: "Doctor Support",
      desc: "Access to professional advice whenever needed",
      icon: "PhoneCall",
    },
  ],
};

export const KIT_CATEGORIES: KitCategory[] = [
  {
    id: "digestive",
    title: "Digestive Wellness",
    shortDescription:
      "Commonly stocked homeopathic digestive-care products for everyday dietary discomforts and bloating.",
    productCount: 3,
    iconName: "Flame",
    accentColor: "emerald",
    badge: "3 Products",
  },
  {
    id: "cold-seasonal",
    title: "Cold & Seasonal Care",
    shortDescription:
      "Products commonly marketed for early-stage seasonal chills, runny nose, and weather-change sensitivities.",
    productCount: 3,
    iconName: "Snowflake",
    accentColor: "blue",
    badge: "3 Products",
  },
  {
    id: "first-aid",
    title: "First-Aid & Minor Complaints",
    shortDescription:
      "Essential household wellness products for routine blunt muscle soreness, superficial cuts, and scrapes.",
    productCount: 3,
    iconName: "Bandage",
    accentColor: "amber",
    badge: "3 Products",
  },
  {
    id: "skin-care",
    title: "Skin & Personal Care",
    shortDescription:
      "Selected gentle homeopathic topical formulations and remedies for minor surface irritations and bug bites.",
    productCount: 3,
    iconName: "Sparkles",
    accentColor: "teal",
    badge: "3 Products",
  },
  {
    id: "general-wellness",
    title: "General Wellness & Vitality",
    shortDescription:
      "Other commonly stocked homeopathic biochemic combinations and botanical tonics for household vitality.",
    productCount: 3,
    iconName: "HeartPulse",
    accentColor: "indigo",
    badge: "3 Products",
  },
];

export const KIT_PRODUCTS: KitProductItem[] = [
  // 1. Digestive Wellness
  {
    id: "nux-vomica-30c",
    name: "Nux Vomica 30C",
    category: "Digestive Wellness",
    categoryId: "digestive",
    manufacturer: "Dr. Reckeweg / SBL",
    packSize: "30 ml",
    quantityIncluded: 1,
    form: "Liquid Dilution",
    standardPotency: "30C",
    estimatedMrp: 135,
    expiryInfo: "5 Years from Mfg Date (Batch 2026)",
    storage: "Store in a cool, dry place away from direct sunlight, camphor, and strong perfumes.",
    pharmacopoeia: "HPI (Homeopathic Pharmacopoeia of India)",
    description:
      "A classic homeopathic preparation commonly kept at home for transient indigestion, post-heavy meal discomfort, and acidity associated with irregular dietary schedules.",
    safetyNote:
      "Do not exceed recommended usage. Consult a clinician if acute gastric pain persists or radiates.",
    ingredients:
      "Standard homeopathic dilution of Strychnos Nux-vomica in 90% v/v dispensing alcohol.",
  },
  {
    id: "carbo-veg-30c",
    name: "Carbo Vegetabilis 30C",
    category: "Digestive Wellness",
    categoryId: "digestive",
    manufacturer: "SBL / Dr. Reckeweg",
    packSize: "30 ml",
    quantityIncluded: 1,
    form: "Liquid Dilution",
    standardPotency: "30C",
    estimatedMrp: 135,
    expiryInfo: "5 Years from Mfg Date",
    storage: "Keep bottle tightly closed in the kit organizer pouch.",
    pharmacopoeia: "HPI (Homeopathic Pharmacopoeia of India)",
    description:
      "Commonly stocked for upper-abdominal fullness, post-meal gas distention, and sluggish digestion after rich food intake.",
    safetyNote:
      "For mild, self-limiting bloating. Persistent pain or vomiting requires clinical assessment.",
    ingredients:
      "Vegetable charcoal preparation prepared under standard homeopathic potentization.",
  },
  {
    id: "natrum-phos-6x",
    name: "Natrum Phosphoricum 6X",
    category: "Digestive Wellness",
    categoryId: "digestive",
    manufacturer: "Schwabe India / SBL",
    packSize: "25 g",
    quantityIncluded: 1,
    form: "Biochemic Tablet",
    standardPotency: "6X",
    estimatedMrp: 120,
    expiryInfo: "5 Years from Mfg Date",
    storage: "Store below 30°C in moisture-sealed bottle.",
    pharmacopoeia: "HPI (Homeopathic Pharmacopoeia of India)",
    description:
      "One of the 12 classic Schuessler biochemic tissue salts, traditionally stocked for mild acid dyspepsia, sour eructations, and occasional heartburn.",
    safetyNote:
      "Sublingual tablets; dissolve under tongue. Avoid eating or drinking for 15 minutes before and after.",
    ingredients: "Sodium phosphate triturated with pure pharmaceutical lactose base (6X).",
  },

  // 2. Cold & Seasonal Care
  {
    id: "aconitum-nap-30c",
    name: "Aconitum Napellus 30C",
    category: "Cold & Seasonal Care",
    categoryId: "cold-seasonal",
    manufacturer: "SBL / Schwabe India",
    packSize: "30 ml",
    quantityIncluded: 1,
    form: "Liquid Dilution",
    standardPotency: "30C",
    estimatedMrp: 135,
    expiryInfo: "5 Years from Mfg Date",
    storage: "Keep in a dark, dry place protected from radiation and heat.",
    pharmacopoeia: "GHP (German Homeopathic Pharmacopoeia)",
    description:
      "A primary household choice stocked for the very earliest indication of seasonal chills following exposure to cold dry winds or sudden weather changes.",
    safetyNote:
      "Intended for initial transient chills. For high fever or respiratory difficulty, consult immediately.",
    ingredients:
      "Aconitum napellus potentized dilution conforming to official pharmacopoeia guidelines.",
  },
  {
    id: "allium-cepa-30c",
    name: "Allium Cepa 30C",
    category: "Cold & Seasonal Care",
    categoryId: "cold-seasonal",
    manufacturer: "Dr. Reckeweg / SBL",
    packSize: "30 ml",
    quantityIncluded: 1,
    form: "Liquid Dilution",
    standardPotency: "30C",
    estimatedMrp: 140,
    expiryInfo: "5 Years from Mfg Date",
    storage: "Store in original sealed amber bottle.",
    pharmacopoeia: "HPI (Homeopathic Pharmacopoeia of India)",
    description:
      "Widely recognized homeopathic dilution for mild seasonal head colds characterized by watery nasal discharge and frequent sneezing.",
    safetyNote:
      "Discontinue if symptoms clear. Consult clinician if symptoms do not improve within 48 hours.",
    ingredients: "Red onion (Allium cepa) standard homeopathic tincture potentized to 30C.",
  },
  {
    id: "ferrum-phos-6x",
    name: "Ferrum Phosphoricum 6X",
    category: "Cold & Seasonal Care",
    categoryId: "cold-seasonal",
    manufacturer: "Schwabe India / SBL",
    packSize: "25 g",
    quantityIncluded: 1,
    form: "Biochemic Tablet",
    standardPotency: "6X",
    estimatedMrp: 125,
    expiryInfo: "5 Years from Mfg Date",
    storage: "Keep container securely capped in ambient room temperature.",
    pharmacopoeia: "HPI (Homeopathic Pharmacopoeia of India)",
    description:
      "Essential biochemic tissue salt used as a gentle supportive remedy during initial signs of seasonal heaviness, mild congestion, and fatigue.",
    safetyNote:
      "Contains lactose. Safe for general adult and supervised pediatric household use as per guide.",
    ingredients: "Iron phosphate prepared according to Schuessler biochemic tissue method.",
  },

  // 3. First-Aid & Minor Complaints
  {
    id: "arnica-montana-30c",
    name: "Arnica Montana 30C",
    category: "First-Aid & Minor Complaints",
    categoryId: "first-aid",
    manufacturer: "Dr. Reckeweg / SBL",
    packSize: "30 ml",
    quantityIncluded: 1,
    form: "Liquid Dilution",
    standardPotency: "30C",
    estimatedMrp: 145,
    expiryInfo: "5 Years from Mfg Date",
    storage: "Store upright in cool environment away from direct electromagnetic appliances.",
    pharmacopoeia: "GHP (German Homeopathic Pharmacopoeia)",
    description:
      "The premier homeopathic first-aid remedy universally kept in household kits for muscular soreness after physical exertion, minor sprains, and blunt bruises.",
    safetyNote:
      "For internal dilution use only. Do not apply liquid dilutions directly on open bleeding lacerations.",
    ingredients: "Arnica montana botanical extract potentized to 30C in dispensing vehicle.",
  },
  {
    id: "calendula-ointment",
    name: "Calendula Officinalis Ointment",
    category: "First-Aid & Minor Complaints",
    categoryId: "first-aid",
    manufacturer: "SBL / Schwabe India",
    packSize: "25 g",
    quantityIncluded: 1,
    form: "External Ointment / Gel",
    standardPotency: "10% MT Base",
    estimatedMrp: 95,
    expiryInfo: "3 Years from Mfg Date",
    storage: "Store below 25°C. Do not freeze.",
    pharmacopoeia: "HPI (Homeopathic Pharmacopoeia of India)",
    description:
      "A soothing herbal topical ointment prepared from Marigold (Calendula), suited for minor superficial abrasions, dry cracked skin, and superficial scratches.",
    safetyNote:
      "For external application only. Clean the wound surface gently with potable water prior to applying.",
    ingredients: "Calendula officinalis Mother Tincture 10% in non-greasy petroleum base.",
  },
  {
    id: "hypericum-30c",
    name: "Hypericum Perforatum 30C",
    category: "First-Aid & Minor Complaints",
    categoryId: "first-aid",
    manufacturer: "SBL / Dr. Reckeweg",
    packSize: "30 ml",
    quantityIncluded: 1,
    form: "Liquid Dilution",
    standardPotency: "30C",
    estimatedMrp: 135,
    expiryInfo: "5 Years from Mfg Date",
    storage: "Store in a dry location sheltered from intense ambient heat.",
    pharmacopoeia: "HPI (Homeopathic Pharmacopoeia of India)",
    description:
      "Traditionally included in household collections for minor complaints involving nerve-rich areas such as pinched fingers, toe stubs, or tailbone jolts.",
    safetyNote:
      "Not for severe fractures or head trauma. Seek emergency hospital care for severe impact injuries.",
    ingredients: "St. John's Wort (Hypericum perforatum) potentized homeopathic solution.",
  },

  // 4. Skin & Personal Care
  {
    id: "cantharis-30c",
    name: "Cantharis 30C",
    category: "Skin & Personal Care",
    categoryId: "skin-care",
    manufacturer: "SBL / Dr. Reckeweg",
    packSize: "30 ml",
    quantityIncluded: 1,
    form: "Liquid Dilution",
    standardPotency: "30C",
    estimatedMrp: 140,
    expiryInfo: "5 Years from Mfg Date",
    storage: "Keep in the dedicated kit slot away from sunlight.",
    pharmacopoeia: "HPI (Homeopathic Pharmacopoeia of India)",
    description:
      "Frequently stocked in kitchen and household emergency cabinets for discomfort from minor first-degree thermal scalds, steam burns, or mild sunburns.",
    safetyNote:
      "For superficial thermal irritations. Deep, blistering, or second/third-degree burns require medical emergency attention.",
    ingredients: "Cantharis vesicatoria homeopathic potentized preparation.",
  },
  {
    id: "berberis-aquifolium-gel",
    name: "Berberis Aquifolium Gel",
    category: "Skin & Personal Care",
    categoryId: "skin-care",
    manufacturer: "Schwabe India / SBL",
    packSize: "30 g",
    quantityIncluded: 1,
    form: "External Ointment / Gel",
    standardPotency: "10% Herbal Base",
    estimatedMrp: 115,
    expiryInfo: "3 Years from Mfg Date",
    storage: "Store in a cool dry place with cap tightly replaced.",
    pharmacopoeia: "HPI (Homeopathic Pharmacopoeia of India)",
    description:
      "A soothing, transparent herbal skin gel known for nourishing facial skin, soothing dry rough patches, and supporting skin clarity.",
    safetyNote:
      "Perform a small patch test before wide application. Avoid contact with eyes and mucous membranes.",
    ingredients:
      "Berberis aquifolium botanical extract formulated in light dermatological gel base.",
  },
  {
    id: "apis-mellifica-30c",
    name: "Apis Mellifica 30C",
    category: "Skin & Personal Care",
    categoryId: "skin-care",
    manufacturer: "Dr. Reckeweg / SBL",
    packSize: "30 ml",
    quantityIncluded: 1,
    form: "Liquid Dilution",
    standardPotency: "30C",
    estimatedMrp: 140,
    expiryInfo: "5 Years from Mfg Date",
    storage: "Store safely out of reach of unattended young children.",
    pharmacopoeia: "GHP (German Homeopathic Pharmacopoeia)",
    description:
      "Stocked for sudden localized stinging sensations, mild insect bites, mosquito lumps, or puffy pink skin reactions.",
    safetyNote:
      "If breathing difficulty, facial swelling, or severe anaphylaxis signs occur, call emergency medical services immediately.",
    ingredients:
      "Apis mellifica potentized solution conforming to international homeopathic monograph.",
  },

  // 5. General Wellness & Vitality
  {
    id: "five-phos-6x",
    name: "Five Phos 6X (Biochemic Compound)",
    category: "General Wellness & Vitality",
    categoryId: "general-wellness",
    manufacturer: "Schwabe India / SBL",
    packSize: "25 g",
    quantityIncluded: 1,
    form: "Biochemic Tablet",
    standardPotency: "6X",
    estimatedMrp: 150,
    expiryInfo: "5 Years from Mfg Date",
    storage: "Store tightly sealed away from damp conditions.",
    pharmacopoeia: "HPI (Homeopathic Pharmacopoeia of India)",
    description:
      "A classic biochemic formulation combining Calcarea Phos, Ferrum Phos, Kali Phos, Magnesia Phos, and Natrum Phos for everyday physical and mental fatigue.",
    safetyNote:
      "A supportive tissue salt tonic; not a substitute for balanced nutrition or adequate sleep.",
    ingredients:
      "Equal proportions of Calcarea Phos 6X, Ferrum Phos 6X, Kali Phos 6X, Magnesia Phos 6X, Natrum Phos 6X.",
  },
  {
    id: "arnica-hair-oil",
    name: "Arnica Herbal Hair & Scalp Oil",
    category: "General Wellness & Vitality",
    categoryId: "general-wellness",
    manufacturer: "SBL / Yours Clinic Clinic-Blend",
    packSize: "100 ml",
    quantityIncluded: 1,
    form: "Hair & Scalp Oil",
    standardPotency: "Herbal Blend",
    estimatedMrp: 165,
    expiryInfo: "3 Years from Mfg Date",
    storage: "Keep cap sealed after use.",
    pharmacopoeia: "Standard",
    description:
      "A non-sticky herbal oil infused with extracts of Arnica Montana, Jaborandi, and Calendula for gentle scalp massage and root nourishment.",
    safetyNote: "For external scalp massage only. Safe for regular household hair care routine.",
    ingredients:
      "Light mineral base infused with active herbal extracts of Arnica Montana, Pilocarpus (Jaborandi), and Cantharis.",
  },
  {
    id: "alfalfa-tonic-sugarfree",
    name: "Alfalfa Botanical Tonic (Sugar-Free)",
    category: "General Wellness & Vitality",
    categoryId: "general-wellness",
    manufacturer: "Schwabe India / SBL",
    packSize: "100 ml",
    quantityIncluded: 1,
    form: "Botanical Syrup",
    standardPotency: "Multi-Herb Tonic",
    estimatedMrp: 180,
    expiryInfo: "3 Years from Mfg Date",
    storage: "Store in a cool place. Shake well before opening.",
    pharmacopoeia: "HPI (Homeopathic Pharmacopoeia of India)",
    description:
      "A wholesome restorative formulation containing Alfalfa, Avena Sativa, and Ginseng to support appetite, vitality, and convalescence recovery.",
    safetyNote: "Sugar-free formulation suitable for adults. Store away from excessive heat.",
    ingredients:
      "Extracts of Medicago sativa (Alfalfa) Q, Avena sativa Q, Hydrastis canadensis Q, Cinchona officinalis Q, Withania somnifera Q.",
  },
];

export const KIT_FAQS = [
  {
    question: "What is included in the HomeCare Essentials Kit?",
    answer:
      "The HomeCare Essentials Kit contains 15 standard, sealed homeopathic formulations manufactured by GMP-certified laboratories (such as SBL, Dr. Reckeweg, and Schwabe India). It covers 5 essential household wellness categories: Digestive Wellness, Cold & Seasonal Care, First-Aid & Minor Complaints, Skin & Personal Care, and General Wellness. In addition, you receive our clinician-authored hardbound Safety & Usage Reference Guide, clean measuring tools, and a protective shock-resistant travel case.",
  },
  {
    question: "Can I see the complete list of medicines before ordering?",
    answer:
      "Yes, absolutely! We believe in complete medical transparency. You can inspect every single medicine in the kit—including its pharmacopoeia standard, manufacturer, formulation type, pack size, quantity, and storage guidelines—in the 'Product Details & Transparency' section on this page before placing your order.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "We provide Pan-India express delivery through premium healthcare courier networks (such as BlueDart and Delhivery Healthcare). Orders are dispatched within 24 business hours from our central clinic dispensary. Metro locations typically receive delivery within 2 to 3 business days, while other pin codes take 3 to 4 business days. You receive full SMS/WhatsApp tracking immediately upon dispatch.",
  },
  {
    question: "Can I consult a practitioner before purchasing?",
    answer:
      "Yes! You are always welcome to speak with our qualified clinicians. If you or a family member have specific chronic ailments, ongoing allopathic medications, or distinct medical questions, you can click 'Book Appointment' or message our clinic desk. Every purchase also includes complimentary 15-day doctor follow-up support access for any questions regarding kit usage.",
  },
  {
    question: "Can I order additional products separately?",
    answer:
      "Yes. If you run out of an individual dilution, biochemic salt, or external ointment, you can easily re-order standalone refills through our clinic's 'Order Medicines' portal or by messaging our pharmacy team with your original HomeCare Order ID.",
  },
  {
    question: "What is the return and cancellation policy?",
    answer:
      "Because these are pharmaceutical and healthcare products governed by drug safety regulations, opened or unsealed medicines cannot be returned for hygienic safety. However, if your kit arrives with any transit damage or manufacturing defect, we provide a 100% free immediate replacement or full refund upon notifying our support desk within 48 hours of receipt.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is confirmed, you will receive a unique Order ID (e.g. YC-HCK-XXXX). You can track your real-time fulfillment status anytime using the 'Track Order' tool right here on this page, or through the automated WhatsApp and SMS notifications sent to your registered phone number.",
  },
];
