const timerElement = document.getElementById("timer");
const button = document.getElementById("toggleButton");
const grid = document.getElementById("grid");
let stepCount = 0;
let roundCount = 0;

let timerInterval;
let secondsElapsed = 0;
let isRunning = false;

function startTimer() {
  clearInterval(timerInterval);
  secondsElapsed = 0;
  timerElement.textContent = formatTime(secondsElapsed);

  timerInterval = setInterval(() => {
    secondsElapsed++;
    timerElement.textContent = formatTime(secondsElapsed);
  }, 1000);
  stepCount = 0;
  document.getElementById("winMessage").classList.add("hidden");
}

function stopTimer() {
  clearInterval(timerInterval);
  secondsElapsed = 0;
  timerElement.textContent = formatTime(secondsElapsed);
}

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function shuffleBoxes(times = 100) {
  const boxes = Array.from(grid.children);

  for (let i = 0; i < times; i++) {
    const a = Math.floor(Math.random() * boxes.length);
    const b = Math.floor(Math.random() * boxes.length);

    grid.insertBefore(boxes[a], boxes[b]);
    boxes.splice(b, 0, boxes.splice(a, 1)[0]);
  }
}

button.addEventListener("click", () => {
  if (!isRunning) {
    startTimer();
    shuffleBoxes(100);
    button.textContent = "Kết thúc";
    button.className = "button end";
    isRunning = true;
  } else {
    stopTimer();
    button.textContent = "Bắt đầu";
    button.className = "button start";
    isRunning = false;
  }
});
const ROWS = 3;
const COLS = 4;

function getBoxes() {
  return Array.from(grid.children);
}

function getBlackIndex() {
  const boxes = getBoxes();
  return boxes.findIndex((box) => box.classList.contains("black-box"));
}

function swap(index1, index2) {
  const boxes = getBoxes();
  if (
    index1 < 0 ||
    index2 < 0 ||
    index1 >= boxes.length ||
    index2 >= boxes.length
  )
    return;

  const temp = boxes[index1].cloneNode(true);
  const blackBox = boxes[index1];
  const targetBox = boxes[index2];

  const parent = blackBox.parentNode;
  parent.replaceChild(temp, blackBox);
  parent.replaceChild(blackBox, targetBox);
  parent.replaceChild(targetBox, temp);
}

function moveBlackBox(direction) {
  const index = getBlackIndex();
  const row = Math.floor(index / COLS);
  const col = index % COLS;

  let targetIndex = -1;

  switch (direction) {
    case "left":
      if (col > 0) targetIndex = index - 1;
      break;
    case "right":
      if (col < COLS - 1) targetIndex = index + 1;
      break;
    case "up":
      if (row > 0) targetIndex = index - COLS;
      break;
    case "down":
      if (row < ROWS - 1) targetIndex = index + COLS;
      break;
  }

  if (targetIndex !== -1) {
    swap(index, targetIndex);
    stepCount++;

    if (checkWin()) {
      document.getElementById("winMessage").classList.remove("hidden");
      logHistory();
      isRunning = false;
      clearInterval(timerInterval);
      button.textContent = "Bắt đầu";
      button.className = "button start";
    }
  }
}

document.addEventListener("keydown", (e) => {
  if (isRunning) {
    switch (e.key.toLowerCase()) {
      case "a":
        moveBlackBox("left");
        break;
      case "d":
        moveBlackBox("right");
        break;
      case "w":
        moveBlackBox("up");
        break;
      case "s":
        moveBlackBox("down");
        break;
    }
  }
});
function checkWin() {
  const boxes = getBoxes();

  for (let i = 0; i < boxes.length - 1; i++) {
    const value = boxes[i].textContent.trim();
    if (parseInt(value) !== i + 1) {
      return false;
    }
  }

  return boxes[boxes.length - 1].classList.contains("black-box");
}
function logHistory() {
  roundCount++;

  const tbody = document.getElementById("historyBody");
  const row = document.createElement("tr");
  row.innerHTML = `
      <td>${roundCount}</td>
      <td>${stepCount}</td>
      <td>${formatTime(secondsElapsed)}</td>
    `;
  tbody.appendChild(row);
}