document.querySelector("#playButton").disabled = false;
const db = firebase.firestore();
var userid = "aa11";
var currentUser = null;
var gamescore_new;
window.main = this;
const urlQuery = new URLSearchParams(window.location.search);
let eventId = urlQuery.get("eventId");

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    userid = user.uid;
    currentUser = user;
    db.collection("quiz")
      .doc(`${eventId}_${userid}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          document.querySelector("#playButton").disabled = true;
          document.querySelector("#playButton").innerHTML =
            "Already Played Once. Opening Leaderboard.";
          //show leaderboard
          setTimeout(() => {
            showLeaderBoard();
          }, 1000);
        } else {
          document.querySelector("#playButton").disabled = false;
          document.querySelector("#playButton").innerHTML = "Play Now";
        }
      });

    console.log(userid);
  }
});

var rankList = [];
var doc = [];
var r = -1;

function UpdateScrore(gamescore, totalTime) {
  if (userid !== "" || userid !== undefined) {
    // console.log(userid);

    var number = localStorage.getItem("phone");

    gamescore_new = gamescore;
    gamescore_new = parseInt(gamescore_new);

    var gameDocRef = db.collection("quiz").doc(`${eventId}_${userid}`);
    db.runTransaction(function (transaction) {
      return transaction.get(gameDocRef).then(function (gamedoc) {
        if (!gamedoc.exists) {
          transaction.set(gameDocRef, {
            id: userid,
            quiz_score: gamescore_new,
            time: totalTime,
            name: currentUser.displayName,
            eventId: eventId,
          });
          return gamescore_new;
        }
        //inc total response
        var totalscore = gamedoc.data().quiz_score;
        if (totalscore < gamescore_new) {
          totalscore = gamescore_new;
          transaction.update(gameDocRef, { quiz_score: totalscore });
        }
        // console.log(gamescore_new + "gamescore_new");

        return totalscore;
      });
    })
      .then(function (totalscore) {
        showLeaderBoard();
      })
      .catch(function (err) {
        console.error(err);
      });
  }
}

function showLeaderBoard() {
  const myPromise = new Promise(function (resolve, reject) {
    // code here
    var idx = 1;
    var found = false;
    var users_ref = db.collection("quiz");
    users_ref.where('eventId', "==", eventId)
      .orderBy("quiz_score", "desc")
      .limit(10)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          rankList.push(doc);
          // console.log(doc.id);
          if (doc.id === `${eventId}_${userid}`) {
            r = idx;
            found = true;
          }
          idx++;
        });
        // console.log(rankList);
        // console.log(r);
        document.getElementById("quizContainer").style.display = "none";
        resolve(rankList);
      });
  });

  myPromise
    .then(function whenOk(response) {
      // console.log(response);
      // console.log(r);
      // console.log(rankList);
      var resultArray = document.getElementById("tbody");
      // console.log(rankList.length);
      for (let i = 0; i < Math.min(9, rankList.length); i++) {
        // console.log(rankList[i].id);

        var myRow = i + 1 == r ? "myRow" : "";
        if (i == 0) {
          resultArray.innerHTML +=
            '<tr class="' +
            myRow +
            '"><td>' +
            (i + 1) +
            "</td><td>" +
            rankList[i].data().name +
            "</td>" +
            '<td><img src="image/gold.png">' +
            rankList[i].data().quiz_score +
            "</td></tr>";
        } else if (i == 1) {
          resultArray.innerHTML +=
            '<tr class="' +
            myRow +
            '"><td>' +
            (i + 1) +
            "</td><td>" +
            rankList[i].data().name +
            "</td>" +
            '<td><img src="image/silver.png">' +
            rankList[i].data().quiz_score +
            "</td></tr>";
        } else if (i == 2) {
          resultArray.innerHTML +=
            '<tr class="' +
            myRow +
            '"><td>' +
            (i + 1) +
            "</td><td>" +
            rankList[i].data().name +
            "</td>" +
            '<td><img src="image/bronze.png">' +
            rankList[i].data().quiz_score +
            "</td></tr>";
        } else {
          resultArray.innerHTML +=
            '<tr class="' +
            myRow +
            '"><td>' +
            (i + 1) +
            "</td><td>" +
            rankList[i].data().name +
            "</td><td>" +
            rankList[i].data().quiz_score +
            "</td></tr>";
        }
      }
      if (rankList.length > 9) {
        if (r < 10) {
          resultArray.innerHTML +=
            '<tr class="' +
            '"><td>' +
            10 +
            "</td><td>" +
            rankList[9].data().name +
            "</td><td>" +
            rankList[9].data().quiz_score +
            "</td></tr>";
        } else {
          resultArray.innerHTML +=
            '<tr class="' +
            "myRow" +
            '"><td>' +
            r +
            "</td><td>" +
            rankList[r - 1].data().name +
            "</td><td>" +
            rankList[r - 1].data().quiz_score +
            "</td></tr>";
        }
      }
      firstpage.style.display = "none";
      document.getElementById("theResult").style = "display:none;";
      document.getElementById("leaderboard").style =
        "display:block; margin-top:8rem;";
      return response;
    })
    .catch(function notOk(err) {
      console.error(err);
    });
}
