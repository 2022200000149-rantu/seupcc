// script.js (served by Apps Script environment)
let appData = null;
let ttsList = [];
let ttsIndex = 0;
let ttsPlaying = false;
const synth = window.speechSynthesis;

function init(){
  google.script.run.withSuccessHandler(render).getSheetData();
  document.getElementById('playBtn').addEventListener('click', ()=> ttsPlay());
  document.getElementById('pauseBtn').addEventListener('click', ()=> ttsPause());
}

function render(data){
  appData = data;
  renderNews(data.readStrings);
  renderTTSList(data.readStrings);
  renderNotices(data.notices);
  renderCountdown(data.countdownRaw);
}

function renderNews(readStrings){
  // Use row2 as news wheel content - join items into a marquee
  const el = document.getElementById('newsTicker');
  if(!readStrings || !readStrings.length){ el.textContent=''; return; }
  const contents = readStrings.map(s => `<span class="marq-item">${escapeHtml(s)}</span>`).join('<span class="sep"> • </span>');
  el.innerHTML = `<div class="marquee">${contents}</div>`;
}

function renderTTSList(strings){
  ttsList = strings.slice();
}

// Notices render: each notice as a card with "Send Now" button
function renderNotices(notices){
  const container = document.getElementById('noticeSlides');
  container.innerHTML = '';
  if(!notices || !notices.length){ container.innerHTML = '<p>No notices found.</p>'; return; }
  notices.forEach(n => {
    const card = document.createElement('article');
    card.className = 'notice-card';
    const h = document.createElement('h4'); h.textContent = n.subject;
    const p = document.createElement('p'); p.innerHTML = n.body;
    card.appendChild(h); card.appendChild(p);
    if(n.reglink){
      const a = document.createElement('a'); a.href = n.reglink; a.target = '_blank'; a.textContent = 'Register';
      card.appendChild(a);
    }
    const btn = document.createElement('button');
    btn.textContent = 'Send Now';
    btn.className = 'btn-send';
    btn.onclick = function(){
      if(!confirm('Send this notice now to all students?')) return;
      google.script.run.withSuccessHandler(resp => {
        alert('Send result: ' + JSON.stringify(resp));
      }).sendEmailsImmediately(n.row);
    };
    card.appendChild(btn);
    container.appendChild(card);
  });
}

// Countdown
function renderCountdown(raw){
  const display = document.getElementById('countdownDisplay');
  if(!raw){ display.textContent = 'No target date set in A4'; return; }
  const dt = parseDateTime(raw);
  if(!dt){ display.textContent = 'Invalid date format in A4'; return; }
  startCountdown(dt, display);
}

function startCountdown(targetDate, displayEl){
  function update(){
    const now = new Date();
    let diff = Math.max(0, Math.floor((targetDate - now)/1000)); // seconds
    const days = Math.floor(diff / (24*3600));
    diff -= days*24*3600;
    const hours = Math.floor(diff / 3600);
    diff -= hours*3600;
    const mins = Math.floor(diff/60);
    const secs = diff % 60;
    displayEl.textContent = `${pad(days)}d : ${pad(hours)}h : ${pad(mins)}m : ${pad(secs)}s`;
    if(targetDate - now <= 0) clearInterval(timer);
  }
  update();
  const timer = setInterval(update, 1000);
}

function pad(n){ return String(n).padStart(2,'0'); }

function parseDateTime(s){
  const str = s.trim();
  const parts = str.split(' ');
  const dateParts = parts[0].split('-').map(Number);
  if(dateParts.length !== 3) return null;
  let hour = 0, minute = 0;
  if(parts[1]){
    const t = parts[1].split(':').map(Number);
    hour = t[0] || 0;
    minute = t[1] || 0;
  }
  return new Date(dateParts[0], dateParts[1]-1, dateParts[2], hour, minute, 0);
}

// TTS controls
function ttsPlay(){
  if(ttsPlaying) return;
  if(!ttsList.length) return alert('No strings found in row 2 to read.');
  ttsPlaying = true; ttsIndex = 0;
  speakNext();
}

function speakNext(){
  if(!ttsPlaying) return;
  if(ttsIndex >= ttsList.length){ ttsPlaying = false; return; }
  const text = ttsList[ttsIndex++];
  const utter = new SpeechSynthesisUtterance(text);
  // try Bengali locale first, fallback to default
  utter.lang = 'bn-BD';
  utter.onend = () => setTimeout(speakNext, 400);
  synth.speak(utter);
}

function ttsPause(){
  ttsPlaying = false;
  synth.cancel();
}

function escapeHtml(s){
  return s.replace(/[&<>"']/g, function(m){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
  });
}

// init when page loaded in Apps Script environment
if(window.google && google.script && google.script.run){
  window.addEventListener('load', init);
} else {
  console.warn('google.script.run is not available here (this file must be served by Google Apps Script).');
}
