var emojis = ["😠", "😦", "🙂", "😀", "😍"];
var reviews = ["Very Bad", "Bad", "Average", "Good", "Very Good"];
let response1 = 0;
let response2 = 0;
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
document
  .getElementsByClassName("emojislider1")[0]
  .addEventListener("input", () => {
    document.getElementsByClassName("review")[0].innerHTML =
      reviews[document.getElementsByClassName("emojislider1")[0].value];
    var i = document.getElementsByClassName("emojislider1")[0].value;
    document.getElementsByClassName("emoji1")[0].innerHTML = emojis[i];
    response1 = i;
  });
document
  .getElementsByClassName("emojislider2")[0]
  .addEventListener("input", () => {
    document.getElementsByClassName("review2")[0].innerHTML =
      reviews[document.getElementsByClassName("emojislider2")[0].value];
    var i = document.getElementsByClassName("emojislider2")[0].value;
    document.getElementsByClassName("emoji2")[0].innerHTML = emojis[i];
    response2 = i;
  });
// $(".emojislider2").mousemove(function () {
//   var i = $(this).val();
//   $(".emoji2").html(emojis[i]);
//   response2 = i;
// });

$(document).ready(function () {
  const auth = firebase.auth();
  var db = firebase.firestore();
  let currentUser = null;
  let your_id = "";
  let your_name = "";
  let your_email = "";
  let feedbackExists = false;

  auth.onAuthStateChanged(function (user) {
    if (user) {
      currentUser = user;
      your_name = user.displayName;
      your_email = user.email;
      your_id = user.uid;
      console.log(your_email);
      firebase
        .firestore()
        .collection("userLogged")
        .doc(your_id)
        .get()
        .then((doc) => {
          document.querySelector("#mainForm").style.display = "block";
          document.querySelector("#loader").style.display = "none";
          document.querySelector("#finalMessage").style.display = "none";
          feedbackExists = doc.exists;

          // if (doc.exists) {
          //     // document.querySelector('#mainForm').style.display = 'none';
          //     // document.querySelector('#loader').style.display = 'none';
          //     // document.querySelector('#finalMessage').style.display = 'block';
          // } else {
          //     document.querySelector('#mainForm').style.display = 'block';
          //     document.querySelector('#loader').style.display = 'none';
          //     document.querySelector('#finalMessage').style.display = 'none';
          // }
        });
      // getDataIfExist();
    } else {
      console.log("Nobody is Signed In");
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
    console.log(q5Array);
    q5Array.forEach((q5Option) => {
      q5Option.addEventListener("change", function (event) {
        count = 0;
        q5Array.forEach((element) => {
          if (element.checked) {
            count++;
          }
        });
        console.log(count);
        if (count > limit) {
          q5Option.checked = false;
        }
      });
    });
  }
  // LimitMultipleAnswers('q5', 2);
  // LimitMultipleAnswers('q7', 2);

  const showError = (
    value,
    message = "Please fill all the required fileds"
  ) => {
    if (value) {
      $("#errorMsg").fadeIn();
      document.querySelector("#errorMsg").innerHTML = message;
    } else {
      $("#errorMsg").fadeOut();
    }
  };

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

  $("#mainForm").on("submit", async function (event) {
    console.log(event);
    event.preventDefault();

    showError(false);
    const survey = {
      question1: parseInt(document.querySelector(".emojislider1").value) + 1,
      question2: document.querySelector("#session").value,
      question3: document.querySelector("#session3").value,
      question4: parseInt(document.querySelector(".emojislider2").value) + 1,
      question5: document.querySelector("#session2").value,
    };
    console.log(currentUser.displayName);

    ///

    // if (!survey.questions4_recommend) {
    //   showError(true, "Please answer the 3rd question also.");
    //   return;
    // }
    console.log(survey);
    firebase
      .firestore()
      .collection("userFeedback")
      .doc(currentUser.uid)
      .set({
        ...survey,
        name: currentUser.displayName,
        email: currentUser.email,
      })
      .then(() => {
        successfulFeedback();
      })
      .catch((err) => {
        console.log(err);
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
