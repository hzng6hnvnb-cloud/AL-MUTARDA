let currentRoom = null;
let currentName = null;
let selectedMode = "single";

const introScreen = document.getElementById("introScreen");
const modeScreen = document.getElementById("modeScreen");
const mainApp = document.getElementById("mainApp");

const createModal = document.getElementById("createModal");
const joinModal = document.getElementById("joinModal");

const roomScreen = document.getElementById("roomScreen");
const loadingScreen = document.getElementById("loadingScreen");
const gameScreen = document.getElementById("gameScreen");


/* ========================= */
/* دخول اللعبة */
/* ========================= */

function enterGame() {

    introScreen.classList.add("hide");

    setTimeout(() => {

        introScreen.style.display = "none";

        modeScreen.style.display = "block";

        requestAnimationFrame(() => {
            modeScreen.classList.add("active");

            setTimeout(() => {
                modeScreen.classList.add("show");
            }, 30);

        });

    }, 750);
}


/* ========================= */
/* اختيار نمط اللعب */
/* ========================= */

function selectMode(mode) {

    selectedMode = mode;

    modeScreen.classList.remove("show");

    setTimeout(() => {

        modeScreen.style.display = "none";

        if (mode === "single") {

            startSinglePlayer();

        } else {

            openCreate();

        }

    }, 550);
}


/* ========================= */
/* اللعب الفردي */
/* ========================= */

function startSinglePlayer() {

    selectedMode = "single";

    showLoading("جاري تجهيز المطارد...");

}


/* ========================= */
/* نافذة إنشاء الغرفة */
/* ========================= */

function openCreate() {

    createModal.classList.add("active");

    setTimeout(() => {

        document
            .getElementById("createName")
            .focus();

    }, 100);

}


/* ========================= */
/* نافذة دخول الغرفة */
/* ========================= */

function openJoin() {

    joinModal.classList.add("active");

    setTimeout(() => {

        document
            .getElementById("joinName")
            .focus();

    }, 100);

}


/* ========================= */
/* إغلاق النوافذ */
/* ========================= */

function closeModals() {

    createModal.classList.remove("active");
    joinModal.classList.remove("active");

}


/* ========================= */
/* إنشاء كود الغرفة */
/* ========================= */

function generateCode() {

    return Math
        .floor(
            100000 +
            Math.random() * 900000
        )
        .toString();

}


/* ========================= */
/* إنشاء غرفة */
/* ========================= */

function createRoom() {

    const nameInput =
        document.getElementById("createName");

    const name =
        nameInput.value.trim();

    if (!name) {

        nameInput.focus();

        nameInput.style.borderColor =
            "#ff3d5a";

        return;

    }

    currentName = name;
    currentRoom = generateCode();

    openRoom();

}


/* ========================= */
/* دخول غرفة */
/* ========================= */

function joinRoom() {

    const nameInput =
        document.getElementById("joinName");

    const codeInput =
        document.getElementById("roomCode");

    const name =
        nameInput.value.trim();

    const code =
        codeInput.value.trim();

    if (!name) {

        nameInput.focus();

        return;

    }

    if (code.length !== 6) {

        codeInput.focus();

        codeInput.style.borderColor =
            "#ff3d5a";

        return;

    }

    currentName = name;
    currentRoom = code;

    openRoom();

}


/* ========================= */
/* فتح الغرفة */
/* ========================= */

function openRoom() {

    closeModals();

    document
        .getElementById("displayCode")
        .textContent = currentRoom;

    document
        .getElementById("myName")
        .textContent = currentName;

    roomScreen.classList.add("active");

    document.body.style.overflow =
        "hidden";

}


/* ========================= */
/* مغادرة الغرفة */
/* ========================= */

function leaveRoom() {

    roomScreen.classList.remove("active");

    document.body.style.overflow = "";

    currentRoom = null;
    currentName = null;

}


/* ========================= */
/* بدء الجولة */
/* ========================= */

function startGame() {

    selectedMode = "multi";

    showLoading(
        "جاري تجهيز الجولة الجماعية..."
    );

}


/* ========================= */
/* شاشة التحميل */
/* ========================= */

function showLoading(text) {

    document
        .querySelector(".loading-title")
        .textContent = text;

    loadingScreen.classList.add("active");

    let progress = 0;

    const bar =
        document.getElementById(
            "loadingProgress"
        );

    const interval =
        setInterval(() => {

            progress += Math.random() * 12;

            if (progress >= 100) {

                progress = 100;

                clearInterval(interval);

                setTimeout(() => {

                    loadingScreen.classList.remove(
                        "active"
                    );

                    openGame();

                }, 400);

            }

            bar.style.width =
                progress + "%";

        }, 150);

}


/* ========================= */
/* فتح اللعبة */
/* ========================= */

function openGame() {

    roomScreen.classList.remove("active");

    gameScreen.classList.add("active");

    if (selectedMode === "multi") {

        document
            .getElementById("gameModeTitle")
            .textContent =
            "لعب جماعي";

    } else {

        document
            .getElementById("gameModeTitle")
            .textContent =
            "لعب فردي";

    }

    startTimer();

}


/* ========================= */
/* المؤقت */
/* ========================= */

let timerInterval;

function startTimer() {

    clearInterval(timerInterval);

    let seconds = 120;

    const timer =
        document.getElementById("timer");

    timerInterval =
        setInterval(() => {

            if (seconds <= 0) {

                clearInterval(timerInterval);

                timer.textContent =
                    "00:00";

                return;

            }

            seconds--;

            const minutes =
                Math.floor(seconds / 60);

            const remaining =
                seconds % 60;

            timer.textContent =
                String(minutes).padStart(2, "0")
                + ":" +
                String(remaining).padStart(2, "0");

        }, 1000);

}


/* ========================= */
/* الخروج من اللعبة */
/* ========================= */

function exitGame() {

    clearInterval(timerInterval);

    gameScreen.classList.remove(
        "active"
    );

    modeScreen.style.display = "block";

    setTimeout(() => {

        modeScreen.classList.add("active");

        requestAnimationFrame(() => {

            modeScreen.classList.add("show");

        });

    }, 50);

}


/* ========================= */
/* زر Escape */
/* ========================= */

window.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeModals();

        }

    }
);


/* ========================= */
/* الضغط خارج النافذة */
/* ========================= */

createModal.addEventListener(
    "click",
    function(event) {

        if (event.target === createModal) {

            closeModals();

        }

    }
);


joinModal.addEventListener(
    "click",
    function(event) {

        if (event.target === joinModal) {

            closeModals();

        }

    }
);
