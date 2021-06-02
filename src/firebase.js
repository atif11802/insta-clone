  import firebase from  "firebase";

  const firebaseApp= firebase.initializeApp({
    apiKey: "AIzaSyAbJ88CJk9HTNg7XxsJ53lmGhmTuFlBiZE",
    authDomain: "instagam-clone-793a0.firebaseapp.com",
    projectId: "instagam-clone-793a0",
    storageBucket: "instagam-clone-793a0.appspot.com",
    messagingSenderId: "889655961731",
    appId: "1:889655961731:web:835cc03952f4d2c31693b6",
    measurementId: "G-QKFRDYRB06"
  })
  const db= firebaseApp.firestore();
  const auth=firebase.auth();
  const storage=firebase.storage();

  export { db, auth, storage};

