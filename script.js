class QuizApp {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeLeft = 30;
        this.timer = null;
        this.totalTime = 0;
        this.playerName = '';
        this.selectedOptions = {};
        this.quizStarted = false;
        this.totalQuestions = 10;
        this.timePerQuestion = 30;
        
        this.initializeElements();
        this.loadQuestions();
        this.setupEventListeners();
        this.setupFirebase();
    }
    
    initializeElements() {
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.quizScreen = document.getElementById('quiz-screen');
        this.resultsScreen = document.getElementById('results-screen');
        this.leaderboardScreen = document.getElementById('leaderboard-screen');
        
        this.playerNameInput = document.getElementById('player-name');
        this.numQuestionsSelect = document.getElementById('num-questions');
        this.timeLimitSelect = document.getElementById('time-limit');
        this.startBtn = document.getElementById('start-btn');
        this.viewLeaderboardBtn = document.getElementById('view-leaderboard-btn');
        
        this.currentPlayerSpan = document.getElementById('current-player');
        this.currentQuestionSpan = document.getElementById('current-question');
        this.totalQuestionsSpan = document.getElementById('total-questions');
        this.currentScoreSpan = document.getElementById('current-score');
        this.timerSpan = document.getElementById('timer');
        this.timerProgress = document.querySelector('.timer-progress');
        this.questionText = document.getElementById('question-text');
        this.optionsContainer = document.getElementById('options-container');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.submitQuizBtn = document.getElementById('submit-quiz-btn');
        this.progressBar = document.getElementById('progress-bar');
        
        this.finalScoreSpan = document.getElementById('final-score');
        this.totalQuestionsResultSpan = document.getElementById('total-questions-result');
        this.accuracySpan = document.getElementById('accuracy');
        this.correctAnswersSpan = document.getElementById('correct-answers');
        this.timeTakenSpan = document.getElementById('time-taken');
        this.resultsBreakdown = document.getElementById('results-breakdown');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.saveScoreBtn = document.getElementById('save-score-btn');
        this.homeBtn = document.getElementById('home-btn');
        
        this.leaderboardList = document.getElementById('leaderboard-list');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.backFromLeaderboardBtn = document.getElementById('back-from-leaderboard');
        this.refreshLeaderboardBtn = document.getElementById('refresh-leaderboard');
        
        this.circumference = 2 * Math.PI * 25;
        if (this.timerProgress) {
            this.timerProgress.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
            this.timerProgress.style.strokeDashoffset = this.circumference;
        }
    }
    
    async loadQuestions() {
        try {
            const response = await fetch('questions.json');
            this.allQuestions = await response.json();
            console.log(`✅ Loaded ${this.allQuestions.length} questions from JSON`);
        } catch (error) {
            console.error('❌ Error loading questions:', error);
            this.allQuestions = this.getFallbackQuestions();
            console.log(`✅ Using ${this.allQuestions.length} fallback questions`);
        }
    }
    
    getFallbackQuestions() {
        return [
            {
                question: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                correctAnswer: 2,
                category: "Geography"
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correctAnswer: 1,
                category: "Science"
            }
        ];
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startQuiz());
        this.viewLeaderboardBtn.addEventListener('click', () => this.showLeaderboard());
        
        this.prevBtn.addEventListener('click', () => this.previousQuestion());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.submitQuizBtn.addEventListener('click', () => this.submitQuiz());
        
        this.playAgainBtn.addEventListener('click', () => this.playAgain());
        this.saveScoreBtn.addEventListener('click', () => this.saveScore());
        this.homeBtn.addEventListener('click', () => this.goHome());
        
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.filterLeaderboard(e.target.dataset.filter));
        });
        this.backFromLeaderboardBtn.addEventListener('click', () => this.goHome());
        this.refreshLeaderboardBtn.addEventListener('click', () => this.loadLeaderboard());
        
        this.playerNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startQuiz();
        });
    }
    
    setupFirebase() {
        console.log("🔄 Setting up Firebase...");
        try {
            if (typeof firebase === 'undefined') {
                console.error("❌ Firebase SDK not loaded!");
                return;
            }
            
            console.log("✅ Firebase SDK loaded");
            console.log("🔧 Firebase config:", window.firebaseConfig || "Not found");
            
            this.database = firebase.database();
            console.log("✅ Firebase database initialized");
            
            // Test connection
            const connectedRef = this.database.ref('.info/connected');
            connectedRef.on('value', (snap) => {
                if (snap.val() === true) {
                    console.log("✅ Connected to Firebase Realtime Database");
                } else {
                    console.log("⚠️ Disconnected from Firebase");
                }
            });
            
        } catch (error) {
            console.error("❌ Firebase setup error:", error);
        }
    }
    
    startQuiz() {
        this.playerName = this.playerNameInput.value.trim();
        if (!this.playerName) {
            alert('Please enter your name to start the quiz!');
            this.playerNameInput.focus();
            return;
        }
        
        this.totalQuestions = parseInt(this.numQuestionsSelect.value);
        this.timePerQuestion = parseInt(this.timeLimitSelect.value);
        
        this.questions = this.shuffleArray([...this.allQuestions]).slice(0, this.totalQuestions);
        this.selectedOptions = {};
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.totalTime = 0;
        this.quizStarted = true;
        
        this.currentPlayerSpan.textContent = this.playerName;
        this.totalQuestionsSpan.textContent = this.totalQuestions;
        this.totalQuestionsResultSpan.textContent = this.totalQuestions;
        
        this.showScreen(this.quizScreen);
        this.loadQuestion();
        this.startTimer();
        this.updateProgressBar();
        
        console.log(`🎮 Quiz started for ${this.playerName}, ${this.totalQuestions} questions`);
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    showScreen(screen) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        screen.classList.add('active');
    }
    
    loadQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) return;
        
        const question = this.questions[this.currentQuestionIndex];
        this.questionText.textContent = question.question;
        this.currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
        this.currentScoreSpan.textContent = this.score;
        
        this.optionsContainer.innerHTML = '';
        
        const optionPrefixes = ['A', 'B', 'C', 'D'];
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            if (this.selectedOptions[this.currentQuestionIndex] === index) {
                optionElement.classList.add('selected');
            }
            
            optionElement.innerHTML = `
                <div class="option-prefix">${optionPrefixes[index]}</div>
                <div class="option-text">${option}</div>
            `;
            
            optionElement.addEventListener('click', () => this.selectOption(index));
            this.optionsContainer.appendChild(optionElement);
        });
        
        this.prevBtn.disabled = this.currentQuestionIndex === 0;
        this.nextBtn.disabled = this.currentQuestionIndex === this.questions.length - 1;
        
        this.resetTimer();
    }
    
    selectOption(optionIndex) {
        this.selectedOptions[this.currentQuestionIndex] = optionIndex;
        
        document.querySelectorAll('.option').forEach((option, index) => {
            option.classList.toggle('selected', index === optionIndex);
        });
        
        if (this.currentQuestionIndex < this.questions.length - 1) {
            setTimeout(() => {
                if (this.selectedOptions[this.currentQuestionIndex] !== undefined) {
                    this.nextQuestion();
                }
            }, 1000);
        }
    }
    
    startTimer() {
        this.resetTimer();
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.timerSpan.textContent = this.timeLeft;
            this.updateTimerCircle();
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                if (this.currentQuestionIndex < this.questions.length - 1) {
                    this.nextQuestion();
                } else {
                    this.submitQuiz();
                }
            }
        }, 1000);
    }
    
    resetTimer() {
        clearInterval(this.timer);
        this.timeLeft = this.timePerQuestion;
        this.timerSpan.textContent = this.timeLeft;
        this.updateTimerCircle();
        this.startTimer();
    }
    
    updateTimerCircle() {
        const offset = this.circumference - (this.timeLeft / this.timePerQuestion) * this.circumference;
        this.timerProgress.style.strokeDashoffset = offset;
        
        if (this.timeLeft <= 10) {
            this.timerProgress.style.stroke = '#e74c3c';
        } else if (this.timeLeft <= 20) {
            this.timerProgress.style.stroke = '#f39c12';
        } else {
            this.timerProgress.style.stroke = '#6a11cb';
        }
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.loadQuestion();
            this.updateProgressBar();
        }
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.loadQuestion();
            this.updateProgressBar();
        }
    }
    
    updateProgressBar() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.progressBar.style.width = `${progress}%`;
    }
    
    submitQuiz() {
        clearInterval(this.timer);
        this.calculateResults();
        this.showScreen(this.resultsScreen);
        this.displayResults();
        console.log(`📊 Quiz submitted. Score: ${this.score}/${this.questions.length}`);
    }
    
    calculateResults() {
        this.score = 0;
        this.questions.forEach((question, index) => {
            if (this.selectedOptions[index] === question.correctAnswer) {
                this.score++;
            }
        });
        
        this.accuracy = (this.score / this.questions.length) * 100;
        this.totalTime = (this.questions.length * this.timePerQuestion) - (this.timeLeft || 0);
    }
    
    displayResults() {
        this.finalScoreSpan.textContent = this.score;
        this.correctAnswersSpan.textContent = this.score;
        this.accuracySpan.textContent = `${this.accuracy.toFixed(1)}%`;
        this.timeTakenSpan.textContent = `${this.totalTime}s`;
        
        this.resultsBreakdown.innerHTML = '';
        this.questions.forEach((question, index) => {
            const isCorrect = this.selectedOptions[index] === question.correctAnswer;
            const userAnswer = this.selectedOptions[index] !== undefined ? 
                question.options[this.selectedOptions[index]] : 'Not answered';
            const correctAnswer = question.options[question.correctAnswer];
            
            const resultElement = document.createElement('div');
            resultElement.className = `question-result ${isCorrect ? 'correct' : 'incorrect'}`;
            resultElement.innerHTML = `
                <h4>Question ${index + 1}: ${question.question}</h4>
                <p><strong>Your answer:</strong> ${userAnswer}</p>
                <p><strong>Correct answer:</strong> ${correctAnswer}</p>
                <p><strong>Category:</strong> ${question.category || 'General'}</p>
            `;
            this.resultsBreakdown.appendChild(resultElement);
        });
    }
    
    async saveScore() {
        console.log("💾 Attempting to save score...");
        
        if (!this.database) {
            alert('Firebase is not configured. Please check your Firebase setup.');
            console.error("❌ No Firebase database connection");
            return;
        }
        
        try {
            const scoreData = {
                playerName: this.playerName,
                score: this.score,
                totalQuestions: this.totalQuestions,
                accuracy: this.accuracy.toFixed(1),
                timeTaken: this.totalTime,
                timestamp: Date.now(),
                date: new Date().toISOString().split('T')[0]
            };
            
            console.log("📤 Saving score data:", scoreData);
            
            const newScoreRef = this.database.ref('scores').push();
            await newScoreRef.set(scoreData);
            
            console.log("✅ Score saved successfully with ID:", newScoreRef.key);
            alert('Score saved to leaderboard successfully!');
            this.saveScoreBtn.disabled = true;
            this.saveScoreBtn.innerHTML = '<i class="fas fa-check"></i> Score Saved';
            
            this.loadLeaderboard();
            
        } catch (error) {
            console.error('❌ Error saving score:', error);
            alert('Error saving score. Please check your Firebase configuration and console for details.');
        }
    }
    
    async loadLeaderboard(filter = 'all') {
        console.log(`📋 Loading leaderboard with filter: ${filter}`);
        
        if (!this.database) {
            this.leaderboardList.innerHTML = `
                <div class="leaderboard-item error">
                    <i class="fas fa-exclamation-triangle"></i> 
                    Firebase not configured. Please check your Firebase setup.
                </div>
            `;
            console.error("❌ No Firebase database for leaderboard");
            return;
        }
        
        this.leaderboardList.innerHTML = '<div class="leaderboard-item loading"><i class="fas fa-spinner fa-spin"></i> Loading leaderboard...</div>';
        
        try {
            const scoresRef = this.database.ref('scores');
            console.log("🔍 Fetching scores from Firebase...");
            
            const snapshot = await scoresRef.once('value');
            const scores = snapshot.val();
            
            console.log("📊 Received data from Firebase:", scores);
            
            if (!scores) {
                this.leaderboardList.innerHTML = `
                    <div class="leaderboard-item">
                        <i class="fas fa-trophy"></i> 
                        No scores yet. Be the first to play!
                    </div>
                `;
                console.log("🏆 No scores found in database");
                return;
            }
            
            let scoresArray = Object.entries(scores).map(([id, data]) => ({
                id,
                ...data
            }));
            
            console.log(`📈 Found ${scoresArray.length} scores total`);
            
            const now = new Date();
            const today = now.toISOString().split('T')[0];
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            
            if (filter === 'today') {
                scoresArray = scoresArray.filter(score => score.date === today);
                console.log(`📅 Filtered to ${scoresArray.length} today's scores`);
            } else if (filter === 'week') {
                scoresArray = scoresArray.filter(score => score.date >= weekAgo);
                console.log(`📅 Filtered to ${scoresArray.length} this week's scores`);
            }
            
            scoresArray.sort((a, b) => b.score - a.score);
            scoresArray = scoresArray.slice(0, 10);
            
            console.log(`🏆 Displaying top ${scoresArray.length} scores`);
            
            this.leaderboardList.innerHTML = '';
            
            if (scoresArray.length === 0) {
                this.leaderboardList.innerHTML = `
                    <div class="leaderboard-item">
                        <i class="fas fa-search"></i> 
                        No scores found for this filter.
                    </div>
                `;
                return;
            }
            
            scoresArray.forEach((score, index) => {
                const item = document.createElement('div');
                item.className = `leaderboard-item rank-${index + 1}`;
                
                const date = new Date(score.timestamp);
                const formattedDate = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
                
                item.innerHTML = `
                    <div class="rank">${index + 1}</div>
                    <div class="name">${score.playerName}</div>
                    <div class="score">${score.score}/${score.totalQuestions}</div>
                    <div class="date">${formattedDate}</div>
                `;
                this.leaderboardList.appendChild(item);
            });
            
            this.filterBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === filter);
            });
            
        } catch (error) {
            console.error('❌ Error loading leaderboard:', error);
            this.leaderboardList.innerHTML = `
                <div class="leaderboard-item error">
                    <i class="fas fa-exclamation-circle"></i> 
                    Error loading leaderboard
                    <br><small>${error.message}</small>
                </div>
            `;
        }
    }
    
    filterLeaderboard(filter) {
        console.log(`🔽 Filtering leaderboard: ${filter}`);
        this.loadLeaderboard(filter);
    }
    
    showLeaderboard() {
        console.log("📊 Showing leaderboard screen");
        this.showScreen(this.leaderboardScreen);
        this.loadLeaderboard();
    }
    
    playAgain() {
        console.log("🔄 Playing again");
        this.selectedOptions = {};
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeLeft = this.timePerQuestion;
        this.totalTime = 0;
        
        this.saveScoreBtn.disabled = false;
        this.saveScoreBtn.innerHTML = '<i class="fas fa-save"></i> Save to Leaderboard';
        
        this.startQuiz();
    }
    
    goHome() {
        console.log("🏠 Going to home screen");
        this.showScreen(this.welcomeScreen);
        this.playerNameInput.focus();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Quiz App initializing...");
    const quizApp = new QuizApp();
    console.log("✅ Quiz App initialized successfully");
});