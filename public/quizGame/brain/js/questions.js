// Quiz Creator;
function CQuiz(que, o1, o2, o3, o4, o5, src, ans, d) {
  this.question = que;
  this.opt1 = o1;
  this.opt2 = o2;
  this.opt3 = o3;
  this.opt4 = o4;
  this.opt5 = o5;
  this.src = src;
  this.answer = ans;
  this.asked = d;
  this.timer = 60;
}
// var q1 = new CQuiz(
//   "Chest imaging modality considered in suspected covid patients",
//   "A) Chest radiography",
//   "B) Computed tomography",
//   "C) Ultrasound",
//   "D) All of the above",
//   "",
//   "image/q1.png",
//   3
// );

// Question 1
var q1 = new CQuiz(
  "<ul><li>A 9-year-old girl with high grade fever of 6 weeks duration, diagnosed as brucellosis, responding to therapy. </li><li>Suddenly, she started to deteriorate with high grade fever and pancytopenia. </li><li>Besides some specific blood investigations, bone marrow aspiration was performed as shown in the picture.</li></ul> What is your diagnosis?",
  "A) Acute Lymphoblastic Leukemia",
  "B) Hemophagocytic Lymphohistiocystosis",
  "C) Langerhans Cell Histiocytosis",
  "D) Hypoplastic Bone Marrow",
  "",
  "image/q1.png",
  2
);

// Question 2
var q2 = new CQuiz(
  "<ul><li>Four and half year-old-boy with weight 10.2 kg and height 82 cm.</li> <li>S. Calcium 5.8 mg/dl, S. Phosphorus  7.1 mg/dl, S. Alkaline phosphatase 4760 units and raised S. Parathormone </li> <li>One sibling has same condition.</li></ul>What could be the possibility?",
  "A) Renal Rickets",
  "B) Vitamin D Dependent Rickets Type I",
  "C) Vitamin D Dependent Rickets Type II",
  "D) Lowe Syndrome",
  "",
  "image/q2.png",
  3
);

// Question 3
var q3 = new CQuiz(
  "<ul><li>A 5-year-old child brought with c/o cough, chest pain and hemoptysis. He had no fever.</li><li>The CT thorax confirmed the diagnosis.</li></ul>What is the causative agent?",
  "A) Echinococcus granulosus",
  "B) Toxoplasma gondii",
  "C) Paragonimus westermani (Lung fluke)",
  "D) Taenia solium (Cysticercosis)",
  "",
  "image/q3.png",
  1
);

// Question 4
var q4 = new CQuiz(
  "<ul><li>A 2-month-old child presented with marked respiratory distress since birth. Chest X-ray was performed.</li><li>CT thorax confirmed the diagnosis.</li></ul>What is the correct diagnosis?",
  "A) Congenital pulmonary airway malformation on left side",
  "B) Left side pneumothorax",
  "C) Left side congenital diaphragmatic hernia",
  "D) Left upper lobe congenital lobar emphysema",
  "",
  "image/q4.png",
  4
);

// Question 5
var q5 = new CQuiz(
  "<ul><li>A 45-day-old male child presented with severe anemia, thrombocytopenia, hypocalcemia, hepatosplenomegaly and severe sepsis.</li></ul>What is your diagnosis?",
  "A) Osteopetrosis",
  "B) Congenital Leukemia",
  "C) Diamond - Blackfan Syndrome",
  "D) DiGeorge Syndrome",
  "",
  "image/q5.png",
  1
);

// Question 6
var q6 = new CQuiz(
  "<ul><li>This neonate has undescended tests and urinary tract abnormality.</li></ul> What associated complication is an important factor for survival of the baby?",
  "A) Posterior urethral valve",
  "B) Cardiac malformation",
  "C) Pulmonary hypoplasia",
  "D) Megalourethra",
  "",
  "image/q6.png",
  3
);

// Question 7
var q7 = new CQuiz(
  "<ul><li>A 10-month-old boy having blister formation following mechanical trauma or irritation, on and off since birth. </li></ul>According to you, what will be the diagnosis? ",
  "A) Herpes Simplex",
  "B) Epidermolysis Bullosa Simplex",
  "C) Impetigo",
  "D) Staphylococcal Scalded Skin Syndrome",
  "",
  "image/q7.png",
  2
);
// Question 8
var q8 = new CQuiz(
  "<ul><li>Incidentally, chest X–ray showed this picture in a 2-year-old-child who was asymptomatic.</li></ul>What is the diagnosis?",
  "A) Left side absence of diaphragm",
  "B) Left side congenital diaphragmatic hernia",
  "C) Congenital eventration of left dome of diaphragm",
  "D) Pushed up left dome of diaphragm",
  "",
  "image/q8.png",
  3
);
// Question 9
var q9 = new CQuiz(
  "<ul><li>All the three children from one family presented with diarrhea and this clinical picture.</li><li>It was associated with some staple diet; they responded well to therapy.</li></ul>What is the name of this condition?",
  "A) Pellagra",
  "B) Hartnup’s Disease",
  "C) Megaloblastic Anemia",
  "D) Addison Disease",
  "",
  "image/q9.png",
  1
);

// Question 10
var q10 = new CQuiz(
  "<ul><li>On routine auscultation of posterior chest of this 5-year-old child, air entry was found diminished on right side.</li><li>Barium study as showed this picture.</li></ul>According to you, what is the name of the condition?",
  "A) Bochdalek type of congenital diaphragmatic hernia",
  "B) Morgagni type of congenital diaphragmatic hernia",
  "C) Hiatus hernia",
  "D) Malrotation of intestine",
  "",
  "image/q10.png",
  2
);

// Question 11
var q11 = new CQuiz(
  "<ul><li>A 2-year-old child presented with scabies, FTT and generalized lymphadenopathy.</li><li>Test for some systemic infection confirmed the diagnosis.</li></ul>What is your opinion about this disease?",
  "A) HIV",
  "B) Norwegian  scabies",
  "C) Kala azar",
  "D) Syphilis",
  "",
  "image/q11.png",
  1
);

// Question 12
var q12 = new CQuiz(
  "<ul><li>A 7-year-old male child presented with short stature, massive lymphedema, webbing of neck and<br/>congenital heart disease.</li></ul>What is the name of the condition?",
  "A) Turner Syndrome",
  "B) Klinefelter Syndrome",
  "C) Fragile X Syndrome",
  "D) Noonan Syndrome",
  "",
  "image/q12.png",
  4
);

// Question 13
var q13 = new CQuiz(
  "<ul><li>A 3-year-old girl was referred for precocious puberty and obesity. She also had gelastic seizures.</li></ul>What is your diagnosis ?",
  "A) Hypothalamic Hamartoma",
  "B) Hypothyroidism",
  "C) McCune – Albright Syndrome",
  "D) Congenital Adrenal Hyperplasia",
  "",
  "",
  1
);

// Question 14
var q14 = new CQuiz(
  "<ul><li>An 8-year-old boy presented with difficulty in chewing and swallowing.</li><li>He had injury and abrasions over lower limbs.</li><li>He was not vaccinated.</li><li>He developed spasms on disturbances by sound, touch or light.</li></ul>What is the name of this condition?",
  "A) Rabies",
  "B) Tetanus",
  "C) Syphilis",
  "D) Diphtheria",
  "",
  "image/q14.png",
  2
);

// Question 15
var q15 = new CQuiz(
  "<ul><li>An 8-year-old child was brought with illness of 18 months.</li> <li>He had c/o headache, vomiting and difficulty in vision, and no fever.</li><li>He was short.</li><li>Eye examination showed papilloedema.</li><li>CT scan of brain confirmed diagnosis.</li></ul>What is your opinion?",
  "A) Craniopharyngioma",
  "B) Medulloblastoma",
  "C) Astrocytoma",
  "D) Ependymoma",
  "",
  "image/q15.png",
  1
);
// Question 10
// var q10 = new CQuiz(
// 	'Are you happy with your last decision ?',
// 	'Yes',
// 	'No',

// 	1,
// 	0
// );

// total question...
var totQ = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15];
