const API_URL = "https://script.google.com/macros/s/AKfycbzFe6fx6SMl2ie25JdeW972xaboj84hRXVP4MNmnk-8AUDyE0hqXRb-OeDGmigDcY46/exec"; // Paste Web App URL here

let newsData = [];
let newsIndex = 0;
let newsInterval;
let newsPlaying = false;

async function fetchData() {
  const res = await fetch(API_URL);
  const data = await res.json();

  newsData = data.news;
  displayNews();
  displayNotices(data.notices);
  setupCountdown(data.countdowns);
}

function displayNews() {
  const newsEl = document.getElementById("news-text");
  if(newsData.length > 0){
    newsEl.innerText = newsData[newsIndex];
  }
}

document.getElementById("play-btn").addEventListener("click", ()=>{
  if(!newsPlaying){
    newsInterval = setInterval(()=>{
      newsIndex = (newsIndex+1)%newsData.length;
      displayNews();
    },3000);
    newsPlaying = true;
  }
});

document.getElementById("pause-btn").addEventListener("click", ()=>{
  clearInterval(newsInterval);
  newsPlaying = false;
});

function displayNotices(notices){
  const noticeDiv = document.getElementById("notices");
  notices.forEach(n=>{
    const div = document.createElement("div");
    div.className = "notice";
    div.innerHTML = `<h3>${n[0]}</h3><p>${n[1]}</p>${n[2]? `<a href="${n[2]}">Register</a>` : ""}`;
    noticeDiv.appendChild(div);
  });
}

function setupCountdown(countdowns){
  const cdDiv = document.getElementById("countdown");
  if(countdowns.length===0) return;

  const targetDate = new Date(countdowns[0][0]);
  function updateCountdown(){
    const now = new Date();
    const diff = targetDate - now;
    if(diff<0){
      cdDiv.innerText = "The event has started!";
      return;
    }
    const days = Math.floor(diff/(1000*60*60*24));
    const hours = Math.floor((diff/(1000*60*60))%24);
    const mins = Math.floor((diff/(1000*60))%60);
    const secs = Math.floor((diff/1000)%60);
    cdDiv.innerText = `Countdown: ${days}d ${hours}h ${mins}m ${secs}s`;
  }
  setInterval(updateCountdown,1000);
  updateCountdown();
}

fetchData();
