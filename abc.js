const functions = require('firebase-functions');
const admin = require('firebase-admin');

//use to run --- type ------- firebase deploy

admin.initializeApp();
const firestore = admin.firestore();

exports.pushNotification = functions.firestore
    .document('chatRoomsV2/{chats}/messages/{messages}')
    .onCreate(async (snapshot, context) => {
        let userRef = await firestore.collection('usersV2').doc(snapshot.data().from_id).get();
        console.log(`fjhffh sender name ${userRef.data().user_name} ,to ${snapshot.data().to_id} , from to ${snapshot.data().from_id}`);
        await admin.messaging().sendToTopic(`${snapshot.data().to_id}`, {
            notification: {
                title: userRef.data().user_name,
                body: snapshot.data().message,
                // image:userRef.data().image_url,
                clickAction: 'FLUTTER_NOTIFICATION_CLICK',
            },
        });
    });

exports.pushScheduler = functions.firestore
    .document('ScheduleTime/{scheduleTimeId}')
    .onCreate(async (snapshot, context) => {
        let userRef = await firestore.collection('usersV2').doc(snapshot.data().userId).get();
        let list = await firestore.collection('followers').doc(snapshot.data().userId).collection('myFollowers').get();
        let x = 0;
        list.docs.forEach(doc => {
             admin.messaging().sendToTopic(`${doc.id}`, {
                notification: {
                    title: userRef.data().user_name + 'Time Scheduled!',
                    body: 'I will Stream on  ' + snapshot.data().Date + '  at  ' + snapshot.data().Time,
                    clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                },
            });
            x = x + 1;
            console.log(x + " Looop times id " + doc.id);
        });
    });




/**exports.pushScheduler = functions.firestore
       .document('ScheduleTime/{scheduleTimeId}')
       .onCreate(async (snapshot, context) => {
           let userRef = await firestore.collection('usersV2').doc(snapshot.data().userId).get();
           let list = await firestore.collection('followers').doc(snapshot.data().userId).collection('myFollowers').get();
           let x = 0;
           return list.docs.map(doc => {
                 admin.messaging().sendToTopic(`${doc.id}`, {
                   notification: {
                       title: userRef.data().user_name + " Time Scheduled!",
                       body: "I will Stream on " + snapshot.data().Date + " at " + snapshot.data().Time,
                       clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                   },
               })
               x = x + 1;
               console.log(x + " Loop times id " + doc.id);
           }

           );
       });


**/
// return list.docs.foreach(async (doc) => (
//             await admin.messaging().sendToTopic(`${doc.id}`, {
//                 notification: {
//                     title: userRef.data().user_name + "Time Scheduled!",
//                     body: 'I will Stream on ' + snapshot.data().Date + ' at ' + snapshot.data().Time,
//                     clickAction: 'FLUTTER_NOTIFICATION_CLICK',
//                 },
//             })
//         )
//         );



exports.followNotification = functions.firestore
    .document('following/{uid}/myFollowings/{followedById}')
    .onCreate(async (snapshot, context) => {
        let userRef = await firestore.collection('usersV2').doc(snapshot.data().followedById).get();
        console.log(` sender name ${userRef.data().user_name} ,to ${snapshot.data().followingById} , from to ${snapshot.data().followedById}`);
        await admin.messaging().sendToTopic(`${snapshot.data().followingById}`, {
            notification: {
                title: userRef.data().user_name,
                body: 'Followed by ' + userRef.data().user_name,
                // image:userRef.data().image_url,
                clickAction: 'FLUTTER_NOTIFICATION_CLICK',
            },
        });
    });


exports.onUserStatusChange = functions.database
    .ref("/{uid}/online")
    .onUpdate(async (change, context) => {
        const isOnline = change.after.val();
        const userStatusFirestoreRef = firestore.doc("usersV2/" + context.params.uid);

        const snapshot = await firestore.collection("liveRoomsV2")
            .where("host.id", "==", context.params.uid)
            .where("active", "==", true)
            .get();

        snapshot.forEach(doc => {
            doc.ref.update({ "active": false });
        });

        return userStatusFirestoreRef.update({
            online: isOnline,
            last_seen: Date.now()
        });
    });

/*
exports.onFollowUser = functions.firestore
    .document("followers/{uid}/myFollowers/{followedById}")
    .onCreate(async (snapshot, context) => {
        const snapshot1 = await firestore.collection("usersV2")
            .doc(context.params.uid)
            .get();
        let followersCount = snapshot1.data().followed_by_count;
        if(!followersCount) {
            followersCount = 0;
        }
        snapshot1.ref.update({'followed_by_count': followersCount + 1});

        const snapshot2 = await firestore.collection("usersV2")
                .doc(context.params.followedById)
                .get();
        let followingCount = snapshot1.data().following_count;
         if(!followingCount) {
            followingCount = 0;
         }
        return snapshot2.ref.update({'following_count': followingCount + 1});
});

exports.onUnFollowUser = functions.firestore
    .document("followers/{uid}/myFollowers/{followedById}")
    .onDelete(async (snapshot, context) => {
        const snapshot1 = await firestore.collection("usersV2")
            .doc(context.params.uid)
            .get();
        let followersCount = snapshot1.data().followed_by_count;
        if(!followersCount) {
            followersCount = 0;
        }
        if(followersCount === 0) {
            snapshot1.ref.update({'followed_by_count': 0});
        } else {
            snapshot1.ref.update({'followed_by_count': followersCount - 1});
        }

        const snapshot2 = await firestore.collection("usersV2")
                .doc(context.params.followedById)
                .get();
        let followingCount = snapshot1.data().following_count;
         if(!followingCount) {
            followingCount = 0;
         }
         if(followingCount === 0) {
            return snapshot2.ref.update({'following_count': 0});
         } else {
            return snapshot2.ref.update({'following_count': followingCount - 1});
         }
});
*/