import { db } from "./firebase-config.js";
import {
  collection,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

(function(){
  console.log("=== CREATE.JS CARREGADO ===");
  
  const form = document.getElementById('createForm');
  if (!form) {
    console.error("❌ Formulário não encontrado!");
    return;
  }

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
    console.log("=== SUBMIT INICIADO ===");

    try {
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
        passwords: {}, // Senhas vazias - serão criadas pelos usuários
        viewed: {},     // Controle de visualizações
        createdAt: Date.now()
      };

      console.log('Salvando evento:', payload);

      await setDoc(doc(collection(db, "events"), id), payload);
      console.log('✅ Evento salvo com sucesso!');

      let baseUrl = window.location.origin;
      
      if (baseUrl.includes('-git-')) {
        console.warn("⚠️ Você está em um preview deployment!");
      }
      
      const link = `${baseUrl}/draw.html?event=${id}`;
      console.log("✅ Link gerado:", link);

      const generatedLinkDiv = document.getElementById('generatedLink');
      const linkBox = document.getElementById('linkBox');
      
      if (generatedLinkDiv && linkBox) {
        linkBox.value = link;
        generatedLinkDiv.classList.remove('hidden');
      }

    } catch (err){
      console.error("❌ ERRO:", err);
      alert("Erro: " + err.message);
    }
  });

  document.getElementById('copyLink')?.addEventListener('click', function(){
    const box = document.getElementById('linkBox');
    if (!box) return;
    navigator.clipboard.writeText(box.value).then(() => {
      alert('Link copiado com sucesso!');
    }).catch(()=>{ 
      alert('Não foi possível copiar. Copie manualmente.');
    });
  });

  document.getElementById('openLink')?.addEventListener('click', function(){
    const box = document.getElementById('linkBox');
    if (!box) return;
    window.open(box.value, "_blank");
  });

})();