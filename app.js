let currentRoom = null;
let currentName = null;

const createModal = document.getElementById("createModal");
const joinModal = document.getElementById("joinModal");
const roomScreen = document.getElementById("roomScreen");

function openCreate() {
    createModal.classList.add("active");
    setTimeout(() => {
        document.getElementById("createName").focus();
    }, 100);
}

function openJoin() {
    joinModal.classList.add("active");
    setTimeout(() => {
        document.getElementById("joinName").focus();
    }, 100);
}

function closeModals() {
    createModal.classList.remove("active");
    joinModal.classList.remove("active");
}

function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function createRoom() {

    const nameInput = document.getElementById("createName");

    const name = nameInput.value.trim();

    if (!name) {
        nameInput.focus();
        nameInput.style.borderColor = "#ff3d5a";
        return;
    }

    currentName = name;
    currentRoom = generateCode();

    openRoom();
}

function joinRoom() {

    const nameInput = document.getElementById("joinName");
    const codeInput = document.getElementById("roomCode");

    const name = nameInput.value.trim();
    const code = codeInput.value.trim();

    if (!name) {
        nameInput.focus();
        return;
    }

    if (code.length !== 6) {
        codeInput.focus();
        codeInput.style.borderColor = "#ff3d5a";
        return;
    }

    currentName = name;
    currentRoom = code;

    openRoom();
}

function openRoom() {

    closeModals();

    document.getElementById("displayCode").textContent = currentRoom;
    document.getElementById("myName").textContent = currentName;

    roomScreen.classList.add("active");

    document.body.style.overflow = "hidden";
}

function leaveRoom() {

    roomScreen.classList.remove("active");

    document.body.style.overflow = "";

    currentRoom = null;
    currentName = null;
}

function startGame() {

    const button = document.querySelector(".start-btn");

    button.textContent = "جاري تجهيز الجولة...";

    setTimeout(() => {

        button.textContent = "الجولة جاهزة 🔥";

        setTimeout(() => {
            alert("هنا تبدأ الخريطة والجولة الفعلية — المرحلة القادمة.");
            button.textContent = "ابدأ الجولة";
        }, 700);

    }, 1000);
}

window.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        closeModals();
    }

});

createModal.addEventListener("click", function(event) {

    if (event.target === createModal) {
        closeModals();
    }

});

joinModal.addEventListener("click", function(event) {

    if (event.target === joinModal) {
        closeModals();
    }

});
