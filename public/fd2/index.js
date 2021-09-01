var emojis = ["😠", "😦", "🙂", "😀", "😍"];
var reviews3 = ["Extremely", "Very", "Somewhat", "Not so", "Not at all"];
var reviews4 = [
  "Much too long",
  "Too long",
  "About right",
  "Too short",
  "Much much short",
];
var reviews6 = [
  "Topics",
  "Keynotes and panel discussion",
  "Phygital experience",
  "Speaker profiles",
  "Attendee profiles",
  "Conference setup",
  "others",
];
// var reviews = ["Very Bad", "Bad", "Average", "Good", "Very Good"];
let response3 = 0;
let response4 = 0;
let response6 = 0;
let eventId = null;
let eventTitle = null;
// $(".emoji1").html("hello");
// $(".emojislider1").mousemove(function () {
//   var i = $(this).val();
//   // $(".emoji1").html(emojis[i]);
//   document.getElementsByClassName("emoji1")[0].innerHTML = emojis[i];
//   console.log(emojis[i]);
//   response1 = i;
// });
// document
//   .getElementsByClassName("emojislider1")[0]
//   .addEventListener("click", () => {
//     console.log("hello");
//   });

// document
// .getElementsByClassName("emojislider6")[0]
// .addEventListener("input", () => {
//   document.getElementsByClassName("review6")[0].innerHTML =
//     reviews6[document.getElementsByClassName("emojislider6")[0].value];
//   var i = document.getElementsByClassName("emojislider6")[0].value;
//   document.getElementsByClassName("emoji6")[0].innerHTML = emojis[i];
//   response6 = i;
// });
// $(".emojislider2").mousemove(function () {
//   var i = $(this).val();
//   $(".emoji2").html(emojis[i]);
//   response2 = i;
// });

// open pdf function

// Get the <span> element that closes the modal
var omyFrame = document.getElementById("myFrame");
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

function openPdf() {
  modal.style.display = "block";
  omyFrame.src = "/web/viewer.html?file=%2Fassets%2Fpdf%2FConsent.pdf";
}
function openPdf1() {
  modal.style.display = "block";
  omyFrame.src = "/web/viewer.html?file=%2Fassets%2Fpdf%2FSurvey.pdf";
}

$(document).ready(function () {
  const auth = firebase.auth();
  var db = firebase.firestore();
  let currentUser = null;
  let your_id = "";
  let your_name = "";
  let your_email = "";
  let feedbackExists = false;

  const urlQuery = new URLSearchParams(window.location.href);
  eventId = urlQuery.get("event");
  eventTitle = urlQuery.get("title");

  auth.onAuthStateChanged(function (user) {
    if (user) {
      currentUser = user;
      your_name = user.displayName;
      your_email = user.email;
      your_id = user.uid;
      // console.log(your_email);
      firebase
        .firestore()
        .collection("userFeedback")
        // .doc(currentUser.uid)
        .doc(`${eventId}_${currentUser.uid}`)
        .get()
        .then((doc) => {
          // document.getElementById("q3-title").innerHTML =
          //   document.getElementById("q3-title").innerHTML +
          //   " " +
          //   eventTitle +
          //   "?";
          // document.getElementById("q5-title").innerHTML =
          //   document.getElementById("q5-title").innerHTML +
          //   " " +
          //   eventTitle.split(`'`)[0].toUpperCase() +
          //   " program ?";
          // console.log(eventId, eventTitle);
          // if (eventId === null) {
          //   return;
          // }
          // document.querySelector("#mainForm").style.display = "block";
          // document.querySelector("#loader").style.display = "none";
          // document.querySelector("#finalMessage").style.display = "none";
          feedbackExists = doc.exists;

          if (feedbackExists) {
            document.querySelector("#finalMessage").innerHTML =
              "Your feedback already recevied";
            successfulFeedback();
            return;
            // document.querySelector('#mainForm').style.display = 'none';
            // document.querySelector('#loader').style.display = 'none';
            // document.querySelector('#finalMessage').style.display = 'block';
          } else {
            document.querySelector("#mainForm").style.display = "block";
            document.querySelector("#loader").style.display = "none";
            document.querySelector("#finalMessage").style.display = "none";
          }
        });
      // getDataIfExist();
    } else {
      // console.log("Nobody is Signed In");
      //window.location.href = "/login/index.html";
    }
  });

  //   document.querySelector("#retake").addEventListener("click", function (event) {
  //     window.location.href = "/certificate/index.html";
  //     // document.querySelector('#mainForm').style.display = 'block';
  //     // document.querySelector('#loader').style.display = 'none';
  //     // document.querySelector('#finalMessage').style.display = 'none';
  //     // feedbackExists = true;
  //     // window.location.reload(true);
  //   });

  // document.querySelector("#questions3-4").addEventListener('change', function (event) {
  //     if (event.target.checked)
  //         $('#questions3-4-input').fadeIn();
  //     else
  //         $('#questions3-4-input').fadeOut();

  // });

  function LimitMultipleAnswers(className, limit) {
    let q5Array = document.querySelectorAll(`.${className}`);
    // console.log(q5Array);
    q5Array.forEach((q5Option) => {
      q5Option.addEventListener("change", function (event) {
        count = 0;
        q5Array.forEach((element) => {
          if (element.checked) {
            count++;
          }
        });
        // console.log(count);
        if (count > limit) {
          q5Option.checked = false;
        }
      });
    });
  }
  // LimitMultipleAnswers('questions5_1', 2);
  // LimitMultipleAnswers('q7', 2);

  const showError = (
    value,
    message = "Please fill all the required fileds"
  ) => {
    if (value) {
      $("#error").fadeIn();
      document.querySelector("#error").innerHTML = message;
    } else {
      $("#error").fadeOut();
    }
  };

  // document.getElementById("questions6-5").addEventListener("input", () => {
  //   if (document.getElementById("questions6-5").checked) {
  //     document.getElementById("session6_com").classList.add("d-block");
  //     document.getElementById("session6_com").classList.remove("d-none");
  //   } else {
  //     document.getElementById("session6_com").classList.remove("d-block");
  //     document.getElementById("session6_com").classList.add("d-none");
  //     document.getElementById("session6_com").value = "";
  //   }
  // });
  const successfulFeedback = () => {
    // $('#mainForm').fadeIn();
    document.querySelector("#mainForm").style.display = "none";
    document.querySelector("#loader").style.display = "none";
    document.querySelector("#finalMessage").style.display = "block";
  };
  const failedFeedback = (err) => {
    document.querySelector("#mainForm").style.display = "block";
    document.querySelector("#loader").style.display = "none";
    document.querySelector("#finalMessage").style.display = "none";
    showError(true, err.code);
  };

  // var checkboxes13 = $(".questions10:checkbox:checked").length;

  // var checkbox13 = document.getElementsByClassName("questions13");

  // checkbox13.addEventListener("change", function () {
  // var checkboxes13 = $(".questions10:checkbox:checked").length;
  // console.log(checkboxes13);
  // if (this.checked) {
  //   console.log(this.checked);
  //   console.log("Checkbox is checked..", this.checked.length);
  // } else {
  //   console.log("Checkbox is not checked..", this.length);
  // }
  // });

  // check for disclaimer
  var checkbox = document.querySelector("#disclaimer");

  checkbox.addEventListener("change", function () {
    if (this.checked) {
      document.querySelector("#submitwhatNext").disabled = false;
      // console.log("Checkbox is checked..");
    } else {
      document.querySelector("#submitwhatNext").disabled = true;
      // console.log("Checkbox is not checked..");
    }
  });

  $("#mainForm").on("submit", async function (event) {
    // console.log(event);
    event.preventDefault();

    var errorText = document.querySelector("#error");
    errorText.style.display = "none";
    errorText.innerHTML = "";

    var checkboxes10 = $(".questions10:checkbox:checked").length;
    var checkboxes13 = $(".questions13:checkbox:checked").length;

    if (checkboxes10 < 1) {
      errorText.style.display = "block";
      errorText.innerHTML =
        "Please select at least one option in question nnumber 10";
      return;
    }
    if (checkboxes13 > 2) {
      errorText.style.display = "block";
      errorText.innerHTML = "Maximum 2 option allowed in question number 13";
      return;
    }

    const survey1 = {};
    let formData = new FormData(document.querySelector("form"));
    for (var pair of formData.entries()) {
      // console.log(pair[0] + ': ' + pair[1]);
      if (!survey1[`${pair[0]}`]) {
        survey1[`${pair[0]}`] = pair[1];
      } else {
        survey1[`${pair[0]}`] += `| ${pair[1]}`;
        // if (typeof (survey[`${pair[0]}`]) === 'object') {
        //     survey[`${pair[0]}`].push(pair[1])
        // } else {
        //     survey[`${pair[0]}`] = [survey[`${pair[0]}`]]
        //     survey[`${pair[0]}`].push(pair[1])
        // }
      }
    }

    // console.log(survey1);

    showError(false);
    // const survey = {
    //   question1: document.querySelector("#session").value,
    //   question2: document.querySelector("#session2").value,
    //   question3: parseInt(document.querySelector(".emojislider3").value) + 1,
    //   question1: parseInt(document.querySelector(".emojislider4").value) + 1,
    //   question5: document.querySelector("#session5").value,
    //   question6: parseInt(document.querySelector(".emojislider6").value) + 1,
    //   question7: parseInt(document.querySelector(".emojislider7").value) + 1,
    //   question8: parseInt(document.querySelector(".emojislider8").value) + 1,
    //   question9: parseInt(document.querySelector(".emojislider9").value) + 1,
    //   question10: parseInt(document.querySelector(".emojislider10").value) + 1,
    //   question11: parseInt(document.querySelector(".emojislider11").value) + 1,
    //   question8: document.querySelector("#session8").value,
    //   question9: document.querySelector("#session9").value,
    // };
    // console.log(currentUser.displayName);
    ///
    // if (!survey.questions4_recommend) {
    //   showError(true, "Please answer the 3rd question also.");
    //   return;
    // }
    // console.log(survey1);
    firebase
      .firestore()
      .collection("userFeedback")
      // .doc(currentUser.uid)
      .doc(`${eventId}_${currentUser.uid}`)
      .set({
        ...survey1,
        name: currentUser.displayName,
        email: currentUser.email,
        eventId: eventId,
        eventTitle: eventTitle,
      })
      .then(() => {
        successfulFeedback();
      })
      .catch((err) => {
        // console.log(err);
        failedFeedback(err);
      });

    // if (currentUser) {
    //   document.querySelector("#mainForm").style.display = "none";
    //   $("#loader").fadeOut();
    //   let name = survey.question1
    //     .toLowerCase()
    //     .replace(/[&\/\\#,+$~%.'":*?<>{}]/g, "");
    //   // if (feedbackExists)
    //   {
    //     console.log(your_id);
    //     console.log(survey);

    //   }
    //   //  else {
    //   //     firebase.firestore().collection('userLogged').doc(your_id).set({
    //   //         [name]: survey,
    //   //     }).then(() => {
    //   //         successfulFeedback()
    //   //     }).catch(err => {
    //   //         failedFeedback(err)
    //   //     });
    //   // }
    // }
  });

  // function getDataIfExist() {
  //     firebase.firestore().collection('userData_Nxt').doc(your_id).onSnapshot(function (doc) {
  //         if (doc.exists) {
  //             if (doc.data().survey) {
  //                 console.log(doc.data().survey);

  //             }
  //         }
  //     }, (err) => {
  //         console.log(err)
  //     });

  // }
});
