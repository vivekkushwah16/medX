1. add a 'firebase-messaging-sw.js' in your public folder, by default firebase checks for this file in the dir from where your website is served, i.e. public folder here
2.

window.sendNotificationToTopic({
    condition: "\'ankur3\' in topics",
    data:{
        link: "https://ciplamedx.com/ipaedia21?admin=true&preview=registration",
        icon: "/logo512.png",
        title: "Hello Ankur,",
        body: "Testing Push Notifications",
        topic: "",
        msg_id: "unique_id",
    },
    analytics_label: ""
})
window.subscribeAllTokens({uid: "RtWXsbENPsW0uTywN0oVdlO8Dem2", topic:"ankur2"})
