import iconsFiles from "./icons.js"; // array with icons
let iconsArr = [...iconsFiles]; // Copy of array with icons

// DOM
const iconsContainer = document.querySelector(".icons_container");
const playButton = document.querySelector("#play_button");
const stopButton = document.querySelector("#stop_button");
const resetButton = document.querySelector("#reset_button");
const easyButton = document.querySelector("#easy");
const mediumButton = document.querySelector("#medium");
const hardButton = document.querySelector("#hard");
const expertButton = document.querySelector("#expert");
const nickName = document.querySelector("#input_nickname");
const tableScore = document.querySelector(".table_score");

const tezine = document.querySelectorAll("input[name= 'levels']");
let selektovanaTezina = null;

let brojPogodjenih = 0;

// Array permutation
function randomize(niz) {
  for (let i = niz.length - 1; i >= 0; i--) {
    let z = niz[i];
    let indeksZaMenjanje = Math.floor(Math.random() * i);
    niz[i] = niz[indeksZaMenjanje];
    niz[indeksZaMenjanje] = z;
  }
}

// Display of images / icons
function prikazSlika(tezina) {
  iconsContainer.innerHTML = "";

  for (let i = 1; i <= tezina ** 2; i++) {
    const img = document.createElement("img");
    img.src = "icons/other_icons/stamp-svgrepo-com.svg";
    img.id = i - 1;
    img.alt = "image_cover";

    if (tezina === 10) {
      img.style = "width: 70px";
    }

    iconsContainer.appendChild(img);
    iconsContainer.style.gridTemplateColumns = `repeat(${tezina}, 1fr)`; // CHANGE GRID COLUMNS
  }
}

////////////   START/STOP/RESET GAME   /////////////
let startGame = false;

let timer; // Main timer
let t;
let timePassed;

function startGameFunc() {
  timePassed = "";
  t = 0;
  iconsArr = [...iconsFiles.slice(0, Number(selektovanaTezina.value) ** 2)]; // Reduction of array length
  randomize(iconsArr); // RANDOM NIZ

  prikazSlika(Number(selektovanaTezina.value)); // Display icons

  if (nickName.value !== "") {
    playButton.classList.add("display_none");
    iconsContainer.style.opacity = "1";
    if (timer === undefined) {
      timer = setInterval(() => {
        t++;
        let minutes = t < 60 ? 0 : Math.floor(t / 60);
        let seconds = t < 60 ? t : t % 60;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        timePassed = `${minutes}:${seconds}`;
        document.getElementById("time").innerHTML = `Time: ${timePassed}`;
      }, 1000);
    }
    startGame = true;
    document.getElementById("time_icon").classList.remove("time_stop");

    brojPogodjenih = 0;
  } else {
    alert("Please Input Your Nickname");
  }
}

playButton.addEventListener("click", () => {
  startGameFunc();
});

document.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    startGameFunc();
  }
});

function stopGame() {
  playButton.classList.remove("display_none");
  iconsContainer.style.opacity = "0.4";
  clearInterval(timer);
  timer = undefined;
  startGame = false;
  document.getElementById("time_icon").classList.add("time_stop");
}

stopButton.addEventListener("click", () => {
  stopGame();
});

resetButton.addEventListener("click", () => {
  startGameFunc();
});

// Selected difficulty level
function izborTezine() {
  document.getElementById("time").innerHTML = "Time:";
  stopGame();
  tezine.forEach(t => {
    if (t.checked) {
      selektovanaTezina = t;
    }
  });

  prikazSlika(Number(selektovanaTezina.value));
}

izborTezine(); // Function call when page is loaded

easyButton.addEventListener("click", () => {
  izborTezine();
});
mediumButton.addEventListener("click", () => {
  izborTezine();
});
hardButton.addEventListener("click", () => {
  izborTezine();
});
expertButton.addEventListener("click", () => {
  izborTezine();
});

// LOCALSTORAGE
// Show game score depending on difficulty level
// If there are data in localStorage with specific key
let nizRezultata = [];
function localStoragePodaci(tezinaRezultat) {
  if (localStorage.getItem(tezinaRezultat) !== null) {
    nizRezultata = JSON.parse(localStorage.getItem(tezinaRezultat));

    let tableHTML =
      "<tr class='prvi_red'><td>Rang</td><td>Nickname</td><td>Time</td></tr>";
    nizRezultata.forEach((r, i) => {
      tableHTML += `<tr><td>${i + 1}.</td><td>${r[0]}</td><td>${
        r[1]
      }</td></tr>`;
    });

    tableScore.innerHTML = tableHTML;
  } else {
    let tableHTML =
      "<tr class='prvi_red'><td>Rang</td><td>Nickname</td><td>Time</td></tr>";
    tableScore.innerHTML = tableHTML;
  }
}
localStoragePodaci("easy_rezultat");

const easyDisplay = document.getElementById("easy_display");
const mediumDisplay = document.getElementById("medium_display");
const hardDisplay = document.getElementById("hard_display");
const expertDisplay = document.getElementById("expert_display");
easyDisplay.addEventListener("click", () => {
  localStoragePodaci("easy_rezultat");
  easyDisplay.classList.add("selected_score_button");
  mediumDisplay.classList.remove("selected_score_button");
  hardDisplay.classList.remove("selected_score_button");
  expertDisplay.classList.remove("selected_score_button");
});
mediumDisplay.addEventListener("click", () => {
  localStoragePodaci("medium_rezultat");
  easyDisplay.classList.remove("selected_score_button");
  mediumDisplay.classList.add("selected_score_button");
  hardDisplay.classList.remove("selected_score_button");
  expertDisplay.classList.remove("selected_score_button");
});
hardDisplay.addEventListener("click", () => {
  localStoragePodaci("hard_rezultat");
  easyDisplay.classList.remove("selected_score_button");
  mediumDisplay.classList.remove("selected_score_button");
  hardDisplay.classList.add("selected_score_button");
  expertDisplay.classList.remove("selected_score_button");
});
expertDisplay.addEventListener("click", () => {
  localStoragePodaci("expert_rezultat");
  easyDisplay.classList.remove("selected_score_button");
  mediumDisplay.classList.remove("selected_score_button");
  hardDisplay.classList.remove("selected_score_button");
  expertDisplay.classList.add("selected_score_button");
});

// Set results in table and localStorage
function ispisRezultata() {
  nizRezultata.push([nickName.value, timePassed, t]);
  // Sort array by passed time
  nizRezultata.sort(function (a, b) {
    return a[2] - b[2];
  });

  if (Number(selektovanaTezina.value) === 4) {
    localStorage.setItem("easy_rezultat", JSON.stringify(nizRezultata));
  } else if (Number(selektovanaTezina.value) === 6) {
    localStorage.setItem("medium_rezultat", JSON.stringify(nizRezultata));
  } else if (Number(selektovanaTezina.value) === 8) {
    localStorage.setItem("hard_rezultat", JSON.stringify(nizRezultata));
  } else {
    localStorage.setItem("expert_rezultat", JSON.stringify(nizRezultata));
  }

  let tableHTML =
    "<tr class='prvi_red'><td>Rang</td><td>Nickname</td><td>Time</td></tr>";
  nizRezultata.forEach((r, i) => {
    tableHTML += `<tr><td>${i + 1}.</td><td>${r[0]}</td><td>${r[1]}</td></tr>`;
  });

  tableScore.innerHTML = tableHTML;
}

// Image on click events
let image1 = undefined;
let image2 = undefined;
let firstImageElement = null;

let firstImage = true;
let secondImageOpen = false;

iconsContainer.addEventListener("click", e => {
  const allIcons = document.querySelectorAll(".icons_container img");

  if (
    startGame &&
    secondImageOpen === false &&
    e.target.alt === "image_cover" // Check if icon is already open
  ) {
    if (e.target.tagName === "IMG") {
      e.target.alt = "opened_image";
      e.target.src = `icons/${iconsArr[e.target.id]}.svg`; // Otvara se slika bez obzira koja je po redu

      // 1. image - open 1. icon
      if (firstImage) {
        allIcons.forEach(img => {
          if (img.src === e.target.src) {
            firstImageElement = img;
            image1 = iconsArr[e.target.id];
          }
        });
        firstImage = false;

        // 2. image - open 2. icon
      } else {
        secondImageOpen = true;
        image2 = iconsArr[e.target.id];

        if (image1 !== image2) {
          // First and second icon are not similar
          setTimeout(() => {
            firstImageElement.src = "icons/other_icons/stamp-svgrepo-com.svg"; // Zatvara se prva slika
            e.target.src = "icons/other_icons/stamp-svgrepo-com.svg"; // Zatvara se druga slika
            secondImageOpen = false;
            firstImageElement.alt = "image_cover";
            e.target.alt = "image_cover";
          }, 600);
        } else {
          // First and second icon are similar
          secondImageOpen = false;
          brojPogodjenih++;

          // Game finished
          if (brojPogodjenih === Number(selektovanaTezina.value) ** 2 / 2) {
            stopGame();

            ispisRezultata();
            brojPogodjenih = 0;

            document.getElementById("results_img").src =
              "icons/other_icons/pedestal-svgrepo-com.svg";
            setTimeout(() => {
              document.getElementById("results_img").src =
                "icons/other_icons/racing-flag-svgrepo-com.svg";
            }, 1300);
          }
        }
        firstImage = true;
      }
    }
  }
});
