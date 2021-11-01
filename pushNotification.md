1. add a 'firebase-messaging-sw.js' in your public folder, by default firebase checks for this file in the dir from where your website is served, i.e. public folder here
2.

window.sendNotificationToTopic({
    condition: "\'ankur5\' in topics",
    data:{
        link: "https://express-impact.web.app/inspire21?navmode=notification",
        icon: "/logo512.png",
        title: "Hello ",
        body: "Testing Push Notifications ",
        topic: "ankur5",
        type: "registration",
        eventId: "testevent1",
        canRepeat: true,
        msg_id: "unique_id_1",
    }
})
window.subscribeAllTokens({uid: "RtWXsbENPsW0uTywN0oVdlO8Dem2", topic:"ankur2"})
