// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAA1MEWDhxGeZiLcJ3dhHq1BdrZ2Yoji7s",
  authDomain: "amigo-oculto-e9daa.firebaseapp.com",
  projectId: "amigo-oculto-e9daa",
  storageBucket: "amigo-oculto-e9daa.firebasestorage.app",
  messagingSenderId: "879548725890",
  appId: "1:879548725890:web:c5c59d1898663af063129b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Login automático anônimo quando carregar a página
async function ensureAuth() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Usuário autenticado:", user.uid);
        resolve(user);
      } else {
        console.log("Fazendo login anônimo...");
        const result = await signInAnonymously(auth);
        resolve(result.user);
      }
    });
  });
}

// Inicia autenticação automaticamente
ensureAuth();

export { db, auth, ensureAuth };