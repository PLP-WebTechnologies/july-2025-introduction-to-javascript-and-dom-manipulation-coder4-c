// Global variables for application state
let currentTimer = null;
let timerRunning = false;
let quoteAnimated = false;
let todoCounter = 0;
let userName = '';

// Study tips array
const studyTips = [
    "Take regular breaks every 25-30 minutes",
    "Find a quiet, well-lit study space",
    "Use active recall techniques",
    "Create a study schedule and stick to it",
    "Eliminate distractions like social media",
    "Practice spaced repetition for better retention",
    "Teach concepts to someone else",
    "Use visual aids like diagrams and charts",
    "Stay hydrated and eat brain-healthy foods",
    "Get adequate sleep for memory consolidation",
    "Form study groups with motivated peers",
    "Set specific, achievable goals for each session"
];

// Motivational quotes array
const motivationalQuotes = [
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "It is during our darkest moments that we must focus to see the light. - Aristotle",
    "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Success is walking from failure to failure with no loss of enthusiasm. - Winston Churchill"
];

// Function to display current date and time with conditional greeting
function updateDateTime() {
    const now = new Date();
    const hours = now.getHours();
    const greeting = document.getElementById('greeting');
    
    // Create personalized greeting with user's name
    let timeGreeting;
    if (hours < 12) {
        timeGreeting = "Good Morning";
    } else if (hours < 17) {
        timeGreeting = "Good Afternoon";
    } else {
        timeGreeting = "Good Evening";
    }
    
    // Use stored name or default to "Student"
    const displayName = userName || "Student";
    const emoji = hours < 12 ? "🌅" : (hours < 17 ? "☀️" : "🌙");
    
    greeting.textContent = `${timeGreeting}, ${displayName}! ${emoji}`;
    
    // Format and display current date/time
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    document.getElementById('datetime').textContent = now.toLocaleDateString('en-US', options);
}

// Calculate average grade and provide feedback
function calculateGrade() {
    // Get input values and convert to numbers
    const score1 = parseFloat(document.getElementById('assignment1').value) || 0;
    const score2 = parseFloat(document.getElementById('assignment2').value) || 0;
    const score3 = parseFloat(document.getElementById('assignment3').value) || 0;
    
    // Validation using conditionals
    if (score1 === 0 && score2 === 0 && score3 === 0) {
        document.getElementById('gradeResult').innerHTML = 
            '<span style="color: #e74c3c;">Please enter at least one score!</span>';
        return;
    }
    
    // Calculate average
    const validScores = [score1, score2, score3].filter(score => score > 0);
    const average = validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
    
    // Determine letter grade using conditionals
    let letterGrade, feedback;
    if (average >= 90) {
        letterGrade = 'A';
        feedback = 'Excellent work! Keep it up! 🌟';
    } else if (average >= 80) {
        letterGrade = 'B';
        feedback = 'Good job! You\'re doing well! 👍';
    } else if (average >= 70) {
        letterGrade = 'C';
        feedback = 'Not bad, but there\'s room for improvement! 📚';
    } else if (average >= 60) {
        letterGrade = 'D';
        feedback = 'You need to put in more effort! 💪';
    } else {
        letterGrade = 'F';
        feedback = 'Don\'t give up! Seek help and try harder! 🎯';
    }
    
    // Display result
    document.getElementById('gradeResult').innerHTML = 
        `<strong>Average: ${average.toFixed(1)}% (${letterGrade})</strong><br>${feedback}`;
}

// Plan study time distribution
function planStudyTime() {
    const totalHours = parseFloat(document.getElementById('studyHours').value);
    const numSubjects = parseInt(document.getElementById('subjects').value);
    
    // Input validation
    if (!totalHours || !numSubjects || totalHours <= 0 || numSubjects <= 0) {
        document.getElementById('studyPlan').innerHTML = 
            '<span style="color: #e74c3c;">Please enter valid hours and subjects!</span>';
        return;
    }
    
    // Calculate time per subject
    const hoursPerSubject = totalHours / numSubjects;
    const minutesPerSubject = Math.floor((hoursPerSubject % 1) * 60);
    const wholeHours = Math.floor(hoursPerSubject);
    
    // Create study plan
    let planText = `<strong>Study Plan:</strong><br>`;
    planText += `• ${wholeHours}h ${minutesPerSubject}m per subject<br>`;
    planText += `• Take 10-minute breaks between subjects<br>`;
    planText += `• Total study time: ${totalHours} hours`;
    
    document.getElementById('studyPlan').innerHTML = planText;
}

// Function to set user's name and show personalized dashboard
function setUserName() {
    const nameInput = document.getElementById('nameInput');
    const enteredName = nameInput.value.trim();
    
    // Validation - check if name is entered
    if (enteredName === '') {
        alert('Please enter your name to continue!');
        nameInput.focus();
        return;
    }
    
    // Validation - check for reasonable name length and characters
    if (enteredName.length < 2) {
        alert('Please enter a valid name (at least 2 characters)!');
        nameInput.focus();
        return;
    }
    
    // Store the user's name
    userName = enteredName;
    
    // Hide name input section and show personalized greeting
    document.getElementById('nameSection').style.display = 'none';
    document.getElementById('greetingSection').style.display = 'block';
    
    // Update the greeting immediately
    updateDateTime();
    
    // Show a welcome message
    setTimeout(() => {
        alert(`Welcome to your Study Buddy Dashboard, ${userName}! 🎉`);
    }, 500);
}

// Function to change user's name
function changeName() {
    // Confirm if user wants to change name
    if (confirm(`Change name from "${userName}"? This will reset your session.`)) {
        userName = '';
        document.getElementById('nameInput').value = '';
        document.getElementById('nameSection').style.display = 'block';
        document.getElementById('greetingSection').style.display = 'none';
        
        // Focus on name input
        setTimeout(() => {
            document.getElementById('nameInput').focus();
        }, 100);
    }
}

// Generate random study tips using for loop
function generateStudyTips() {
    const tipContainer = document.getElementById('studyTips');
    tipContainer.innerHTML = ''; // Clear previous tips
    
    // Generate 5 random tips using for loop
    const usedTips = new Set();
    for (let i = 0; i < 5; i++) {
        let randomIndex;
        
        // While loop to ensure no duplicate tips
        do {
            randomIndex = Math.floor(Math.random() * studyTips.length);
        } while (usedTips.has(randomIndex) && usedTips.size < studyTips.length);
        
        usedTips.add(randomIndex);
        
        const tipElement = document.createElement('div');
        tipElement.className = 'tip-item';
        tipElement.textContent = `${i + 1}. ${studyTips[randomIndex]}`;
        tipContainer.appendChild(tipElement);
    }
}

// Pomodoro timer using setInterval
function startTimer() {
    if (timerRunning) return;
    
    const minutesInput = document.getElementById('timerMinutes');
    let totalSeconds = parseInt(minutesInput.value) * 60 || 25 * 60;
    
    timerRunning = true;
    
    // Update timer display every second using setInterval
    currentTimer = setInterval(() => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        document.getElementById('timerDisplay').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (totalSeconds === 0) {
            clearInterval(currentTimer);
            timerRunning = false;
            document.getElementById('timerDisplay').textContent = "Time's up! 🎉";
            alert("Pomodoro session complete! Take a break!");
            return;
        }
        
        totalSeconds--;
    }, 1000);
}

function stopTimer() {
    if (currentTimer) {
        clearInterval(currentTimer);
        currentTimer = null;
        timerRunning = false;
        document.getElementById('timerDisplay').textContent = "Timer Stopped";
    }
}

// Theme Toggle
function toggleTheme() {
    const body = document.body;
    const themeButton = document.getElementById('themeToggle');
    
    body.classList.toggle('dark-theme');
    
    // Change button icon based on theme
    if (body.classList.contains('dark-theme')) {
        themeButton.textContent = '☀️';
    } else {
        themeButton.textContent = '🌙';
    }
}

// Dynamic Todo List Management
function addTodo() {
    const todoInput = document.getElementById('todoInput');
    const todoList = document.getElementById('todoList');
    const taskText = todoInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    // Create new todo item elements
    const todoItem = document.createElement('li');
    todoItem.className = 'todo-item';
    todoItem.id = `todo-${todoCounter++}`;
    
    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
    taskSpan.onclick = function() {
        this.style.textDecoration = this.style.textDecoration === 'line-through' ? 'none' : 'line-through';
        this.style.opacity = this.style.opacity === '0.6' ? '1' : '0.6';
    };
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.className = 'btn';
    deleteBtn.style.padding = '5px 8px';
    deleteBtn.onclick = function() {
        todoList.removeChild(todoItem);
    };
    
    // Append elements to todo item
    todoItem.appendChild(taskSpan);
    todoItem.appendChild(deleteBtn);
    todoList.appendChild(todoItem);
    
    // Clear input
    todoInput.value = '';
}

// Interactive Quote Display
function displayRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    const quote = motivationalQuotes[randomIndex];
    
    quoteDisplay.innerHTML = `<em>"${quote}"</em>`;
    
    if (quoteAnimated) {
        quoteDisplay.style.animation = 'none';
        setTimeout(() => {
            quoteDisplay.style.animation = 'pulse 2s ease-in-out';
        }, 10);
    }
}

// Additional DOM functions
function clearTips() {
    document.getElementById('studyTips').innerHTML = '';
}

function clearCompletedTasks() {
    const todoList = document.getElementById('todoList');
    const completedTasks = todoList.querySelectorAll('span[style*="line-through"]');
    
    completedTasks.forEach(task => {
        todoList.removeChild(task.parentElement);
    });
}

function toggleQuoteAnimation() {
    quoteAnimated = !quoteAnimated;
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    if (quoteAnimated) {
        quoteDisplay.style.animation = 'pulse 2s ease-in-out infinite';
    } else {
        quoteDisplay.style.animation = 'none';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Update date/time immediately and then every minute
    updateDateTime();
    setInterval(updateDateTime, 60000);
    
    // Add event listener for theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Add event listener for Enter key on name input
    document.getElementById('nameInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            setUserName();
        }
    });
    
    // Add event listener for Enter key on todo input
    document.getElementById('todoInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    // Focus on name input when page loads
    document.getElementById('nameInput').focus();
});