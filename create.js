// create.js — usado por index.html
(function(){
  const form = document.getElementById('createForm');
  if (!form) return;

  function parseParticipants(text){
    return text
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  // Cria uma derangement (nenhum participante tira a si mesmo).
  function makeDerangement(list){
    if (list.length <= 1) return null; // impossível para 1
    let attempt, shuffled;
    const maxAttempts = 50;
    for (let t=0; t<maxAttempts; t++){
      shuffled = [...list];
      // Fisher-Yates shuffle
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      // verifica se existe posição onde shuffled[i] === list[i]
      let ok = true;
      for (let i=0;i<list.length;i++){
        if (shuffled[i] === list[i]) { ok = false; break; }
      }
      if (ok) return shuffled;
    }
    // fallback: algoritmo de troca simples para garantir derangement
    // (cobre casos raros)
    shuffled = [...list];
    for (let i=0;i<shuffled.length-1;i++){
      if (shuffled[i] === list[i]) {
        [shuffled[i], shuffled[i+1]] = [shuffled[i+1], shuffled[i]];
      }
    }
    // último check
    for (let i=0;i<list.length;i++){
      if (shuffled[i] === list[i]) return null;
    }
    return shuffled;
  }

  function generateDrawMap(list){
    const targets = makeDerangement(list);
    if (!targets) return null;
    const map = {};
    for (let i=0;i<list.length;i++){
      map[list[i]] = targets[i];
    }
    return map;
  }

  function generateId(){
    return Math.random().toString(36).substring(2,10);
  }

  form.addEventListener('submit', function(e){
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
      alert('Não foi possível gerar o sorteio sem repetições. Tente alterar a lista.');
      return;
    }

    const id = generateId();
    const payload = {
      id,
      name: eventName,
      participants,
      draws,
      createdAt: new Date().toISOString()
    };

    // Salva no localStorage sob a chave "secret-santa:{id}"
    try {
      localStorage.setItem('secret-santa:' + id, JSON.stringify(payload));
    } catch (err){
      alert('Falha ao salvar no localStorage: ' + err.message);
      return;
    }

    const link = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '') + '/draw.html?event=' + id;
    document.getElementById('generatedLink').classList.remove('hidden');
    document.getElementById('linkBox').value = link;
  });

  document.getElementById('copyLink').addEventListener('click', function(){
    const box = document.getElementById('linkBox');
    if (!box) return;
    navigator.clipboard.writeText(box.value).then(() => {
      alert('Link copiado para a área de transferência');
    }).catch(()=>{ alert('Não foi possível copiar. Selecione e copie manualmente.'); });
  });

  document.getElementById('openLink').addEventListener('click', function(){
    const box = document.getElementById('linkBox');
    if (!box) return;
    window.open(box.value, '_blank');
  });
})();
