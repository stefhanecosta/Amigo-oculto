import { db, auth, ensureAuth } from "./firebase-config.js";
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

  function makeDerangement(list){
    if (list.length <= 1) return null;
    let shuffled;
    const maxAttempts = 50;

    for (let t=0; t<maxAttempts; t++){
      shuffled = [...list];

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

    // Garante que o usuário está autenticado
    const user = await ensureAuth();
    
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
      createdBy: user.uid, // ID do usuário que criou
      createdAt: Date.now()
    };

    console.log('Salvando evento:', payload);

    try {
      await setDoc(doc(collection(db, "events"), id), payload);
      console.log('Evento salvo com sucesso!');
    } catch (err){
      console.error('Erro ao salvar:', err);
      alert("Erro ao salvar no servidor: " + err.message);
      return;
    }

    const link = `${window.location.origin}/draw.html?event=${id}`;
    console.log('Link gerado:', link);

    const generatedLinkDiv = document.getElementById('generatedLink');
    const linkBox = document.getElementById('linkBox');
    
    if (generatedLinkDiv && linkBox) {
      linkBox.value = link;
      generatedLinkDiv.classList.remove('hidden');
    }
  });

  const copyBtn = document.getElementById('copyLink');
  if (copyBtn) {
    copyBtn.addEventListener('click', function(){
      const box = document.getElementById('linkBox');
      if (!box) return;
      navigator.clipboard.writeText(box.value).then(() => {
        alert('Link copiado com sucesso!');
      }).catch(()=>{ 
        alert('Não foi possível copiar. Copie manualmente.');
      });
    });
  }

  const openBtn = document.getElementById('openLink');
  if (openBtn) {
    openBtn.addEventListener('click', function(){
      const box = document.getElementById('linkBox');
      if (!box) return;
      window.open(box.value, "_blank");
    });
  }

})();