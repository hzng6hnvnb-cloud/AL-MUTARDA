/* =========================================
   المطاردة - نظام اللعبة
========================================= */


/* =========================
   عناصر الصفحة
========================= */

const introScreen = document.getElementById("introScreen");
const difficultyScreen = document.getElementById("difficultyScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

const player = document.getElementById("player");
const bot = document.getElementById("bot");

const timerElement = document.getElementById("timer");

const difficultyText =
    document.getElementById("difficultyText");

const taskCounter =
    document.getElementById("taskCounter");

const interactionBox =
    document.getElementById("interactionBox");

const interactionText =
    document.getElementById("interactionText");

const escapeGate =
    document.getElementById("escapeGate");


/* =========================
   إعداد اللعبة
========================= */

let gameRunning = false;

let currentDifficulty = "easy";

let timeLeft = 120;

let timerInterval = null;

let animationFrame = null;


/* اللاعب */

let playerX = 470;
let playerY = 440;


/* المطارد */

let botX = 1050;
let botY = 500;


/* الحركة */

const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};


/* المهمة القريبة */

let currentTask = -1;


/* حالة المهام */

let tasks = [
    false,
    false,
    false,
    false
];


/* سرعة اللاعب */

const playerSpeed = 4;


/* سرعات الروبوت */

const botSpeeds = {
    easy: 1.05,
    medium: 1.55,
    hard: 2.05,
    impossible: 2.7
};


/* أسماء الصعوبة */

const difficultyNames = {
    easy: "سهل",
    medium: "متوسط",
    hard: "صعب",
    impossible: "مستحيل"
};


/* =========================
   دخول اللعبة
========================= */

function showDifficulty() {

    introScreen.classList.add("hidden");

    difficultyScreen.classList.remove("hidden");

}


/* =========================
   بدء اللعبة
========================= */

function startGame(difficulty) {

    currentDifficulty = difficulty;

    difficultyScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");

    difficultyText.textContent =
        difficultyNames[difficulty];

    resetGame();

    gameRunning = true;

    startTimer();

    gameLoop();

}


/* =========================
   إعادة ضبط اللعبة
========================= */

function resetGame() {

    timeLeft = 120;

    playerX = 470;
    playerY = 440;

    botX = 1050;
    botY = 500;

    currentTask = -1;

    tasks = [
        false,
        false,
        false,
        false
    ];

    timerElement.textContent = "02:00";

    timerElement.classList.remove("warning");

    taskCounter.textContent = "0 / 4";

    interactionBox.style.display = "none";

    escapeGate.classList.remove("open");


    for (let i = 0; i < 4; i++) {

        document
            .getElementById("task" + i)
            .classList.remove("completed");

        document
            .getElementById("taskLocation" + i)
            .classList.remove("completedLocation");

    }


    updatePositions();

}


/* =========================
   المؤقت
========================= */

function startTimer() {

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        if (!gameRunning) {
            return;
        }

        timeLeft--;

        updateTimerDisplay();


        if (timeLeft <= 20) {

            timerElement.classList.add("warning");

        }


        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            loseGame(
                "انتهى الوقت ولم تنهِ جميع المهام."
            );

        }

    }, 1000);

}


function updateTimerDisplay() {

    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        timeLeft % 60;

    timerElement.textContent =
        String(minutes).padStart(2, "0")
        + ":"
        +
        String(seconds).padStart(2, "0");

}


/* =========================
   لوحة المفاتيح
========================= */

document.addEventListener("keydown", function(event) {

    const key = event.key.toLowerCase();

    if (key === "w" || event.key === "ArrowUp") {
        keys.up = true;
    }

    if (key === "s" || event.key === "ArrowDown") {
        keys.down = true;
    }

    if (key === "a" || event.key === "ArrowLeft") {
        keys.left = true;
    }

    if (key === "d" || event.key === "ArrowRight") {
        keys.right = true;
    }

});


document.addEventListener("keyup", function(event) {

    const key = event.key.toLowerCase();

    if (key === "w" || event.key === "ArrowUp") {
        keys.up = false;
    }

    if (key === "s" || event.key === "ArrowDown") {
        keys.down = false;
    }

    if (key === "a" || event.key === "ArrowLeft") {
        keys.left = false;
    }

    if (key === "d" || event.key === "ArrowRight") {
        keys.right = false;
    }

});


/* =========================
   أزرار الجوال
========================= */

function setupMobileButton(id, direction) {

    const button = document.getElementById(id);


    button.addEventListener(
        "touchstart",
        function(event) {

            event.preventDefault();

            keys[direction] = true;

        },
        { passive: false }
    );


    button.addEventListener(
        "touchend",
        function(event) {

            event.preventDefault();

            keys[direction] = false;

        },
        { passive: false }
    );


    button.addEventListener(
        "touchcancel",
        function() {

            keys[direction] = false;

        }
    );


    button.addEventListener(
        "mousedown",
        function() {

            keys[direction] = true;

        }
    );


    button.addEventListener(
        "mouseup",
        function() {

            keys[direction] = false;

        }
    );


    button.addEventListener(
        "mouseleave",
        function() {

            keys[direction] = false;

        }
    );

}


setupMobileButton("upButton", "up");
setupMobileButton("downButton", "down");
setupMobileButton("leftButton", "left");
setupMobileButton("rightButton", "right");


/* =========================
   تحريك اللاعب
========================= */

function movePlayer() {

    if (!gameRunning) {
        return;
    }


    let newX = playerX;
    let newY = playerY;


    if (keys.up) {
        newY -= playerSpeed;
    }

    if (keys.down) {
        newY += playerSpeed;
    }

    if (keys.left) {
        newX -= playerSpeed;
    }

    if (keys.right) {
        newX += playerSpeed;
    }


    /* حدود العالم */

    newX = Math.max(
        10,
        Math.min(1348, newX)
    );

    newY = Math.max(
        10,
        Math.min(798, newY)
    );


    playerX = newX;
    playerY = newY;


    updatePositions();

}


/* =========================
   حركة المطارد
========================= */

function moveBot() {

    if (!gameRunning) {
        return;
    }


    const dx =
        playerX - botX;

    const dy =
        playerY - botY;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    const speed =
        botSpeeds[currentDifficulty];


    /*
       في المستوى السهل
       لا يبدأ المطاردة إلا إذا اقترب اللاعب
    */

    let detectionRange = 520;


    if (currentDifficulty === "easy") {
        detectionRange = 430;
    }

    if (currentDifficulty === "medium") {
        detectionRange = 520;
    }

    if (currentDifficulty === "hard") {
        detectionRange = 650;
    }

    if (currentDifficulty === "impossible") {
        detectionRange = 800;
    }


    if (distance < detectionRange) {

        if (Math.abs(dx) > 3) {

            botX +=
                Math.sign(dx) * speed;

        }


        if (Math.abs(dy) > 3) {

            botY +=
                Math.sign(dy) * speed;

        }

    }


    botX = Math.max(
        10,
        Math.min(1348, botX)
    );

    botY = Math.max(
        10,
        Math.min(798, botY)
    );


    updatePositions();


    /*
       إذا اقترب المطارد منك
    */

    if (distance < 42) {

        loseGame(
            "المطارد أمسك بك قبل أن تنهي المهام."
        );

    }

}


/* =========================
   تحديث أماكن الشخصيات
========================= */

function updatePositions() {

    player.style.left =
        playerX + "px";

    player.style.top =
        playerY + "px";


    bot.style.left =
        botX + "px";

    bot.style.top =
        botY + "px";

}


/* =========================
   فحص المهام القريبة
========================= */

function checkNearbyTasks() {

    currentTask = -1;


    for (let i = 0; i < 4; i++) {

        if (tasks[i]) {
            continue;
        }


        const location =
            document.getElementById(
                "taskLocation" + i
            );


        const taskX =
            location.offsetLeft + 34;

        const taskY =
            location.offsetTop + 34;


        const dx =
            playerX - taskX;

        const dy =
            playerY - taskY;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (distance < 90) {

            currentTask = i;

            showTaskInteraction(i);

            return;

        }

    }


    interactionBox.style.display =
        "none";

}


/* =========================
   إظهار زر المهمة
========================= */

function showTaskInteraction(index) {

    const names = [
        "إصلاح المولد",
        "تشغيل الكهرباء",
        "جمع بطاقة الخروج",
        "فتح بوابة الهروب"
    ];


    interactionText.textContent =
        "أنت قريب من: " + names[index];


    interactionBox.style.display =
        "block";

}


/* =========================
   تنفيذ المهمة
========================= */

function completeCurrentTask() {

    if (currentTask === -1) {
        return;
    }


    if (tasks[currentTask]) {
        return;
    }


    tasks[currentTask] = true;


    const taskElement =
        document.getElementById(
            "task" + currentTask
        );


    const location =
        document.getElementById(
            "taskLocation" + currentTask
        );


    taskElement.classList.add(
        "completed"
    );


    taskElement
        .querySelector(".taskCheck")
        .textContent = "✓";


    location.classList.add(
        "completedLocation"
    );


    const completedCount =
        tasks.filter(Boolean).length;


    taskCounter.textContent =
        completedCount + " / 4";


    interactionBox.style.display =
        "none";


    currentTask = -1;


    /*
       إذا انتهت كل المهام
    */

    if (completedCount === 4) {

        escapeGate.classList.add("open");

    }

}


/* =========================
   فحص بوابة الهروب
========================= */

function checkEscape() {

    if (!tasks.every(Boolean)) {
        return;
    }


    const gateX =
        escapeGate.offsetLeft + 45;

    const gateY =
        escapeGate.offsetTop + 62;


    const dx =
        playerX - gateX;

    const dy =
        playerY - gateY;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (distance < 115) {

        winGame();

    }

}


/* =========================
   حلقة اللعبة
========================= */

function gameLoop() {

    if (!gameRunning) {
        return;
    }


    movePlayer();

    moveBot();

    checkNearbyTasks();

    checkEscape();


    animationFrame =
        requestAnimationFrame(
            gameLoop
        );

}


/* =========================
   الفوز
========================= */

function winGame() {

    if (!gameRunning) {
        return;
    }


    gameRunning = false;

    clearInterval(timerInterval);

    cancelAnimationFrame(animationFrame);


    resultScreen.classList.remove(
        "hidden"
    );


    document.getElementById(
        "resultIcon"
    ).textContent = "🏆";


    document.getElementById(
        "resultTitle"
    ).textContent = "نجحت!";


    document.getElementById(
        "resultMessage"
    ).textContent =
        "أنهيت جميع المهام وهربت قبل انتهاء الوقت.";

}


/* =========================
   الخسارة
========================= */

function loseGame(reason) {

    if (!gameRunning) {
        return;
    }


    gameRunning = false;

    clearInterval(timerInterval);

    cancelAnimationFrame(animationFrame);


    resultScreen.classList.remove(
        "hidden"
    );


    document.getElementById(
        "resultIcon"
    ).textContent = "☠️";


    document.getElementById(
        "resultTitle"
    ).textContent = "خسرت";


    document.getElementById(
        "resultMessage"
    ).textContent = reason;

}


/* =========================
   الخروج
========================= */

function exitGame() {

    gameRunning = false;

    clearInterval(timerInterval);

    cancelAnimationFrame(animationFrame);

    location.reload();

}
