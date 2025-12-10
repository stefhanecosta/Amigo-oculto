import { db } from "./firebase-config.js";
import { 
  doc, 
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

(function(){
  console.log("=== DRAW.JS CARREGADO ===");

  const params = new URLSearchParams(window.location.search);
  const eventId = params.get('event');
  const eventTitleEl = document.getElementById('eventTitle');
  const drawBtn = document.getElementById('drawButton');
  const yourNameInput = document.getElementById('yourName');
  const yourPasswordInput = document.getElementById('yourPassword');
  const passwordHint = document.getElementById('passwordHint');
  const resultBox = document.getElementById('resultBox');
  const participantsListBox = document.getElementById('participantsList');
  const showListBtn = document.getElementById('showList');

  console.log("Event ID:", eventId);

  if (!eventId){
    alert('ID do evento não foi informado na URL.');
    return;
  }

  let eventData = null;

  async function loadEvent(id){
    try {
      console.log("Buscando evento:", id);
      const ref = doc(db, "events", id);
      const snap = await getDoc(ref);
      
      if (!snap.exists()) {
        console.warn("Evento não existe");
        return null;
      }
      
      const data = snap.data();
      if (!data.passwords) data.passwords = {};
      if (!data.viewed) data.viewed = {};
      
      console.log("Evento carregado");
      return data;
    } catch (err){
      console.error("Erro ao carregar evento:", err);
      return null;
    }
  }

  // Hash simples para senha (não é criptografia forte, mas serve para o propósito)
  function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  
  (async function(){
    eventData = await loadEvent(eventId);

    if (!eventData){
      alert('Evento não encontrado. Peça ao organizador para gerar um novo link.');
      return;
    }

    eventTitleEl.textContent = "Evento: " + eventData.name;

    if (eventData.participants?.length > 0){
      yourNameInput.placeholder = "Ex: " + eventData.participants[0];
      participantsListBox.textContent = "Participantes: " + eventData.participants.join(", ");
    }
  })();

  function showResult(text){
    resultBox.textContent = text;
    resultBox.classList.remove("hidden");
  }

  drawBtn.addEventListener("click", async function(){
    if (!eventData){
      alert("Evento não carregado.");
      return;
    }

    const name = yourNameInput.value.trim();
    const password = yourPasswordInput.value.trim();

    if (!name){
      alert("Digite seu nome exatamente como foi cadastrado.");
      return;
    }

    if (!password){
      alert("Digite uma senha.");
      return;
    }

    
    const target = eventData.draws ? eventData.draws[name] : undefined;

    if (!target){
      alert("Nome não encontrado. Verifique a grafia.");
      return;
    }

    const passwordHash = simpleHash(password);

    // Caso 1: Primeira vez (não tem senha cadastrada)
    if (!eventData.passwords[name]) {
      console.log("Primeira vez de:", name);
      
      try {
        const eventRef = doc(db, "events", eventId);
        const updates = {};
        updates[`passwords.${name}`] = passwordHash;
        updates[`viewed.${name}`] = Date.now();
        
        await updateDoc(eventRef, updates);
        console.log("Senha criada e visualização registrada");
        
        // Atualiza localmente
        eventData.passwords[name] = passwordHash;
        eventData.viewed[name] = Date.now();
        
        showResult("Você tirou: " + target + " 🎁");
        passwordHint.innerHTML = "Senha criada com sucesso! Guarde-a para ver novamente.";
        passwordHint.style.color = "#166534";
        
      } catch (err) {
        console.error("Erro ao salvar senha:", err);
        alert("Erro ao salvar senha: " + err.message);
      }
      
      return;
    }

    // Caso 2: Já tem senha cadastrada - verifica se está correta
    if (eventData.passwords[name] !== passwordHash) {
      alert("Senha incorreta!\n\nVocê já definiu uma senha antes. Use a mesma senha para ver novamente.");
      return;
    }

    // Caso 3: Senha correta - mostra resultado
    console.log("Senha correta para:", name);
    
    
    try {
      const eventRef = doc(db, "events", eventId);
      const updates = {};
      updates[`viewed.${name}`] = Date.now();
      await updateDoc(eventRef, updates);
      eventData.viewed[name] = Date.now();
    } catch (err) {
      console.error("Erro ao atualizar visualização:", err);
    }
    
    showResult("Você tirou: " + target + " 🎁");
    passwordHint.innerHTML = `Acesso autorizado!`;
    passwordHint.style.color = "#166534";
  });

  
  showListBtn.addEventListener("click", function(){
    participantsListBox.classList.toggle("hidden");
    showListBtn.textContent = participantsListBox.classList.contains("hidden")
      ? "Ver participantes"
      : "Ocultar participantes";
  });

  
  yourPasswordInput.addEventListener("keydown", function(e){
    if (e.key === "Enter"){
      e.preventDefault();
      drawBtn.click();
    }
  });

  console.log("=== DRAW.JS PRONTO ===");
})();