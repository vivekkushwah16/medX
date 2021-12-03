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
  "GERD is the back up of stomach acid into the esophagus.",
  "A) True",
  "B) False",
  "",
  "",
  "",
  "",
  1
);

// Question 2
var q2 = new CQuiz(
  "Babies and children do not develop GERD",
  "A) True",
  "B) False",
  "",
  "",
  "",
  "",
  2
);

// Question 3
var q3 = new CQuiz(
  "People with GERD should avoid foods and beverages such as..",
  "A) Mint. Tomato, mustard",
  "B) Caffeine, Alcoholic drink and pepper",
  "C) Orange, grapefruit and Vinegar",
  "D) All of above",
  "",
  "",
  4
);

// Question 4
var q4 = new CQuiz(
  "Reflux is an alternative term for _____________.",
  "A) Vomit",
  "B) Acid Erosion",
  "C) Regurgitation",
  "D) Salivating",
  "",
  "",
  3
);

// Question 5
var q5 = new CQuiz(
  "What is the cure for GERD?",
  "A) Lifestyle changes",
  "B) Dietary Changes",
  "C) Weight loss",
  "D) There is no Cure",
  "",
  "",
  4
);

// Question 6
var q6 = new CQuiz(
  "GERD is diagnosed by blood tests.",
  "A) True",
  "B) False",
  "",
  "",
  "",
  "",
  2
);

// Question 7
var q7 = new CQuiz(
  "Barrett's esophagus is a potentially serious complication of GERD.",
  "A) True",
  "B) False",
  "",
  "",
  "",
  "",
  1
);
// Question 8
var q8 = new CQuiz(
  "Who is most likely to suffer from GERD?",
  "A) A pregnant woman",
  "B) Obese person",
  "C) Cigarette/Cigar smoker",
  "D) Any of above",
  "",
  "",
  4
);
// Question 9
var q9 = new CQuiz(
  "Is it possible to prevent GERD?",
  "A) Yes",
  "B) No",
  "",
  "",
  "",
  "",
  1
);

// total question...
var totQ = [q1, q2, q3, q4, q5, q6, q7, q8, q9];
