let taskList = document.getElementById("taskList");

// When page loads, get saved tasks
window.onload = function () {
    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    savedTasks.forEach(function(task) {
        addTaskToScreen(task.text, task.completed);
    });
    updateChart();

};

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    addTaskToScreen(taskText, false);
    saveTasks();
    taskInput.value = "";
}

function addTaskToScreen(text, completed) {
    let li = document.createElement("li");

    let span = document.createElement("span");
    span.textContent = text;

    if (completed) {
        span.classList.add("completed");
    }

    span.onclick = function () {
        span.classList.toggle("completed");
        saveTasks();
    };

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.onclick = function () {
        li.remove();
        saveTasks();
    };

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}


function saveTasks() {
    let allTasks = [];
    let liItems = document.querySelectorAll("#taskList li");

    liItems.forEach(function(li) {
        allTasks.push({
            text: li.textContent,
            completed: li.classList.contains("completed")
        });
    });

    localStorage.setItem("tasks", JSON.stringify(allTasks));
    updateChart();

}
let timeLeft = 25 * 60;
let timerInterval = null;

function startTimer() {
    if (timerInterval) return;

    timerInterval = setInterval(function () {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("Time's up! Take a break 🎉");
            return;
        }

        timeLeft--;
        updateTimerDisplay();
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 25 * 60;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    document.getElementById("timer").textContent =
        (minutes < 10 ? "0" : "") + minutes + ":" +
        (seconds < 10 ? "0" : "") + seconds;
}
let chart;

function updateChart() {
    let completed = 0;
    let pending = 0;

    document.querySelectorAll("#taskList li span").forEach(span => {
        if (span.classList.contains("completed")) {
            completed++;
        } else {
            pending++;
        }
    });

    let ctx = document.getElementById("taskChart").getContext("2d");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Completed", "Pending"],
            datasets: [{
                data: [completed, pending],
                backgroundColor: ["#4CAF50", "#f44336"]
            }]
        }
    });
}
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    // Save user preference
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
}

// Load dark mode setting on page open
window.addEventListener("load", function () {
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }
});
