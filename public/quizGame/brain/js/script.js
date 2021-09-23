var usernameForm = document.getElementById("firstpage");
var theQuiz = document.getElementById("theQuiz");
var i;

function startQuiz() {
  firstpage.style.display = "none";
  theQuiz.style.display = "block"; // show the quiz page
  Shuffle();
}

/*-----------------------------------*\
$ The Quiz Begins...
\*-----------------------------------*/
var queDone = 0; // question asked...
var userAns = []; // user's answers
var totalQuizTime = 0;
var timeAns = [];
var queDoneArr = []; // storing which question is asked

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 30;
const ALERT_THRESHOLD = 10;

const NO_OF_QUESTIONS = 15;

const COLOR_CODES = {
  info: {
    color: "green",
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD,
  },
};

const TIME_LIMIT = 60;
var timePassed = 0;
var timeLeft = TIME_LIMIT;
var timerInterval = null;
var remainingPathColor = COLOR_CODES.info.color;

function onTimesUp() {
  clearInterval(timerInterval);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML =
      formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
      //   console.log('i am here at uncheck');
      //   totalQuizTime+=timePassed;
      //   console.log(totalQuizTime);
      var radio_buttons = document.getElementsByClassName(
        "custom-control-input"
      );
      for (var i = 0; i < radio_buttons.length; i++) {
        radio_buttons[i].checked = false;
        radio_buttons[i].disabled = true;
      }
      nextBtn.removeAttribute("disabled");
      //   console.log(document.getElementsByClassName('custom-control-input'));
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

// showing steps (dots)...
steps(NO_OF_QUESTIONS); // craetes " <span class="step"></span> ";
function steps(quizLength) {
  var mainStepDiv = document.getElementById("steps");
  for (var i = 0; i < quizLength; i++) {
    var span = document.createElement("span");
    span.className = "step";
    mainStepDiv.appendChild(span);
  }
}

var p = document.getElementById("que"); // the question paragraph
var O1 = document.getElementById("opt1"); // option 01
var O2 = document.getElementById("opt2"); // option 02
var O3 = document.getElementById("opt3"); // option 03
var O4 = document.getElementById("opt4"); // option 04
var O5 = document.getElementById("opt5"); // option 04

var radiot1 = document.getElementById("radio1"); // the question paragraph
var radiot2 = document.getElementById("radio2"); // option 01
var radiot3 = document.getElementById("radio3"); // option 02
var radiot4 = document.getElementById("radio4"); // option 03
var radiot5 = document.getElementById("radio5"); // option 03

var question_image = document.getElementById("question_image"); // option 03

// generates and places random questions...
var currentquest = 0;
function randomQ() {
  var thisAsked = false;
  //	var x = Math.floor(Math.random() * totQ.length); // get a random number b/w 0 to total questions

  if (totQ[currentquest].opt3 === null || totQ[currentquest].opt3 === "") {
    radiot3.setAttribute("style", "display:none");
    radiot4.setAttribute("style", "display:none");
    radiot5.setAttribute("style", "display:none");
  } else {
    radiot3.setAttribute("style", "display:block");
    radiot4.setAttribute("style", "display:block");
    // console.log(totQ[currentquest].opt5);
    if (totQ[currentquest].opt5 === null || totQ[currentquest].opt5 === "") {
      radiot5.setAttribute("style", "display:none");
    } else {
      radiot5.setAttribute("style", "display:block");
    }
  }

  if (totQ[currentquest].src === null || totQ[currentquest].src === "") {
    question_image.setAttribute("style", "display:none");
  } else {
    question_image.setAttribute("style", "display:block");
    question_image.setAttribute("src", totQ[currentquest].src);
  }

  //	while ((totQ[currentquest].asked === 0) == true) {
  // console.log(currentquest);
  // if this question is not asked
  thisAsked = true; // this will be true
  totQ[currentquest].asked = 1; // mark this as asked
  queDoneArr.unshift(currentquest); // put in asked quesion array
  //console.log('QuesDone',queDoneArr);
  queDone = ++queDone; // increase the counter
  p.innerHTML = totQ[currentquest].question; // write question
  O1.nextElementSibling.innerHTML = totQ[currentquest].opt1; // write option 1
  O2.nextElementSibling.innerHTML = totQ[currentquest].opt2; // write option 2
  O3.nextElementSibling.innerHTML = totQ[currentquest].opt3; // write option 3
  O4.nextElementSibling.innerHTML = totQ[currentquest].opt4; // write option 4
  O5.nextElementSibling.innerHTML = totQ[currentquest].opt5; // write option 4
  ++currentquest;
  //}
  // if (!thisAsked) {
  // 	// if random number is already asked and this didn't become true go inside and fire random question again
  // 	if (queDone != totQ.length)
  // 		// if not reached total length
  // 		randomQ(); // re-through random question
  // }

  timePassed = 0;
  timeLeft = TIME_LIMIT;
  timerInterval = null;
  remainingPathColor = COLOR_CODES.info.color;

  document.getElementById("app").innerHTML = `
	<div class="base-timer">
	<svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
		<g class="base-timer__circle">
		<circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
		<path
			id="base-timer-path-remaining"
			stroke-dasharray="283"
			class="base-timer__path-remaining ${remainingPathColor}"
			d="
			M 50, 50
			m -45, 0
			a 45,45 0 1,0 90,0
			a 45,45 0 1,0 -90,0
			"
		></path>
		</g>
	</svg>
	<span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
	</div>
	`;

  startTimer();
}

function next() {
  // user clicks NEXT...

  //set timer to init
  onTimesUp();

  totalQuizTime += timePassed;
  timeAns.unshift(timePassed);
  // console.log('time: '+totalQuizTime);
  // console.log(timeAns);

  if (!validateForm()) return false; // exit if no option in the current tab is selected
  topping(queDone); // setting up btn and steps counter...
  if (queDone == NO_OF_QUESTIONS) {
    // if reached the end of the questions
    theQuiz.style.display = "none";
    document.getElementById("theResult").style.display = "flex";
    calcResult(); // calculates result
    // alert('Good Job! Calculating Result');
    return false;
  }
  randomQ(); // otherwise, fires next question...
}

var chkBox = document.getElementsByClassName("custom-control-input"); // targetting all checkboxes...

// deals with validation of radio options and adds to the user's answer Array...
function validateForm() {
  var valid = false;
  for (var i = 0; i < chkBox.length; i++) {
    // checks every radio btn
    if (chkBox[i].checked) {
      // if found checked
      valid = true;
      userAns.unshift(chkBox[i].value); // store user's answer
      // console.log('userAns:',userAns);
      chkBox[i].checked = false;
      nextBtn.setAttribute("disabled", "disabled"); // disbale button for next question
      break;
    }
  }
  if (!valid) {
    // if no option selected
    // alert('Please Select Any Option...');
    nextBtn.setAttribute("disabled", "disabled");
    userAns.unshift(-1);
    valid = true;
  }
  var radio_buttons = document.getElementsByClassName("custom-control-input");
  for (var i = 0; i < radio_buttons.length; i++) {
    radio_buttons[i].disabled = false;
  }
  if (valid)
    // if the valid status is true, mark the step as finished
    document.getElementsByClassName("step")[queDone - 1].className += " finish";
  return valid; // return the valid status
}

// enable btn if radio btn is checked
var nextBtn = document.getElementById("next-button");
function enableBtn(i) {
  if (i.checked) nextBtn.removeAttribute("disabled");
  else nextBtn.setAttribute("disabled", "disabled");
}

function topping(n) {
  // dynamic next button's text
  if (n == NO_OF_QUESTIONS - 1)
    document.getElementById("next-button").innerHTML = "Submit";
  else if (n == NO_OF_QUESTIONS) {
    document.getElementById("next-button").innerHTML = "No Questions";
    nextBtn.setAttribute("disabled", "disabled");
  } else document.getElementById("next-button").innerHTML = "Next";
  fixStepIndicator(n); // it will display the correct step indicator
}

function fixStepIndicator(n) {
  // removes the "active" class of all steps...
  var i,
    x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  x[n - 1].className += " active"; // and adds the "active" class on the current step
}

function calcResult() {
  // calculates result
  var ca = 0; // correct answer - currently ZerO..
  for (var i = 0; i < NO_OF_QUESTIONS; i++) {
    // loop till total num of questions
    var a = queDoneArr[i]; // getting done questions from array
    if (userAns[i] == totQ[a].answer) {
      // if user's answer matches with array's question's answer
      ca = ca + TIME_LIMIT - timeAns[i]; // increase correct answers' counter
      // console.log("ca: "+ca+" i: "+i);
    }
  }
  var percentage = (ca / NO_OF_QUESTIONS) * 100; // calculates %
  // alert('Correct Answers: ' + ca + '\n' + 'Your Percentage is: ' + percentage);
  showResult(percentage, ca);
}

/*-----------------------------------*\
$ The Result Part...
\*-----------------------------------*/
var resultCircle = document.getElementById("resultCircle");
var resultFb = document.getElementById("resultFb");
var correctAns = document.getElementById("correctAns");
var quizCompleted = false;
var RColor;
function showResult(percentage, ca) {
  /*	if (percentage == 100) {
		RColor = 'teal';
		// resultFb.innerHTML = 'Wohoo.. Great, You Fantastic!';
		correctAns.innerHTML = 'Correct Answers: ' + ca;
	} else if (percentage >= 80) {
		RColor = 'green';
		// resultFb.innerHTML = 'Congrats! You are doing good.';
		correctAns.innerHTML = 'Correct Answers: ' + ca;
	} else if (percentage >= 65) {
		RColor = 'blue';
		// resultFb.innerHTML = 'Let have some fun activity';
		correctAns.innerHTML = 'Correct Answers: ' + ca;
	} else if (percentage >= 50) {
		RColor = 'orange';
		// resultFb.innerHTML = 'Lets have some fu activity';
		correctAns.innerHTML = 'Correct Answers: ' + ca;
	} else {
		RColor = 'red';
		// resultFb.innerHTML = 'Oh! You are unwell';
		correctAns.innerHTML = 'Correct Answers: ' + ca;
	}*/

  correctAns.innerHTML = "Your score " + ca;
  localStorage.setItem("percentage", percentage);
  localStorage.setItem("ca", ca);
  UpdateScrore(ca, totalQuizTime);
  quizCompleted = true;

  // var path =
  // 	'<svg viewbox="0 0 36 36" class="circular-chart ' +
  // 	RColor +
  // 	'"> \
  // <path class="circle-bg" \
  // d="M18 2.0845 \
  // a 15.9155 15.9155 0 0 1 0 31.831 \
  // a 15.9155 15.9155 0 0 1 0 -31.831" \
  // /> \
  // <path class="circle" \
  // stroke-dasharray="' +
  // 	percentage +
  // 	', 100" \
  // d="M18 2.0845 \
  // a 15.9155 15.9155 0 0 1 0 31.831 \
  // a 15.9155 15.9155 0 0 1 0 -31.831" \
  // /> \
  // <text x="19" y="21" id="percentage">' +
  // 	percentage +
  // 	'%</text> \
  // </svg>';
  // resultCircle.innerHTML = path;
}

function logout() {
  // when logout button triggered
  localStorage.clear(); // clear all local storage
  location.reload(true); // hard reload the page
}

function retakeQuiz() {
  localStorage.removeItem("percentage");
  localStorage.removeItem("ca");
  location.reload(true); // hard reload the page
}
let finalarr;
function Shuffle() {
  finalarr = totQ
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
  totQ = finalarr;
  //    console.log("tty");
  randomQ();
}

$(document).ready(function () {
  $("#close_btn").on("click", function () {
    // console.log("leaderboard clicked");
    $("#leaderboard").css({
      display: "none",
    });
    document.getElementById("quizContainer").style.display = "block";
    $("#theResult").css({
      display: "flex",
    });
  });
});

function retakeQuiz() {
  localStorage.removeItem("percentage");
  localStorage.removeItem("ca");
  location.reload(true); // hard reload the page
}
