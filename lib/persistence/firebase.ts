import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore, runTransaction, collection, getDocs, addDoc, updateDoc, deleteDoc, getDoc, doc, query, where, orderBy, startAt, limit, QuerySnapshot, DocumentData, setDoc } from 'firebase/firestore';


let app: FirebaseApp;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
if (getApps().length) {
    app = getApp();
} else {
    app = initializeApp(firebaseConfig);
}

const firestoreInstance = getFirestore(app);
const storageInstance = getStorage();

export async function uploadFile(path: string[], name: string, file: any) {
    console.log('Upload image', path);
    const storageRef = ref(storageInstance, `${path.join('/')}/${name}`);

    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, file).then((snapshot) => {
        console.log(snapshot);
        console.log('Uploaded a blob or file!');
    }).catch(reason => {
        console.log('Error on upload',reason);
    });
}

export const firebaseClient = {
    db: firestoreInstance,
    collection,
    query,
    where,
    limit,
    doc,
    getDocs,
    addDoc, 
    getDoc,
    updateDoc,
    deleteDoc, 
    runTransaction
}

export async function addDocument<T>(colectionName: string, data: T & { id: string }) {
    

    if (data.id == null) {
        console.log('addDoc', data.id, data);
        const col = collection(firestoreInstance, colectionName);
        return await addDoc(col, data).catch(reason => { 
            throw reason;
        });
    } else {
        console.log('srtDoc', data.id, data);
        return await setDoc(doc(firestoreInstance, colectionName, data.id), data).catch(reason => { 
            throw reason;
        });
    };
}

function readSnap(snap: QuerySnapshot<DocumentData>) {
    return snap.docs.map(doc => {
        return { id: doc.id, ...doc.data() };
    });
}

export async function queryColection<T>(path: string, options?: any) {
    const colectionRef = collection(firestoreInstance, path);
    if (options == null) return await getDocs(colectionRef).then(readSnap);
    const { user } = options;
    const { whereOpt, startOpt, limitOpt, orderOpt } = options;

    const opt = [where('owner','==', user)];
    if (!(orderOpt == null)) opt.push(orderBy(orderOpt));
    if (!(startOpt == null)) opt.push(startAt(startOpt));
    if (!(limitOpt == null)) opt.push(limit(limitOpt));

    const q = query(colectionRef, ...opt);
    return await getDocs(q).then(readSnap);
}

export { app };
