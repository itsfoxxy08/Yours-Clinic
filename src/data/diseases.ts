import asthmaImg from "@/assets/diseases/asthma.jpg";
import hairFallImg from "@/assets/diseases/hair-fall.jpg";
import renalStoneImg from "@/assets/diseases/renal-stone.jpg";
import gallStoneImg from "@/assets/diseases/gall-stone.jpg";
import arthritisImg from "@/assets/diseases/arthritis.jpg";
import rheumatoidImg from "@/assets/diseases/rheumatoid-arthritis.jpg";
import pilesImg from "@/assets/diseases/piles.jpg";
import pcosImg from "@/assets/diseases/pcos.jpg";
import psoriasisImg from "@/assets/diseases/psoriasis.jpg";
import vitiligoImg from "@/assets/diseases/vitiligo.jpg";
import sciaticaImg from "@/assets/diseases/sciatica.jpg";
import eczemaImg from "@/assets/diseases/eczema.jpg";
import chalazionImg from "@/assets/diseases/chalazion.jpg";
import anxietyImg from "@/assets/diseases/anxiety.jpg";
import ringWormImg from "@/assets/diseases/ring-worm.jpg";
import fissureImg from "@/assets/diseases/fissure.jpg";
import fattyLiverImg from "@/assets/diseases/fatty-liver.jpg";
import constipationImg from "@/assets/diseases/constipation.jpg";
import gastricImg from "@/assets/diseases/gastric.jpg";
import ibsImg from "@/assets/diseases/ibs.jpg";
import cervicalImg from "@/assets/diseases/cervical-spondylosis.jpg";
import ankylosingImg from "@/assets/diseases/ankylosing-spondylitis.jpg";
import calcanealImg from "@/assets/diseases/calcaneal-spur.jpg";
import parkinsonImg from "@/assets/diseases/parkinson-disease.jpg";
import goutImg from "@/assets/diseases/gout.jpg";

export type DiseaseCategory =
  | "respiratory"
  | "chronic"
  | "digestive"
  | "skin"
  | "joints"
  | "urology"
  | "womens"
  | "mind"
  | "eye"
  | "neuro";

export type Disease = {
  slug: string;
  title: string;
  category: DiseaseCategory;
  image: string;
  short: string;
  /** Long-form explanation, one string per paragraph. */
  overview: string[];
  symptoms: string[];
  /** Optional named sub-types or grades of the condition. */
  types?: { name: string; text: string }[];
  /** Optional causes, triggers or risk factors. */
  causes?: string[];
  whenToSee: string;
  prevention: string[];
};

export const categories: { value: DiseaseCategory | "all"; label: string }[] = [
  { value: "all", label: "All conditions" },
  { value: "respiratory", label: "Respiratory" },
  { value: "chronic", label: "Chronic" },
  { value: "digestive", label: "Digestive" },
  { value: "skin", label: "Skin & Hair" },
  { value: "joints", label: "Bones & Joints" },
  { value: "urology", label: "Urology" },
  { value: "womens", label: "Women's Health" },
  { value: "mind", label: "Mind & Mood" },
  { value: "eye", label: "Eye Care" },
  { value: "neuro", label: "Neurological" },
];

export const categoryLabel = (value: DiseaseCategory) =>
  categories.find((c) => c.value === value)?.label ?? value;

export const diseases: Disease[] = [
  {
    slug: "asthma",
    title: "Asthma",
    category: "respiratory",
    image: asthmaImg,
    short:
      "A chronic respiratory condition in which the airways become inflamed and narrowed, making breathing difficult.",
    overview: [
      "Asthma is a chronic respiratory condition characterised by inflammation and narrowing of the airways, which leads to difficulty in breathing. The lining of the bronchial tubes becomes inflamed and swollen, the muscles around the airways tighten, and excess mucus is produced — together these block airflow.",
      "Asthma is managed through a combination of long-term control and quick-relief measures. Regular monitoring and avoiding known triggers are essential. With proper treatment and constitutional care, people with asthma can lead normal, active lives.",
    ],
    symptoms: [
      "Shortness of breath or feeling out of breath",
      "Wheezing — a whistling or squeaky sound while breathing",
      "Coughing, especially at night or early morning",
      "Chest tightness or a feeling of pressure",
    ],
    causes: [
      "Allergens such as pollen, dust mites, pet dander and mould",
      "Irritants like smoke, pollution and strong odours",
      "Respiratory infections such as the common cold",
      "Physical activity (exercise-induced asthma)",
      "Cold air or sudden changes in weather",
      "Strong emotions and stress",
    ],
    whenToSee:
      "Seek urgent care for breathlessness at rest, difficulty speaking in full sentences, blue lips, or relief inhalers that stop working.",
    prevention: [
      "Track and remove your personal triggers at home and work",
      "Keep bedding, curtains and fans free of dust",
      "Practise gentle breathing exercises daily",
      "Never stop prescribed inhalers without medical advice",
    ],
  },
  {
    slug: "hair-fall",
    title: "Hair Fall",
    category: "skin",
    image: hairFallImg,
    short:
      "Hair loss (alopecia) affecting millions, driven by genetics, hormones, nutrition, stress and scalp health.",
    overview: [
      "Hair fall, also known as hair loss or alopecia, is a common concern affecting millions of people worldwide. It can have a significant impact on self-esteem and confidence, so understanding the causes, prevention strategies and available treatments is crucial for managing it effectively.",
      "Because hair fall usually has more than one driver, treatment begins with a full history: diet, thyroid and iron status, hormonal changes, medication, stress and styling habits are all reviewed before a remedy plan is set.",
    ],
    symptoms: [
      "Gradual thinning at the crown or widening parting",
      "Excessive shedding while combing or washing",
      "Patchy bald spots on the scalp or beard",
      "Receding hairline or visible scalp",
      "Itching, flaking or scalp infection alongside shedding",
    ],
    causes: [
      "Genetic factors — androgenetic alopecia (male or female pattern baldness)",
      "Hormonal changes: pregnancy, childbirth, menopause, thyroid problems",
      "Medical conditions such as alopecia areata and scalp infections",
      "Medications and treatments including chemotherapy",
      "Nutritional deficiencies of iron, protein and vitamins",
      "High stress, poor sleep, tight hairstyles and excessive heat or chemicals",
    ],
    whenToSee:
      "Book a review if you notice sudden patchy loss, hair fall after fever or delivery, or shedding that continues beyond three months.",
    prevention: [
      "Eat a balanced diet rich in iron, zinc, vitamin D and protein",
      "Use gentle shampoos and avoid styles that pull on the hair",
      "Manage stress with exercise, meditation and adequate sleep",
      "Keep the scalp clean; massage regularly to improve circulation",
      "Limit heat styling and chemical treatments",
    ],
  },
  {
    slug: "renal-stone",
    title: "Renal Stone (Kidney Stone)",
    category: "urology",
    image: renalStoneImg,
    short:
      "Hard mineral and salt deposits that form inside the kidneys and can affect any part of the urinary tract.",
    overview: [
      "Renal stones, also known as kidney stones or nephrolithiasis, are hard deposits made of minerals and salts that form inside the kidneys. These stones can affect any part of the urinary tract, from the kidneys to the bladder.",
      "Kidney stones vary in size and shape. Some pass through the urinary tract without symptoms, while others cause severe pain and complications that need prompt review.",
    ],
    symptoms: [
      "Severe, cramping pain in the back and side below the ribs, radiating to the lower abdomen and groin",
      "Hematuria — pink, red or brown urine",
      "Nausea and vomiting caused by the intense pain",
      "Frequent urination or passing small amounts often",
      "Cloudy or foul-smelling urine",
      "Fever and chills, which may signal infection",
    ],
    causes: [
      "Dehydration, which concentrates minerals in the urine",
      "Diets high in sodium, sugar, protein or oxalate-rich foods",
      "Medical conditions: hyperparathyroidism, gout, urinary infections, diabetes, obesity",
      "Family history and genetic predisposition",
      "Certain medications and supplements, including high-dose vitamin D",
    ],
    whenToSee:
      "Seek immediate care for pain with fever and chills, inability to pass urine, or pain so severe you cannot sit still.",
    prevention: [
      "Drink enough water to keep urine pale through the day",
      "Reduce salt and animal protein; do not cut calcium without advice",
      "Moderate oxalate-rich foods such as spinach and nuts",
      "Repeat imaging as advised if you have had stones before",
    ],
  },
  {
    slug: "gall-stone",
    title: "Gall Stone",
    category: "digestive",
    image: gallStoneImg,
    short:
      "Hardened deposits of digestive fluid that form in the gallbladder and can trigger sudden biliary colic.",
    overview: [
      "Gallstones, or cholelithiasis, are hardened deposits of digestive fluid that form in the gallbladder, a small organ beneath the liver. The gallbladder stores bile, which aids the digestion of fats.",
      "Gallstones vary from the size of a grain of sand to as large as a golf ball, and they form when the chemical composition of bile becomes imbalanced — through excess cholesterol, excess bilirubin, or bile that stays too concentrated because the gallbladder does not empty properly.",
    ],
    types: [
      {
        name: "Cholesterol gallstones",
        text: "The most common type, often yellow-green, primarily composed of undissolved cholesterol.",
      },
      {
        name: "Pigment gallstones",
        text: "Smaller, darker stones made of bilirubin, more common with liver cirrhosis and blood disorders.",
      },
    ],
    symptoms: [
      "Sudden, intense pain in the upper right abdomen, radiating to the back or right shoulder blade",
      "Nausea and vomiting with the abdominal pain",
      "Indigestion, bloating, heartburn and gas",
      "Jaundice — yellowing of skin and eyes if a stone blocks the bile duct",
      "Fever and chills, suggesting infection such as cholecystitis",
    ],
    whenToSee:
      "Get urgent care for abdominal pain lasting several hours, yellowing of the eyes, or high fever with chills.",
    prevention: [
      "Eat regular meals; avoid prolonged fasting and crash diets",
      "Keep fat intake moderate and fibre intake high",
      "Maintain a steady, healthy weight",
      "Bring existing ultrasound or MRCP reports to your consultation",
    ],
  },
  {
    slug: "arthritis",
    title: "Arthritis",
    category: "joints",
    image: arthritisImg,
    short:
      "An umbrella term for more than 100 joint conditions causing pain, inflammation and stiffness.",
    overview: [
      "Arthritis is a broad term that encompasses more than 100 different conditions affecting the joints, causing pain, inflammation and stiffness. It is common at any age but more prevalent among older adults, and its impact on daily life can be significant.",
      "Diagnosis combines medical history and physical examination with imaging (X-ray, MRI, ultrasound), laboratory tests such as rheumatoid factor, anti-CCP antibodies and uric acid, and sometimes joint fluid analysis.",
    ],
    types: [
      {
        name: "Osteoarthritis (OA)",
        text: "Wear-and-tear arthritis where protective cartilage wears down, typically affecting hands, knees, hips and spine.",
      },
      {
        name: "Rheumatoid arthritis (RA)",
        text: "An autoimmune disorder in which the immune system attacks the synovium, causing swelling and eventual joint deformity.",
      },
      {
        name: "Gout",
        text: "Sudden severe attacks of pain and redness, often at the base of the big toe, caused by urate crystals.",
      },
      {
        name: "Psoriatic arthritis",
        text: "Joint pain, stiffness and swelling affecting some people who have psoriasis.",
      },
      {
        name: "Lupus (SLE)",
        text: "An autoimmune disease that can inflame joints, skin, kidneys, blood cells, brain, heart and lungs.",
      },
    ],
    symptoms: [
      "Persistent or intermittent joint pain",
      "Stiffness, especially in the morning or after inactivity",
      "Swelling in and around the joints",
      "Redness, particularly in RA and gout",
      "Decreased range of motion",
      "Fatigue in autoimmune forms",
      "Fever with inflammatory arthritis",
    ],
    whenToSee:
      "Book a review for joint swelling lasting more than two weeks, morning stiffness beyond an hour, or joints that are hot and red.",
    prevention: [
      "Keep joints moving with low-impact activity",
      "Maintain a healthy weight to reduce joint load",
      "Strengthen supporting muscles under guidance",
      "Bring previous X-rays and blood reports to consultations",
    ],
  },
  {
    slug: "rheumatoid-arthritis",
    title: "Rheumatoid Arthritis",
    category: "joints",
    image: rheumatoidImg,
    short:
      "A chronic autoimmune inflammatory disorder that affects the joint lining and can involve other body systems.",
    overview: [
      "Rheumatoid arthritis is a chronic inflammatory disorder that can affect more than just your joints. In some people the condition damages a wide variety of body systems, including the skin, eyes, lungs, heart and blood vessels.",
      "Unlike the wear-and-tear damage of osteoarthritis, rheumatoid arthritis affects the lining of the joints, causing painful swelling that can eventually result in bone erosion and joint deformity. About 40% of people also experience signs that do not involve the joints.",
      "Periods of increased disease activity, called flares, alternate with periods of relative remission when swelling and pain fade.",
    ],
    symptoms: [
      "Tender, warm, swollen joints",
      "Joint stiffness that is worse in the mornings and after inactivity",
      "Fatigue, fever and loss of appetite",
      "Small joints of the fingers and toes affected first, usually symmetrically",
      "Later spread to wrists, knees, ankles, elbows, hips and shoulders",
    ],
    whenToSee:
      "See a clinician promptly for symmetrical joint swelling with prolonged morning stiffness, or new breathlessness, eye pain or skin nodules.",
    prevention: [
      "Do not skip disease-monitoring blood tests",
      "Protect joints during flares; resume movement gently after",
      "Stop smoking — it worsens RA activity",
      "Track flares in a diary so remedies can be matched to your pattern",
    ],
  },
  {
    slug: "gout",
    title: "Gout",
    category: "joints",
    image: goutImg,
    short:
      "A complex form of arthritis marked by sudden, severe attacks of pain and swelling, most often in the big toe.",
    overview: [
      "Gout is a common and complex form of arthritis that can affect anyone. It is characterised by sudden, severe attacks of pain, swelling, redness and tenderness in one or more joints, most often in the big toe.",
      "An attack can occur suddenly, often waking you in the middle of the night with the sensation that your big toe is on fire. The affected joint is hot, swollen and so tender that even the weight of a bedsheet may seem intolerable. Symptoms come and go, but flares can be managed and prevented.",
    ],
    symptoms: [
      "Intense joint pain, most severe within the first four to twelve hours",
      "Lingering discomfort for days to weeks after the peak subsides",
      "Inflammation and redness — the joint becomes swollen, tender and warm",
      "Limited range of motion as gout progresses",
    ],
    whenToSee:
      "Seek care for a sudden hot, swollen joint — especially with fever, which can indicate joint infection rather than a gout flare.",
    prevention: [
      "Stay well hydrated throughout the day",
      "Limit alcohol, especially beer, and sugary drinks",
      "Moderate red meat, organ meat and shellfish",
      "Keep weight steady; avoid rapid crash dieting",
    ],
  },
  {
    slug: "sciatica-pain",
    title: "Sciatica Pain",
    category: "joints",
    image: sciaticaImg,
    short:
      "Pain travelling along the path of the sciatic nerve, from the lower back through the buttock and down the leg.",
    overview: [
      "Sciatica refers to pain that travels along the path of the sciatic nerve, which runs from the buttocks and down each leg. It most often happens when a herniated disk or an overgrowth of bone puts pressure on the lumbar spine nerve roots, causing inflammation, pain and often numbness in the affected leg.",
      "Although sciatica pain can be serious, cases caused by a herniated disk often clear up with treatment in a few weeks to months. People with severe sciatica and serious leg weakness or bowel or bladder changes may need surgery.",
    ],
    symptoms: [
      "Pain following a path from the low back to the buttock and back of the thigh and calf",
      "Pain ranging from a mild ache to sharp, burning or electric-shock sensations",
      "Worse with coughing, sneezing or prolonged sitting",
      "Usually affects only one side of the body",
      "Numbness, tingling or muscle weakness in the leg or foot",
    ],
    whenToSee:
      "Seek emergency care for loss of bladder or bowel control, numbness around the groin, or sudden severe leg weakness.",
    prevention: [
      "Strengthen the core and hip muscles gradually",
      "Lift with the legs, not the lower back",
      "Break up long periods of sitting every 30 minutes",
      "Keep a supportive mattress and neutral sleeping posture",
    ],
  },
  {
    slug: "cervical-spondylosis",
    title: "Cervical Spondylosis",
    category: "joints",
    image: cervicalImg,
    short:
      "Age-related wear and tear affecting the spinal disks in the neck, with bone spurs and stiffness.",
    overview: [
      "Cervical spondylosis is a general term for age-related wear and tear affecting the spinal disks in your neck. As the disks dehydrate and shrink, signs of osteoarthritis develop, including bony projections along the edges of bones (bone spurs).",
      "Cervical spondylosis is very common and worsens with age — more than 85% of people older than 60 are affected. For most people it causes no symptoms, and when symptoms do occur, non-surgical treatments are often effective.",
    ],
    symptoms: [
      "Neck pain and stiffness, often worse with upright activity",
      "Headaches originating at the back of the head",
      "Pain radiating into the shoulder, arm or between the shoulder blades",
      "Tingling, numbness or weakness in the arms or hands",
      "Grinding sensation when turning the neck",
    ],
    whenToSee:
      "Book a review for arm weakness, clumsy hands, unsteady walking, or neck pain following an injury.",
    prevention: [
      "Set screens at eye level and avoid prolonged neck flexion",
      "Do daily gentle neck mobility and shoulder-blade work",
      "Use a single supportive pillow at night",
      "Take a movement break every 30–40 minutes at a desk",
    ],
  },
  {
    slug: "ankylosing-spondylitis",
    title: "Ankylosing Spondylitis",
    category: "joints",
    image: ankylosingImg,
    short:
      "An inflammatory disease that can, over time, cause vertebrae in the spine to fuse and reduce flexibility.",
    overview: [
      "Ankylosing spondylitis, also known as axial spondyloarthritis, is an inflammatory disease that over time can cause some of the bones in the spine, called vertebrae, to fuse. This fusing makes the spine less flexible and can result in a hunched posture. If the ribs are affected, it can be difficult to breathe deeply.",
      "As the condition worsens, new bone forms as part of the body's attempt to heal, gradually bridging the gaps between vertebrae. Fused vertebrae flatten the natural curves of the spine.",
    ],
    types: [
      {
        name: "Ankylosing spondylitis",
        text: "When the condition is visible on X-ray.",
      },
      {
        name: "Non-radiographic axial spondyloarthritis",
        text: "When it cannot be seen on X-ray but is found from symptoms, blood tests and other imaging.",
      },
    ],
    symptoms: [
      "Low back and hip pain and stiffness, worst in the morning and after rest",
      "Pain that improves with movement and exercise",
      "Neck pain and fatigue",
      "Reduced chest expansion when the ribs are involved",
      "Eye inflammation (uveitis) in some people",
    ],
    whenToSee:
      "Get assessed for inflammatory back pain before age 45 that improves with exercise, or for a painful red eye with light sensitivity.",
    prevention: [
      "Maintain a daily spinal mobility and posture routine",
      "Swim or walk regularly to protect chest expansion",
      "Stop smoking to slow spinal stiffening",
      "Keep review appointments even during good phases",
    ],
  },
  {
    slug: "calcaneal-spur",
    title: "Calcaneal Spur",
    category: "joints",
    image: calcanealImg,
    short:
      "A bony growth on the heel bone and a common cause of heel pain, frequently linked with plantar fasciitis.",
    overview: [
      "Calcaneal spurs are a common cause of heel pain. They can occur anywhere along the calcaneal tuberosity but are most frequently found at the insertion of the plantar fascia.",
      "Calcaneal spurs are usually asymptomatic. When painful, the condition generally results from inflammation of the insertional fibres of the plantar fascia at the medial tuberosity, and symptomatic spurs are often found alongside plantar fasciitis.",
      "Spurs can occur alone or as part of a systemic inflammatory condition such as rheumatoid arthritis, Reiter's syndrome or gout. In some patients the cause is entirely mechanical — an abnormal gait with excessive heel strike, or high-impact aerobic exercise.",
    ],
    symptoms: [
      "Sharp heel pain with the first steps in the morning",
      "Pain returning after long periods of sitting or standing",
      "Tenderness on pressing the inner side of the heel",
      "Discomfort worse on hard floors or in unsupportive footwear",
    ],
    whenToSee:
      "Book a review for heel pain lasting more than six weeks, night pain, or heel pain alongside swollen joints elsewhere.",
    prevention: [
      "Wear cushioned footwear with proper arch support",
      "Stretch the calf and plantar fascia daily",
      "Avoid sudden increases in running or high-impact training",
      "Keep body weight in a healthy range to reduce heel load",
    ],
  },
  {
    slug: "piles",
    title: "Piles (Hemorrhoids)",
    category: "digestive",
    image: pilesImg,
    short:
      "Swollen veins in the lower anus and rectum that cause tissue growths, itching, discomfort and bleeding.",
    overview: [
      "Piles are the result of swollen veins in the lower anus and rectum. They can cause tissue growths in and around the anus and lead to significant discomfort. These growths vary in size and location.",
      "Internal piles occur within the rectum and are usually not visible externally, though a pile may grow to protrude outside the anus — a prolapsed hemorrhoid. External piles form small lumps on the outside edge of the anus; they are very itchy and can become painful if a blood clot develops. Thrombosed external piles require immediate medical treatment.",
    ],
    types: [
      { name: "Grade I", text: "The growth causes no symptoms and does not protrude out of the anus." },
      { name: "Grade II", text: "The piles may prolapse from the anus but return inside independently." },
      { name: "Grade III", text: "The piles prolapse and only recede with manual intervention." },
      { name: "Grade IV", text: "The piles prolapse outside the anus and cannot be pushed back in." },
    ],
    symptoms: [
      "Painful lumps in and around the anus",
      "Itching and discomfort around the anus",
      "Discomfort during and after passing stools",
      "Bloody stools",
    ],
    whenToSee:
      "Seek care for heavy anal bleeding, a hard painful lump, fever, or any change in bowel habit lasting more than three weeks.",
    prevention: [
      "Keep stools soft with fibre and adequate fluids",
      "Avoid straining and long periods on the toilet",
      "Stay active; avoid prolonged sitting",
      "Treat constipation early rather than waiting for flares",
    ],
  },
  {
    slug: "fissure",
    title: "Anal Fissure",
    category: "digestive",
    image: fissureImg,
    short:
      "A small tear in the thin, moist tissue lining the anus, usually caused by constipation and hard stools.",
    overview: [
      "An anal fissure is a small tear in the thin, moist tissue that lines the anus. Common causes include constipation and straining or passing hard or large stools during a bowel movement. Fissures typically cause pain and bleeding with bowel movements, and you may experience spasms in the anal sphincter.",
      "Anal fissures are very common in young infants but can affect people of any age. Most get better with simple treatments such as increased fibre intake or soaking in a warm-water bath.",
    ],
    symptoms: [
      "Pain during bowel movements",
      "Pain after bowel movements lasting up to several hours",
      "Bright red blood on the stool or toilet paper",
      "A visible crack in the skin around the anus",
      "A small lump or skin tag near the fissure",
    ],
    whenToSee:
      "Book a review for a fissure that has not healed in six weeks, recurring tears, or bleeding with weight loss or fever.",
    prevention: [
      "Increase dietary fibre gradually and drink more water",
      "Use warm sitz baths after bowel movements",
      "Do not delay the urge to pass stool",
      "Treat chronic constipation constitutionally, not only with laxatives",
    ],
  },
  {
    slug: "constipation",
    title: "Constipation",
    category: "digestive",
    image: constipationImg,
    short:
      "Passing fewer than three stools a week or having persistent difficulty passing stool.",
    overview: [
      "Constipation is a problem with passing stool — generally passing fewer than three stools a week or having a difficult time passing stool. It is fairly common, and a lack of dietary fibre, fluids and exercise can cause it. Other medical conditions or certain medicines may also be responsible.",
      "Long-term constipation, also called chronic constipation, may require treating another underlying disease or condition. Chronic constipation is defined as having two or more of the typical symptoms for three months or longer.",
    ],
    symptoms: [
      "Fewer than three stools a week",
      "Hard, dry or lumpy stools",
      "Straining or pain when passing stools",
      "A feeling that not all stool has passed",
      "A feeling that the rectum is blocked",
      "The need to use a finger to pass stool",
    ],
    whenToSee:
      "Get reviewed for constipation with blood in the stool, unexplained weight loss, persistent abdominal pain, or a new change after age 45.",
    prevention: [
      "Build fibre from fruit, vegetables and whole grains",
      "Drink water steadily through the day",
      "Walk or exercise daily to stimulate bowel movement",
      "Keep a consistent toilet routine and never suppress the urge",
    ],
  },
  {
    slug: "gastric",
    title: "Gastric Problems",
    category: "digestive",
    image: gastricImg,
    short:
      "Excess gas, bloating and cramping in the digestive system, often linked to diet and underlying gut disorders.",
    overview: [
      "Gas in your digestive system is part of the normal process of digestion, and getting rid of excess gas by burping or passing gas is also normal. Gas pain may occur if gas is trapped or not moving well through your digestive system.",
      "An increase in gas or gas pain often results from eating foods that are more likely to produce gas, and relatively simple changes in eating habits can lessen the problem. Certain digestive disorders — such as irritable bowel syndrome or celiac disease — can also cause increased gas or gas pain.",
    ],
    symptoms: [
      "Burping",
      "Passing gas",
      "Pain, cramps or a knotted feeling in the abdomen",
      "A feeling of fullness or pressure in the abdomen (bloating)",
      "An observable increase in abdominal size (distention)",
    ],
    whenToSee:
      "See a clinician for gas pain with weight loss, vomiting, blood in the stool, chest pain, or a persistent change in bowel habit.",
    prevention: [
      "Eat slowly and avoid carbonated and fizzy drinks",
      "Identify and reduce personal trigger foods",
      "Walk for 10 minutes after heavy meals",
      "Avoid late, oily dinners close to bedtime",
    ],
  },
  {
    slug: "ibs",
    title: "IBS (Irritable Bowel Syndrome)",
    category: "digestive",
    image: ibsImg,
    short:
      "A functional gut disorder where diet, stress and gut sensitivity drive recurring pain, bloating and irregular bowels.",
    overview: [
      "Treatment of IBS focuses on relieving symptoms so that you can live as symptom-free as possible. Mild symptoms can often be controlled by managing stress and by making changes in diet and lifestyle: avoiding trigger foods, eating high-fibre foods, drinking plenty of fluids, exercising regularly and getting enough sleep.",
      "Your provider may suggest eliminating high-gas foods, gluten, or FODMAPs — fermentable oligosaccharides, disaccharides, monosaccharides and polyols found in certain grains, vegetables, fruits and dairy products. A dietitian can help with these changes.",
      "If problems are moderate or severe, counselling can help, especially where depression or stress worsens symptoms. At Yours Clinic, constitutional prescribing runs alongside this dietary and stress work rather than replacing it.",
    ],
    symptoms: [
      "Recurring abdominal pain or cramping, often relieved after passing stool",
      "Bloating and visible distention",
      "Diarrhoea, constipation, or alternating between the two",
      "Mucus in the stool",
      "Urgency and a feeling of incomplete evacuation",
    ],
    whenToSee:
      "Book a review for rectal bleeding, night-time symptoms that wake you, unexplained weight loss, or a family history of bowel disease.",
    prevention: [
      "Keep a food and symptom diary to identify triggers",
      "Trial a low-FODMAP approach with dietitian support",
      "Protect sleep and build a daily stress-release habit",
      "Eat at regular times rather than skipping meals",
    ],
  },
  {
    slug: "fatty-liver",
    title: "Fatty Liver",
    category: "chronic",
    image: fattyLiverImg,
    short:
      "Excess fat stored in liver cells, often silent early on and closely linked with metabolic health.",
    overview: [
      "Fatty liver disease means a build-up of fat within liver cells. It is frequently found on routine ultrasound and is closely tied to weight, insulin resistance, lipid levels and alcohol intake.",
      "Early fatty liver is often reversible. Sustained changes to diet, activity and metabolic markers — reviewed alongside constitutional treatment — can restore normal liver texture and enzyme levels over months.",
    ],
    symptoms: [
      "Often no symptoms in the early stages",
      "Fatigue and a general sense of heaviness",
      "Dull ache or fullness in the upper right abdomen",
      "Raised liver enzymes on routine blood tests",
      "In advanced disease: swelling, jaundice or easy bruising",
    ],
    causes: [
      "Overweight and central obesity",
      "Insulin resistance, type 2 diabetes and metabolic syndrome",
      "High triglycerides and cholesterol",
      "Alcohol intake",
      "Certain medications and rapid weight loss",
    ],
    whenToSee:
      "Get reviewed for jaundice, abdominal swelling, vomiting blood, or liver enzymes that keep rising on repeat tests.",
    prevention: [
      "Aim for gradual, steady weight reduction rather than crash dieting",
      "Cut refined sugar, fructose-heavy drinks and fried food",
      "Exercise at least 150 minutes a week",
      "Repeat liver enzymes and ultrasound as advised",
    ],
  },
  {
    slug: "pcod",
    title: "PCOS / PCOD / Cyst / Fibroid",
    category: "womens",
    image: pcosImg,
    short:
      "A hormonal condition where the ovaries produce immature eggs that develop into cysts, affecting nearly 1 in 5 Indian women.",
    overview: [
      "Polycystic Ovarian Disease (PCOD) is a medical condition in which a woman's ovaries generate immature or partially mature eggs in large numbers during reproductive age. These eggs develop into cysts over time. Because of the cysts, the ovaries become large and secrete large amounts of male hormones (androgen), which cause infertility problems, irregular periods, unwanted weight gain and other health issues.",
      "It is estimated that nearly 20% of all Indian women — about 1 in 5 — live with PCOD. The symptoms often leave a lasting impact on physical and mental well-being: around 34% of women with PCOD also experience depression and nearly 45% experience anxiety, which makes early diagnosis and management essential.",
      "PCOD and PCOS are often used interchangeably, but they differ. In PCOD the ovaries produce immature eggs that transform into cysts; fertility is usually preserved and symptoms are milder. PCOS is a more severe metabolic disorder with higher androgen levels, greater impact on fertility, and links to type 2 diabetes, high blood pressure, heart disease and endometrial cancer.",
    ],
    symptoms: [
      "Irregular, delayed or missed periods",
      "Unwanted weight gain and difficulty losing weight",
      "Excess facial or body hair, acne and hair thinning",
      "Difficulty conceiving",
      "Mood swings, low self-confidence and negative self-image",
      "Disrupted eating and sleep patterns, low motivation",
    ],
    whenToSee:
      "Book a consultation for cycles longer than 35 days, absent periods, sudden severe pelvic pain, or difficulty conceiving after a year.",
    prevention: [
      "Chart your cycle so patterns can be reviewed month by month",
      "Prioritise strength and cardio training for insulin sensitivity",
      "Balance meals with protein and fibre; limit refined carbohydrates",
      "Screen for thyroid, insulin and lipid markers regularly",
    ],
  },
  {
    slug: "psoriasis",
    title: "Psoriasis",
    category: "skin",
    image: psoriasisImg,
    short:
      "A chronic immune-driven disease where skin cells multiply too quickly, forming scaly, inflamed patches.",
    overview: [
      "Psoriasis is a chronic, long-lasting disease in which the immune system becomes overactive, causing skin cells to multiply too quickly. Patches of skin become scaly and inflamed, most often on the scalp, elbows or knees, though other parts of the body can be affected. It involves a mix of genetics and environmental factors.",
      "Symptoms go through cycles, flaring for a few weeks or months and then subsiding or entering remission. Managing common triggers such as stress and skin injuries helps keep symptoms under control.",
      "Psoriasis carries a risk of other serious conditions, including psoriatic arthritis, cardiovascular events, and mental health problems such as low self-esteem, anxiety and depression.",
    ],
    types: [
      {
        name: "Plaque psoriasis",
        text: "The most common kind — raised, red patches covered by silvery-white scales, often on scalp, trunk, elbows and knees.",
      },
      {
        name: "Guttate psoriasis",
        text: "Small red dots on the torso or limbs, usually in children or young adults, often triggered by a throat infection.",
      },
      {
        name: "Pustular psoriasis",
        text: "Pus-filled bumps surrounded by red skin, usually affecting the hands and feet.",
      },
      {
        name: "Inverse psoriasis",
        text: "Smooth, red patches in skin folds such as beneath the breasts, groin or armpits; worsened by rubbing and sweating.",
      },
      {
        name: "Erythrodermic psoriasis",
        text: "A rare but severe form with red, scaly skin over most of the body; can be very serious.",
      },
    ],
    symptoms: [
      "Patches of thick, red skin with silvery-white scales that itch or burn",
      "Dry, cracked skin that itches or bleeds",
      "Thick, ridged, pitted nails",
      "Poor sleep quality",
      "Stiff, swollen or painful joints if psoriatic arthritis develops",
    ],
    whenToSee:
      "See a clinician promptly for joint pain and swelling with psoriasis, or for widespread redness and scaling with fever or chills.",
    prevention: [
      "Moisturise daily to protect the skin barrier",
      "Avoid skin injury, harsh scrubbing and sunburn",
      "Track flare triggers such as stress and infections",
      "Limit alcohol and smoking, both of which worsen flares",
    ],
  },
  {
    slug: "eczema",
    title: "Eczema (Atopic Dermatitis)",
    category: "skin",
    image: eczemaImg,
    short:
      "A chronic condition causing dry, itchy and inflamed skin, common in young children but possible at any age.",
    overview: [
      "Atopic dermatitis (eczema) is a condition that causes dry, itchy and inflamed skin. It is common in young children but can occur at any age. Atopic dermatitis is long lasting and tends to flare from time to time. It can be irritating but it is not contagious.",
      "People with atopic dermatitis are at risk of developing food allergies, hay fever and asthma. Moisturising regularly and following consistent skin care habits relieves itching and prevents new flares.",
    ],
    symptoms: [
      "Dry, cracked skin",
      "Itchiness (pruritus)",
      "Rash on swollen skin, varying in colour with skin tone",
      "Small raised bumps, especially on brown or Black skin",
      "Oozing and crusting",
      "Thickened skin and darkening around the eyes",
      "Raw, sensitive skin from scratching",
    ],
    whenToSee:
      "Book care for skin that becomes painful, weeping or crusted with yellow scabs, or if sleep is disturbed by itching.",
    prevention: [
      "Moisturise within minutes of bathing, twice daily",
      "Use lukewarm water and fragrance-free cleansers",
      "Wear soft cotton; avoid wool directly on skin",
      "Keep nails short to limit scratching damage",
    ],
  },
  {
    slug: "vitiligo",
    title: "Vitiligo",
    category: "skin",
    image: vitiligoImg,
    short:
      "A skin condition where the immune system destroys pigment cells, leaving lighter or white macules and patches.",
    overview: [
      "Vitiligo is a skin condition that causes your skin to lose its colour or pigment, so the skin appears lighter than your natural tone or turns white. Areas smaller than 1 centimetre are called macules; larger ones are called patches. If vitiligo appears on a hairy area, the hair may turn white or silver.",
      "The condition occurs when the body's immune system destroys melanocytes — the skin cells that produce melanin. Vitiligo affects all races and sexes equally and is more visible in people with darker skin tones. It occurs in over 1% of the population worldwide, and patches usually become apparent before age 30.",
      "Vitiligo usually starts with a few small white macules or patches that may gradually spread. It typically begins on the hands, forearms, feet and face, but can develop anywhere, including mucous membranes, eyes and inner ears.",
    ],
    causes: [
      "Autoimmune destruction of melanocytes",
      "Higher risk with Addison's disease, anemia, type 1 diabetes, lupus, psoriasis, rheumatoid arthritis and thyroid disease",
    ],
    symptoms: [
      "White or lighter macules and patches on the skin",
      "Patches beginning on hands, forearms, feet and face",
      "White or silver hair in affected areas",
      "Loss of colour in mucous membranes of mouth or nose",
      "Patches that widen and spread over time in some people",
    ],
    whenToSee:
      "Book a review when patches spread quickly, appear on the face, or occur with fatigue and weight change suggesting thyroid involvement.",
    prevention: [
      "Protect depigmented skin with high-factor sunscreen",
      "Screen for thyroid and autoimmune markers periodically",
      "Avoid skin trauma, harsh chemicals and bleaching agents",
      "Photograph patches monthly to track response objectively",
    ],
  },
  {
    slug: "ring-worm",
    title: "Ring Worm (Tinea Corporis)",
    category: "skin",
    image: ringWormImg,
    short:
      "An itchy, circular fungal rash with clearer skin in the middle — no worm is involved.",
    overview: [
      "Ringworm of the body (tinea corporis) is a rash caused by a fungal infection. It is usually an itchy, circular rash with clearer skin in the middle, and it gets its name from its appearance — no worm is involved.",
      "Ringworm often causes a ring-shaped rash that is itchy, scaly and slightly raised; the rings start small and expand outward. It is related to athlete's foot, jock itch and ringworm of the scalp, and spreads by direct skin-to-skin contact with an infected person or animal.",
      "Mild ringworm often responds to antifungal treatment applied to the skin. More severe infections may need several weeks of treatment.",
    ],
    symptoms: [
      "A scaly ring-shaped area, typically on the buttocks, trunk, arms and legs",
      "Itchiness",
      "A clear or scaly area inside the ring, sometimes with scattered bumps",
      "Slightly raised, expanding rings",
      "A round, flat patch of itchy skin, sometimes with overlapping rings",
    ],
    whenToSee:
      "Get reviewed if the rash spreads despite treatment, involves the scalp or nails, or keeps returning within the household.",
    prevention: [
      "Keep skin dry, especially skin folds after bathing",
      "Do not share towels, combs or clothing",
      "Wash bedding and clothing in hot water during treatment",
      "Treat all affected household members and pets together",
    ],
  },
  {
    slug: "chalazion",
    title: "Chalazion",
    category: "eye",
    image: chalazionImg,
    short:
      "A small swelling or lump on the eyelid caused by a blocked gland — one of the most common eyelid lumps.",
    overview: [
      "A chalazion is a small swelling or lump on your eyelid caused by a blocked gland. They are called chalazia if you have more than one, and they are among the most common types of eyelid lumps. Chalazia are most likely to happen on the upper eyelid, can appear on both eyes at once, and often go away and come back.",
      "A chalazion can be hard to tell apart from a stye. Styes happen along the edge of the eyelid, sometimes at the base of an eyelash, while chalazia are usually toward the middle of the lid. A stye is more likely to be painful and often has a yellowish central spot. A stye can become a chalazion if the infection clears but material remains stuck in the gland.",
    ],
    symptoms: [
      "A small area that is red, swollen, sore or painful when touched, becoming a firm lump after a few days",
      "Watery eyes",
      "Mild eye irritation",
      "Blurry vision",
    ],
    whenToSee:
      "See an eye clinician for a lump that affects vision, keeps recurring in the same spot, or comes with spreading redness of the eyelid.",
    prevention: [
      "Apply warm compresses for 5–10 minutes twice daily",
      "Clean lid margins gently to keep glands open",
      "Remove eye makeup fully before sleep",
      "Do not squeeze or pierce the lump",
    ],
  },
  {
    slug: "anxiety",
    title: "Anxiety Disorders",
    category: "mind",
    image: anxietyImg,
    short:
      "Intense, excessive and persistent worry and fear about everyday situations that interferes with daily life.",
    overview: [
      "Experiencing occasional anxiety is a normal part of life. However, people with anxiety disorders frequently have intense, excessive and persistent worry and fear about everyday situations. Anxiety disorders often involve repeated episodes of sudden intense anxiety, fear or terror that peak within minutes — panic attacks.",
      "These feelings interfere with daily activities, are difficult to control, are out of proportion to the actual danger and can last a long time. You may avoid places or situations to prevent them. Symptoms may start in childhood or the teen years and continue into adulthood.",
      "You can have more than one anxiety disorder, and sometimes anxiety results from a medical condition that needs treatment.",
    ],
    types: [
      { name: "Generalised anxiety disorder", text: "Persistent, excessive worry about ordinary activities that is hard to control." },
      { name: "Panic disorder", text: "Repeated sudden panic attacks with chest pain, breathlessness or palpitations." },
      { name: "Social anxiety disorder", text: "Fear and avoidance of social situations due to concern about being judged." },
      { name: "Agoraphobia", text: "Fear and avoidance of places or situations that might cause panic or feeling trapped." },
      { name: "Specific phobias", text: "Major anxiety on exposure to a specific object or situation, with a strong urge to avoid it." },
      { name: "Separation anxiety disorder", text: "Childhood anxiety, excessive for the child's developmental level, about separation from caregivers." },
    ],
    symptoms: [
      "Feeling nervous, restless or tense",
      "A sense of impending danger, panic or doom",
      "Increased heart rate and rapid breathing (hyperventilation)",
      "Sweating and trembling",
      "Feeling weak or tired",
      "Trouble concentrating or sleeping",
      "Gastrointestinal problems",
      "Difficulty controlling worry and urges to avoid triggers",
    ],
    whenToSee:
      "Reach out promptly if anxiety affects work, sleep or relationships, if panic attacks recur, or if you have thoughts of self-harm.",
    prevention: [
      "Keep consistent sleep and meal timings",
      "Reduce caffeine, nicotine and late-night screens",
      "Build a daily breathing or grounding practice",
      "Talk early — unhurried consultations catch patterns sooner",
    ],
  },
  {
    slug: "parkinson-disease",
    title: "Parkinson's Disease",
    category: "neuro",
    image: parkinsonImg,
    short:
      "A progressive neurological condition in which dopamine-producing nerve cells in the brain break down.",
    overview: [
      "In Parkinson's disease, nerve cells in the brain called neurons slowly break down or die. Many symptoms are caused by the loss of neurons that produce dopamine, a chemical messenger. Decreased dopamine leads to irregular brain activity, causing movement problems. People with Parkinson's disease also lose norepinephrine, which controls functions such as blood pressure.",
      "The cause is unknown, but several factors seem to play a role. Specific genetic changes are linked to the disease, though these are rare unless many family members are affected. Exposure to certain toxins or environmental factors — pesticides, well water, MPTP — may increase risk, but no environmental factor has been proved to be a cause.",
      "Many changes happen in the brains of people with Parkinson's disease, including the presence of Lewy bodies (clumps of protein) and alpha-synuclein found within them, which researchers believe holds an important clue to the cause.",
    ],
    symptoms: [
      "Tremor, often beginning in a hand or fingers at rest",
      "Slowed movement (bradykinesia)",
      "Muscle rigidity and stiffness",
      "Impaired posture and balance",
      "Loss of automatic movements such as blinking or arm swing",
      "Softer speech and smaller handwriting",
    ],
    whenToSee:
      "See a clinician for a new resting tremor, repeated falls, sudden worsening of movement, or difficulty swallowing.",
    prevention: [
      "Maintain regular aerobic exercise and balance training",
      "Keep home spaces clear to reduce fall risk",
      "Attend neurology reviews alongside supportive care",
      "Involve family in daily routine planning",
    ],
  },
];

export const getDisease = (slug: string) => diseases.find((d) => d.slug === slug);

/** Conditions treated at the clinic that are booked directly via consultation. */
export const additionalConditions: { group: string; items: string[] }[] = [
  {
    group: "Digestive",
    items: [
      "Fistula",
      "GERD (Gastroesophageal Reflux Disease)",
      "Colitis",
      "Chronic Constipation",
      "Pancreatitis",
    ],
  },
  {
    group: "Bones & Joints",
    items: [
      "Slip Disc",
      "Ganglion",
      "Backache",
      "Osteoarthritis",
      "Fibromyalgia",
      "Bone Weakness",
    ],
  },
  {
    group: "Eye Care",
    items: ["Trachoma", "Conjunctivitis", "Dry Eye", "Epiphora", "Glaucoma", "Watering of Eyes", "Redness in Eyes"],
  },
  {
    group: "Women's Health",
    items: [
      "Dysmenorrhea (Painful Menses)",
      "Endometriosis",
      "Fibroadenoma",
      "White Discharge (Leukorrhea)",
      "Premenstrual Syndrome",
      "Menopausal Syndrome",
      "Irregular Periods",
    ],
  },
  {
    group: "Men's Health",
    items: [
      "Erectile Dysfunction",
      "Gynecomastia",
      "Prostate Enlargement",
      "Premature Ejaculation",
      "Hydrocele",
      "Varicocele",
      "Nil / Low Sperm Count",
    ],
  },
  {
    group: "Urology",
    items: ["Kidney Stones", "Renal Infection", "Burning Urination", "Urinary Tract Infection (UTI)"],
  },
  {
    group: "Respiratory & General",
    items: [
      "COPD",
      "Bronchiectasis",
      "Pneumonia",
      "Allergic Rhinitis",
      "Nasal Bleeding",
      "Tonsillitis",
      "Frequent Colds",
      "Migraine",
      "Headache",
      "Obesity",
      "Mouth Ulcers",
      "Typhoid",
      "Diabetes",
      "High Blood Pressure",
      "Heart Disease",
    ],
  },
  {
    group: "Skin & Hair",
    items: [
      "Alopecia Areata",
      "Allergy",
      "Callosities (Corns)",
      "Dandruff",
      "Fungal Infection",
      "Granuloma Annulare",
      "Scalp Psoriasis",
      "Melasma",
      "Itching Skin",
      "Acne / Pimple",
      "Warts",
      "Pigmentation",
      "Moles",
      "Lipoma",
    ],
  },
];

export type CategoryMeta = {
  value: DiseaseCategory;
  label: string;
  icon: string;
  tagline: string;
  intro: string;
};

export const categoryMeta: CategoryMeta[] = [
  {
    value: "respiratory",
    label: "Respiratory",
    icon: "Wind",
    tagline: "Breath, airways and seasonal immunity",
    intro:
      "Asthma, recurrent colds and bronchial complaints respond well to constitutional homeopathy that strengthens seasonal immunity rather than only suppressing symptoms.",
  },
  {
    value: "digestive",
    label: "Digestive",
    icon: "Soup",
    tagline: "Gut, liver and lower digestive health",
    intro:
      "Piles, fissure, gas, IBS and gall stones are often driven by diet and stress patterns. Treatment addresses both the episode and the underlying tendency.",
  },
  {
    value: "joints",
    label: "Bones & Joints",
    icon: "Bone",
    tagline: "Mobility, pain and nerve compression",
    intro:
      "Arthritis, spondylitis, sciatica, gout and heel spur care combines remedy selection with posture, movement and load guidance so relief holds between consultations.",
  },
  {
    value: "skin",
    label: "Skin & Hair",
    icon: "Sparkles",
    tagline: "Skin barrier, flare cycles and hair health",
    intro:
      "Psoriasis, eczema, vitiligo, ringworm and hair fall need patience and a documented flare history. We track triggers month by month before adjusting remedies.",
  },
  {
    value: "womens",
    label: "Women's Health",
    icon: "Flower2",
    tagline: "Cycles, hormones and fertility support",
    intro:
      "PCOD, PCOS, cysts and fibroids are approached through cycle charting, metabolic markers and constitutional prescribing.",
  },
  {
    value: "urology",
    label: "Urology",
    icon: "Droplets",
    tagline: "Kidney, bladder and stone care",
    intro:
      "Renal stones and urinary complaints are managed with hydration protocols, imaging review and remedies matched to stone type and recurrence.",
  },
  {
    value: "chronic",
    label: "Chronic",
    icon: "Activity",
    tagline: "Long-term metabolic and lifestyle care",
    intro:
      "Fatty liver and metabolic complaints need steady, monitored care. We work alongside your existing medication with lifestyle mapping and follow-up reviews.",
  },
  {
    value: "mind",
    label: "Mind & Mood",
    icon: "Brain",
    tagline: "Anxiety, sleep and stress resilience",
    intro:
      "Anxiety and sleep disturbance are treated with unhurried consultations, confidential history taking and gentle constitutional remedies.",
  },
  {
    value: "eye",
    label: "Eye Care",
    icon: "Eye",
    tagline: "Eyelid, tear film and surface comfort",
    intro:
      "Chalazion, styes and recurring eye irritation are managed with lid hygiene, warm compress protocols and remedies matched to the recurrence pattern.",
  },
  {
    value: "neuro",
    label: "Neurological",
    icon: "Waves",
    tagline: "Movement, tremor and nerve health",
    intro:
      "Parkinson's disease and related neurological complaints are supported alongside neurology care, with attention to mobility, sleep and daily function.",
  },
];

export const getCategoryMeta = (value: string) =>
  categoryMeta.find((c) => c.value === value);

export const diseasesByCategory = (value: DiseaseCategory) =>
  diseases.filter((d) => d.category === value);
