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


// exports.sendGoingEventNotification = functions.firestore
//     .document('/Users/{userId}/GoingList/{goingId}')
//     .onCreate(async (snapshot, context) => {


//         let userRef = await firestoreDB.collection('Users').doc(context.params["userId"]).get();
//         const token = userRef.data().pushToken;
//         console.log(`token is : ${token}`);

//         console.log(snapshot.data().description);
//         console.log(snapshot.data().time);

//         const dt = new Date(parseInt(snapshot.data().time));
//         const hr = dt.getHours();
//         const minute = dt.getMinutes();
//         const date = dt.getDate();
//         const month = dt.getMonth();

//         console.log(`${hr} , ${minute} , ${date} , ${month}`);

//         const payload = {
//             notification: {
//                 title: snapshot.data().showName,
//                 body: snapshot.data().description,
//                 clickAction: 'FLUTTER_NOTIFICATION_CLICK',
//             }
//         };

//         functions.pubsub.schedule('* * * * *').timeZone('IST').onRun(async context => {
//             console.log('I am running and executing every fucking 1:1 minute................');
//             await admin.messaging().sendToDevice(token, payload);
//             return Promise.resolve();
//         }); // THIS IS NOT WORKING

//         return Promise.resolve();
//     });





exports.scheduleFunction = functions.pubsub.schedule('0 8 * * *').timeZone('IST').onRun(async context => {
    console.log('I am running and executing every fucking 1:1 minute................');

    await firestoreDB.collection('Users').get().then(async (value) => {
        for (let index = 0; index < value.docs.length; index++) {
            const data = value.docs[index].id;

            let userRef = await firestoreDB.collection('Users').doc(data).get();
            const token = userRef.data().pushToken;
            console.log(`token is : ${token}`);

            await firestoreDB.collection('Users').doc(data).collection("GoingList").get().then(async (snapshot) => {
                for (let index2 = 0; index2 < snapshot.docs.length; index2++) {
                    const element = snapshot.docs[index2].id;

                    let userRef2 = await firestoreDB.collection('Users').doc(data).collection("GoingList").doc(element).get();

                    console.log(userRef2.data().description);

                    console.log(userRef2.data().time);

                    const currentYear = new Date().getFullYear();
                    const currentMonth = new Date().getMonth();
                    const currentDay = new Date().getDate();

                    const dt = new Date(parseInt(userRef2.data().time));
                    const hr = dt.getHours();
                    const minute = dt.getMinutes();
                    const date = dt.getDate();
                    const month = dt.getMonth();

                    console.log(`saved Date Details ${hr} , ${minute} , ${date} , ${month}`);
                    console.log(`Current Date Details ${currentMonth} , ${currentDay} }`);


                    if ((month === (currentMonth)) && (date === (currentDay + 1))) {
                        console.log("Notification active!");
                        const payload = {
                            notification: {
                                title: userRef2.data().showName,
                                body: userRef2.data().description,
                                clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                            }
                        };
                        await admin.messaging().sendToDevice(token, payload,);

                    } else {
                        console.log("Notification Not Activated!");
                    }

                }
            });







            // const payload = {
            //     notification: {
            //         title: snapshot.data().showName,
            //         body: snapshot.data().description,
            //         clickAction: 'FLUTTER_NOTIFICATION_CLICK',
            //     }
            // };
            // await admin.messaging().sendToDevice(token, payload,);
            // return Promise.resolve();


        }
    });


    return Promise.resolve();
});





import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';

import 'Home.dart';

Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  // If you're going to use other Firebase services in the background, such as Firestore,
  // make sure you call `initializeApp` before using other Firebase services.
  await Firebase.initializeApp();

  print("Handling a background message: ${message.messageId}");
}


void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  FirebaseMessaging messaging = FirebaseMessaging.instance;

  NotificationSettings settings = await messaging.requestPermission(
    alert: true,
    announcement: false,
    badge: true,
    carPlay: false,
    criticalAlert: false,
    provisional: false,
    sound: true,
  );

  print('User granted permission: ${settings.authorizationStatus}');
  FirebaseMessaging.onMessage.listen((RemoteMessage message) {
    print('Got a message whilst in the foreground!');
    print('Message data: ${message.data}');

    if (message.notification != null) {
      print('Message also contained a notification: ${message.notification}');
    }
  });
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: "SYNCO",
      home: Home(),
      // home: NewEventView(),
    );
  }
}
