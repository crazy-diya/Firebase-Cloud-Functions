const functions = require("firebase-functions");
const axios = require('axios');
const admin = require('firebase-admin');
admin.initializeApp();
const firestoreDB = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// exports.helloWorld = functions.https.onRequest((req, res) => {
//     res.send("Hello from firebase Functions!....");
// });

// exports.api = functions.https.onRequest( async (req,res)=>{
//     switch(req.method){
//         case 'GET':
//             const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
//             console.log("It was a GET Request");
//             res.send(response.data);
//             break;

//         case 'POST':
//             const body = req.body;
//             res.send(body);
//             break;

//         case 'DELETE':
//             res.send("It was a DELETE Request");
//             break;

//         default:
//             res.send("It was a Default Request");
//             break;
//     }
// });

// exports.userAdded = functions.auth.user().onCreate(user =>{
//     console.log(`${user.email} is created!.................`);
//     return Promise.resolve();
// });

// exports.userDeleted = functions.auth.user().onDelete(user => {
//     console.log(`${user.email} is Deleted!.................`);
//     return Promise.resolve();
// });

// exports.fruitAdded = functions.firestore.document('/fruits/{documentId}').onCreate((snapshot, context)=>{
//     console.log(snapshot.data(), 'Created!');
//     return Promise.resolve();
// });

// exports.fruitDelete = functions.firestore.document('/fruits/{documentId}').onDelete((snapshot,context)=>{
//     console.log(snapshot.data(), 'deleted!');
//     return Promise.resolve();
// });

// exports.fruitUpdate = functions.firestore.document('/fruits/{documentId}').onUpdate((snapshot, context)=>{
//     console.log('Before: ', snapshot.before.data());
//     console.log('After: ', snapshot.after.data());
//     return Promise.resolve();
// });

// exports.scheduleFunction = functions.pubsub.schedule('3 1 28 9 *').timeZone('IST').onRun(context => {
//     console.log('I am running and executing every fucking 1:1 minute................');
//     return Promise.resolve();
// });


// exports.sendGoingEventNotification = functions.firestore
//     .document('/Users/{userId}/GoingList/{goingId}')
//     .onCreate(async (snapshot, context) => {
//         console.log(snapshot.data());
//         console.log(`sssssssssssssssssssssssssssssssssssssssss ${context.params["userId"]}`);

//         console.log(`&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& ${context.params["goingId"]}`);


//         let userRef = await firestoreDB.collection('Users').doc(context.params["userId"]).get();
//         const token = userRef.data().pushToken;
//         console.log(`token is : ${token}`);

//         console.log(snapshot.data().description);

//         const payload = {
//             notification: {
//                 title: snapshot.data().showName,
//                 body: snapshot.data().description,
//                 clickAction: 'FLUTTER_NOTIFICATION_CLICK',
//             }
//         };
//         await admin.messaging().sendToDevice(token, payload,);
//         return Promise.resolve();
//     });


exports.sendGoingEventNotification = functions.firestore
    .document('/Users/{userId}/GoingList/{goingId}')
    .onCreate(async (snapshot, context) => {


        let userRef = await firestoreDB.collection('Users').doc(context.params["userId"]).get();
        const token = userRef.data().pushToken;
        console.log(`token is : ${token}`);

        console.log(snapshot.data().description);
        console.log(snapshot.data().time);

        const dt = new Date(parseInt(snapshot.data().time));
        const hr = dt.getHours();
        const minute = dt.getMinutes();
        const date = dt.getDate();
        const month = dt.getMonth();

        console.log(`${hr} , ${minute} , ${date} , ${month}`);

        const payload = {
            notification: {
                title: snapshot.data().showName,
                body: snapshot.data().description,
                clickAction: 'FLUTTER_NOTIFICATION_CLICK',
            }
        };

        functions.pubsub.schedule('* * * * *').timeZone('IST').onRun(async context => {
            console.log('I am running and executing every fucking 1:1 minute................');
            await admin.messaging().sendToDevice(token, payload);
            return Promise.resolve();
        }); // THIS IS NOT WORKING

        return Promise.resolve();
    });