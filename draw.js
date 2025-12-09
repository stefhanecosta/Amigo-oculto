// draw.js — usado por draw.html (versão Firebase)
import { db, ensureAuth } from "./firebase-config.js";
import { 
  doc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

(function(){
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get('event');
  const eventTitleEl = document.getElementById('eventTitle');
  const drawBtn = document.getElementById('drawButton');
  const yourNameInput = document.getElementById('yourName');
  const resultBox = document.getElementById('resultBox');
  const participantsListBox = document.getElementById('participantsList');
  const showListBtn = document.getElementById('showList');

  if (!eventId){
    alert('ID do evento não foi informado na URL.');
  }

  let eventData = null;

  async function loadEvent(id){
    try {
      // Garante autenticação antes de buscar
      await ensureAuth();
      
      // ATENÇÃO: Nome da coleção deve ser "events" (igual no create.js)
      const ref = doc(db, "events", id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      return snap.data();
    } catch (err){
      console.error("Erro ao carregar evento:", err);
      return null;
    }
  }

  // Carrega evento do Firebase
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

  drawBtn.addEventListener("click", function(){
    if (!eventData){
      alert("Evento não carregado.");
      return;
    }

    const name = yourNameInput.value.trim();

    if (!name){
      alert("Digite seu nome exatamente como foi cadastrado.");
      return;
    }

    const target = eventData.draws ? eventData.draws[name] : undefined;

    if (!target){
      alert("Nome não encontrado. Verifique a grafia.");
      return;
    }

    showResult("Você tirou: " + target + " 🎁");
  });

  // Mostrar / ocultar lista
  showListBtn.addEventListener("click", function(){
    participantsListBox.classList.toggle("hidden");
    showListBtn.textContent = participantsListBox.classList.contains("hidden")
      ? "Ver participantes"
      : "Ocultar participantes";
  });

  // Enter para confirmar
  yourNameInput.addEventListener("keydown", function(e){
    if (e.key === "Enter"){
      e.preventDefault();
      drawBtn.click();
    }
  });
})();