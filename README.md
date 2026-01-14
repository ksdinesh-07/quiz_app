# Quiz Application

A fully-featured quiz application with multiple-choice questions, timer, score tracking, and Firebase leaderboard integration.

## Features

### Frontend (HTML/CSS/JS)
- Multiple-choice questions with instant feedback
- Visual timer with circular progress indicator
- Real-time score tracking
- Responsive design for all devices
- Smooth animations and transitions
- Question navigation (previous/next)
- Progress tracking with visual bar
- Detailed results breakdown

### Backend/Data
- Questions stored in JSON format (questions.json)
- Firebase Realtime Database integration for leaderboard
- Score persistence across sessions
- Filterable leaderboard (all time, today, this week)

## Setup Instructions

### 1. Basic Setup
All necessary files are included in the quiz-app directory.

### 2. Firebase Setup (for leaderboard)

1. Create a Firebase Project:
   - Go to Firebase Console
   - Click "Add project"
   - Follow the setup wizard

2. Create a Realtime Database:
   - In your Firebase project, go to "Realtime Database"
   - Click "Create Database"
   - Choose a location and start in test mode

3. Get Your Firebase Configuration:
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" section
   - If no web app, click "</>" to add one
   - Copy the configuration object

4. Update Firebase Config in index.html:
   - Open index.html
   - Find the firebaseConfig object
   - Replace with your actual Firebase configuration

### 3. Running the Application

Open index.html in your browser or use a local server:

python3 -m http.server 8000

Then visit http://localhost:8000

## File Structure

quiz-app/
├── index.html          # Main HTML file
├── style.css           # CSS styles
├── script.js           # JavaScript logic
├── questions.json      # Quiz questions
└── README.md           # Documentation

## Features in Detail

### Quiz Settings
- Customizable number of questions (5, 10, or 15)
- Adjustable time per question (15-60 seconds)
- Player name input with validation

### Game Features
- Randomized questions from the pool
- Auto-advance after answering
- Timer warnings (color changes when time is low)
- Question review during quiz
- Instant answer feedback in review mode

### Results Screen
- Final score display
- Accuracy percentage
- Time taken
- Question-by-question breakdown
- Correct/incorrect answer comparison

### Leaderboard
- Top 10 scores display
- Date filtering (all time, today, this week)
- Score saving with player name
- Real-time updates

## Customization

### Adding More Questions
Edit questions.json to add more questions.

### Styling Changes
Modify colors in style.css.

### Firebase Rules (Security)
For production, update Firebase rules.

## Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Works on mobile browsers

## Troubleshooting

### Firebase Issues
1. "Firebase not configured" error
   - Ensure you've updated the firebaseConfig in index.html
   - Check your Firebase project is properly set up

2. "Permission denied" error
   - Check Firebase database rules
   - Make sure database is in test mode or proper rules are set

### Quiz Not Starting
- Make sure questions.json is in the same directory
- Check browser console for errors (F12)
- Ensure JavaScript is enabled

### Styling Issues
- Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
- Check CSS file path in HTML
- Verify font-awesome CDN is accessible

## Future Enhancements
- User authentication system
- Question categories selection
- Difficulty levels
- Sound effects
- Share results feature
- Question statistics tracking
- Dark mode toggle

## License
This project is open source and available for educational and personal use.

## Credits
Created as a complete quiz application example with modern web technologies.
