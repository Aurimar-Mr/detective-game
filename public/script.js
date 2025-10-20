let currentCaseIndex = 0;
let completedCases = new Set();
let cases = [];

// ---------------- Fetch cases from backend ----------------
async function fetchCases() {
  const res = await fetch("/api/cases");
  cases = await res.json();
}

// ---------------- Shuffle ----------------
function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

// ---------------- Load Case ----------------
async function loadCase(caseId) {
  const data = cases.find(c => c.id === caseId);
  if (!data) return;

  document.getElementById("clue").innerText = `Clue (${data.time_of_crime}): ${data.clue}`;
  document.getElementById("scene-img").src = "img/" + data.image;

  const wordsContainer = document.getElementById("words");
  wordsContainer.innerHTML = "";

  // Limpiar el sentence box al cambiar de escena
  document.getElementById("sentence-box").innerHTML = "Drag the words here to form the sentence";

  // Mezclar palabras antes de mostrarlas
  const shuffledWords = shuffle([...data.words]);

  shuffledWords.forEach(word => {
    const span = document.createElement("span");
    span.innerText = word;
    span.className = "word-pill";
    span.draggable = true;
    span.dataset.word = word;
    span.addEventListener("dragstart", dragStart);
    wordsContainer.appendChild(span);
  });

  window.currentCase = data;
}

// ---------------- Drag & Drop ----------------
function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.dataset.word);
  e.dataTransfer.effectAllowed = "move";
  e.target.classList.add("opacity-50");
  setTimeout(() => e.target.classList.add("hidden"), 0);
}

function dragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add("drag-over");
}

function dragLeave(e) {
  e.currentTarget.classList.remove("drag-over");
}

function drop(e) {
  e.preventDefault();
  const word = e.dataTransfer.getData("text/plain");
  const span = document.querySelector(`[data-word="${word}"].hidden`);
  if (span) {
    e.currentTarget.appendChild(span);
    span.classList.remove("hidden", "opacity-50");
  }
  e.currentTarget.classList.remove("drag-over");
}

document.querySelectorAll(".drop-zone").forEach(zone => {
  zone.addEventListener("dragover", dragOver);
  zone.addEventListener("dragleave", dragLeave);
  zone.addEventListener("drop", drop);
});

// ---------------- Sentence ----------------
function getSentence() {
  const sentenceBox = document.getElementById("sentence-box");
  return Array.from(sentenceBox.querySelectorAll(".word-pill"))
    .map(el => el.dataset.word)
    .join(" ");
}

// ---------------- Notification ----------------
function showNotification(message, success = true) {
  const notif = document.getElementById("notification");
  const notifText = document.getElementById("notification-text");
  notifText.innerText = message;
  notifText.className = success ? "text-green-400 text-lg font-bold"
                                : "text-red-400 text-lg font-bold";
  notif.classList.remove("hidden");
}

function hideNotification() {
  document.getElementById("notification").classList.add("hidden");
}

// ---------------- Verify ----------------
async function verifySentence() {
  const sentence = getSentence();
  const res = await fetch("/api/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ caseId: window.currentCase.id, sentence })
  });
  const result = await res.json();

  if (result.correct) {
    completedCases.add(window.currentCase.id);
    updateCaseFiles();
    showNotification(" Correct! Evidence points earned.", true);
  } else {
    showNotification(" Incorrect. Try again.", false);
  }
}

// ---------------- Case Files ----------------
function updateCaseFiles() {
  const caseFilesContainer = document.getElementById("case-files-list");
  if (!caseFilesContainer) return;

  caseFilesContainer.innerHTML = "";

  cases.forEach(c => {
    const card = document.createElement("div");
    card.className =
      "relative bg-gray-900 rounded-xl border border-gray-700 shadow-lg overflow-hidden w-60 flex-shrink-0 cursor-pointer hover:scale-105 transform transition";

    // Imagen del caso
    const img = document.createElement("img");
    img.src = "img/" + c.image;
    img.className = "h-32 w-full object-cover";

    // Contenedor de texto
    const body = document.createElement("div");
    body.className = "p-3";

    const title = document.createElement("h3");
    title.className = "text-yellow-400 font-bold text-lg mb-2";
    title.innerText = `Case ${c.id}`;

    const clue = document.createElement("p");
    clue.className = "text-gray-300 text-sm";
    clue.innerText = c.clue;

    body.appendChild(title);
    body.appendChild(clue);

    if (completedCases.has(c.id)) {
      const resolvedNote = document.createElement("div");
      resolvedNote.innerText = "Resolved";
      resolvedNote.className =
        "absolute top-2 left-2 bg-yellow-300 text-black font-bold px-2 py-1 rounded rotate-[-6deg] shadow-md border border-yellow-600";
      card.appendChild(resolvedNote);
    }

    card.onclick = () => {
      currentCaseIndex = cases.findIndex(x => x.id === c.id);
      loadCase(c.id);
      document.getElementById("case-files-screen").classList.add("hidden");
      document.getElementById("crime-scene-screen").classList.remove("hidden");
    };

    card.appendChild(img);
    card.appendChild(body);
    caseFilesContainer.appendChild(card);
  });
}

// ---------------- Navigation ----------------
document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("crime-scene-screen").classList.remove("hidden");
  currentCaseIndex = 0;
  loadCase(cases[currentCaseIndex].id);
});

document.getElementById("back-btn").addEventListener("click", () => {
  document.getElementById("crime-scene-screen").classList.add("hidden");
  document.getElementById("case-files-screen").classList.remove("hidden");
  updateCaseFiles();
});

document.getElementById("case-files-btn").addEventListener("click", () => {
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("case-files-screen").classList.remove("hidden");
  updateCaseFiles();
});

document.getElementById("back-to-start").addEventListener("click", () => {
  document.getElementById("case-files-screen").classList.add("hidden");
  document.getElementById("start-screen").classList.remove("hidden");
});

document.getElementById("notification-btn").addEventListener("click", () => {
  hideNotification();
  if (completedCases.has(window.currentCase.id)) {
    currentCaseIndex++;
    if (currentCaseIndex < cases.length) {
      loadCase(cases[currentCaseIndex].id);
    } else {
      showNotification(" All cases solved! Well done, Detective.", true);
    }
  }
});

fetchCases();
