import { db } from "./firebase-config.js";
import {
  collection,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

(function(){
  const form = document.getElementById('createForm');
  if (!form) return;

  function parseParticipants(text){
    return text
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  // Cria derangement (ninguém tira a si mesmo).
  function makeDerangement(list){
    if (list.length <= 1) return null;
    let shuffled;
    const maxAttempts = 50;

    for (let t=0; t<maxAttempts; t++){
      shuffled = [...list];

      // Fisher-Yates
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      let ok = true;
      for (let i=0; i<list.length; i++){
        if (shuffled[i] === list[i]) { ok = false; break; }
      }

      if (ok) return shuffled;
    }

    // fallback
    shuffled = [...list];
    for (let i=0;i<shuffled.length-1;i++){
      if (shuffled[i] === list[i]) {
        [shuffled[i], shuffled[i+1]] = [shuffled[i+1], shuffled[i]];
      }
    }

    for (let i=0;i<list.length;i++){
      if (shuffled[i] === list[i]) return null;
    }

    return shuffled;
  }

  function generateDrawMap(list){
    const targets = makeDerangement(list);
    if (!targets) return null;
    const map = {};
    for (let i=0; i<list.length; i++){
      map[list[i]] = targets[i];
    }
    return map;
  }

  function generateId(){
    return Math.random().toString(36).substring(2,10);
  }

  form.addEventListener('submit', async function(e){
    e.preventDefault();

    const eventName = document.getElementById('eventName').value.trim();
    const participantsRaw = document.getElementById('participants').value;
    const participants = parseParticipants(participantsRaw);

    if (!eventName){
      alert('Informe o nome do evento.');
      return;
    }

    if (participants.length < 2){
      alert('Cadastre pelo menos 2 participantes.');
      return;
    }

    const draws = generateDrawMap(participants);
    if (!draws){
      alert('Não foi possível gerar o sorteio sem repetições.');
      return;
    }

    const id = generateId();

    const payload = {
      id,
      name: eventName,
      participants,
      draws,
      createdAt: Date.now()
    };

    // ⭐ Salva no Firebase
    try {
      await setDoc(doc(collection(db, "events"), id), payload);
    } catch (err){
      alert("Erro ao salvar no servidor: " + err.message);
      return;
    }

    // Gera link
    const link = `${window.location.origin}/draw.html?event=${id}`;

    // Exibe link
    document.getElementById('generatedLink').classList.remove('hidden');
    document.getElementById('linkBox').value = link;
  });

  document.getElementById('copyLink').addEventListener('click', function(){
    const box = document.getElementById('linkBox');
    if (!box) return;
    navigator.clipboard.writeText(box.value).then(() => {
      alert('Link copiado com sucesso!');
    }).catch(()=>{ 
      alert('Não foi possível copiar. Copie manualmente.');
    });
  });

  document.getElementById('openLink').addEventListener('click', function(){
    const box = document.getElementById('linkBox');
    if (!box) return;
    window.open(box.value, "_blank");
  });

})();
