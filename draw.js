// draw.js — usado por draw.html
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
    // opcionalmente redirecionar para index.html
  }

  function loadEvent(id){
    try {
      const raw = localStorage.getItem('secret-santa:' + id);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  const eventData = loadEvent(eventId);

  if (!eventData){
    alert('Evento não encontrado ou expirado. Peça ao organizador para gerar um novo link.');
  } else {
    eventTitleEl.textContent = 'Evento: ' + eventData.name;
    // preenche placeholder com o primeiro participante como sugestão (opcional)
    if (eventData.participants && eventData.participants.length > 0){
      yourNameInput.placeholder = 'Ex: ' + eventData.participants[0];
      participantsListBox.textContent = 'Participantes: ' + eventData.participants.join(', ');
    }
  }

  function showResult(text){
    resultBox.textContent = text;
    resultBox.classList.remove('hidden');
  }

  drawBtn.addEventListener('click', function(){
    if (!eventData){
      alert('Evento não disponível.');
      return;
    }
    const name = yourNameInput.value.trim();
    if (!name) {
      alert('Digite seu nome (exatamente como foi cadastrado).');
      return;
    }
    const target = eventData.draws ? eventData.draws[name] : undefined;
    if (!target){
      alert('Nome não encontrado. Verifique a grafia e tente novamente.');
      return;
    }
    // Mostra resultado
    showResult('Você tirou: ' + target + ' 🎁');
  });

  // Mostrar/ocultar lista de participantes (apenas para conferência)
  showListBtn.addEventListener('click', function(){
    if (!participantsListBox) return;
    participantsListBox.classList.toggle('hidden');
    showListBtn.textContent = participantsListBox.classList.contains('hidden') ? 'Ver participantes' : 'Ocultar participantes';
  });

  // também aceita Enter no campo
  yourNameInput.addEventListener('keydown', function(e){
    if (e.key === 'Enter') {
      e.preventDefault();
      drawBtn.click();
    }
  });
})();
