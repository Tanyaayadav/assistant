// Voice Assistant Code (Your Existing Code)
let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "en-GB";
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    let day = new Date();
    let hours = day.getHours();
    
    if (hours >= 0 && hours < 12) {
        speak("Good Morning, Sir");
    } else if (hours >= 12 && hours < 16) {
        speak("Good Afternoon, Sir");
    } else {
        speak("Good Evening, Sir");
    }
}

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();

recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = (event) => {
    let transcript = event.results[0][0].transcript.toLowerCase();
    content.innerText = transcript;
    takeCommand(transcript);
};

recognition.onerror = (event) => {
    console.log("Speech recognition error:", event.error);
    speak("Sorry, I didn't catch that. Can you say it again?");
};

btn.addEventListener("click", () => {
    recognition.start();
    voice.style.display = "block";
    btn.style.display = "none";
});

function takeCommand(message) {
    voice.style.display = "none";
    btn.style.display = "flex";

    if (message.includes("hello") || message.includes("hey")) {
        speak("Hello sir, what can I help you with?");
    } else if (message.includes("who are you")) {
        speak("I am your virtual assistant, created by Ayush Sir.");
    } else if (message.includes("open youtube")) {
        speak("Opening YouTube...");
        window.open("https://youtube.com/", "_blank");
    } else if (message.includes("open google")) {
        speak("Opening Google...");
        window.open("https://google.com/", "_blank");
    } else if (message.includes("open facebook")) {
        speak("Opening Facebook...");
        window.open("https://facebook.com/", "_blank");
    } else if (message.includes("open instagram")) {
        speak("Opening Instagram...");
        window.open("https://instagram.com/", "_blank");
    } else if (message.includes("open calculator")) {
        speak("Opening calculator...");
        window.open("calculator://");
    } else if (message.includes("open whatsapp")) {
        speak("Opening WhatsApp...");
        window.open("whatsapp://");
    } else if (message.includes("time")) {
        let time = new Date().toLocaleTimeString();
        speak("The current time is " + time);
    } else if (message.includes("date")) {
        let date = new Date().toDateString();
        speak("Today's date is " + date);
    } else if (message.includes("weather")) {
        speak("Fetching weather details...");
        window.open("https://www.weather.com/", "_blank");
    } else {
        let searchQuery = message.replace(/shipra|shifra/g, "").trim();
        let finalText = "Here is what I found on the internet about " + searchQuery;
        speak(finalText);
        window.open(`https://www.google.com/search?q=${searchQuery}`, "_blank");
    }
}

// =======================
// Floating Notes Feature
// =======================

// Open Notes Panel
document.getElementById("notes-btn").addEventListener("click", function () {
    let notesPanel = document.getElementById("floating-notes");
    notesPanel.style.display = "flex";
});

// Close Notes Panel
document.getElementById("close-notes").addEventListener("click", function () {
    document.getElementById("floating-notes").style.display = "none";
});

// Minimize Notes Panel
document.getElementById("minimize-notes").addEventListener("click", function () {
    let textarea = document.getElementById("notes-area");
    if (textarea.style.display === "none") {
        textarea.style.display = "block";
    } else {
        textarea.style.display = "none";
    }
});

// Dragging Notes Panel
let notesHeader = document.getElementById("notes-header");
let floatingNotes = document.getElementById("floating-notes");

notesHeader.addEventListener("mousedown", function (e) {
    let shiftX = e.clientX - floatingNotes.getBoundingClientRect().left;
    let shiftY = e.clientY - floatingNotes.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        floatingNotes.style.left = pageX - shiftX + "px";
        floatingNotes.style.top = pageY - shiftY + "px";
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener("mousemove", onMouseMove);

    notesHeader.addEventListener("mouseup", function () {
        document.removeEventListener("mousemove", onMouseMove);
    });
});

// Load Notes from Local Storage
let notesArea = document.getElementById("notes-area");
notesArea.value = localStorage.getItem("savedNotes") || "";

notesArea.addEventListener("input", function () {
    localStorage.setItem("savedNotes", notesArea.value);
});

// =======================
// Voice Processing
// =======================
let transcriptionText = document.getElementById("transcription-text");
let statusText = document.getElementById("status-text");

recognition.onstart = () => {
    statusText.innerText = "Status: Listening...";
    voice.style.display = "block";
    btn.style.display = "none";
};

recognition.onend = () => {
    statusText.innerText = "Status: Idle";
    voice.style.display = "none";
    btn.style.display = "flex";
};

recognition.onresult = (event) => {
    let transcript = event.results[0][0].transcript.toLowerCase();
    transcriptionText.innerText = transcript;
    extractActions(transcript);
};

// =======================
// Action Extraction
// =======================
function extractActions(transcript) {
    let actionsList = document.getElementById("actions-list");
    actionsList.innerHTML = ""; // Clear previous actions

    // Extract tasks (e.g., phrases containing "task" or "do")
    if (transcript.includes("task") || transcript.includes("do")) {
        let task = transcript.match(/(?:task|do)\s*(.*)/i)[1];
        if (task) {
            let li = document.createElement("li");
            li.textContent = `Task: ${task}`;
            actionsList.appendChild(li);
        }
    }

    // Extract deadlines (e.g., phrases containing "by" or "deadline")
    if (transcript.includes("by") || transcript.includes("deadline")) {
        let deadline = transcript.match(/(?:by|deadline)\s*(.*)/i)[1];
        if (deadline) {
            let li = document.createElement("li");
            li.textContent = `Deadline: ${deadline}`;
            actionsList.appendChild(li);
        }
    }

    // Extract meeting details (e.g., date and time)
    if (transcript.includes("meeting")) {
        let dateTime = transcript.match(/(?:meeting)\s*(.*)/i)[1];
        if (dateTime) {
            let li = document.createElement("li");
            li.textContent = `Meeting: ${dateTime}`;
            actionsList.appendChild(li);
        }
    }
}

// =======================
// Action Generation
// =======================
document.getElementById("create-calendar-event").addEventListener("click", () => {
    let meetingDetails = document.getElementById("actions-list").innerText;
    if (meetingDetails) {
        speak("Creating calendar event...");
        // Integrate with a calendar API (e.g., Google Calendar)
        alert("Calendar event created: " + meetingDetails);
    } else {
        speak("No meeting details found.");
    }
});

document.getElementById("create-todo").addEventListener("click", () => {
    let tasks = document.getElementById("actions-list").innerText;
    if (tasks) {
        speak("Creating to-do item...");
        // Integrate with a to-do list API
        alert("To-do item created: " + tasks);
    } else {
        speak("No tasks found.");
    }
});

document.getElementById("create-summary").addEventListener("click", () => {
    let summary = document.getElementById("transcription-text").innerText;
    if (summary) {
        speak("Creating meeting summary...");
        alert("Meeting summary created: " + summary);
    } else {
        speak("No transcription found.");
    }
});

document.getElementById("share-notes").addEventListener("click", () => {
    let notes = document.getElementById("transcription-text").innerText;
    if (notes) {
        speak("Sharing notes...");
        // Integrate with an email/messaging API
        alert("Notes shared: " + notes);
    } else {
        speak("No notes found.");
    }
});
