import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, updateDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export const writeGenericDocument = async (collectionID, body) => {
    await addDoc(collection(db, collectionID), body);
};

export const updateDocument = async (collectionID, documentID, body) => {
    await updateDoc((db, collectionID, documentID), body);
};

export const readDocument = async (collectionID, documentID) => {
    const document = await getDoc(doc(db, collectionID, documentID));

    if (document.exists()) {
        return document.data();
    } else {
        throw new Error("ERROR: Document doesn't exist");
    }
}
