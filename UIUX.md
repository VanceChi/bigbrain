1. Consistent and Intuitive Layouts

Dashboard Screen: The dashboard displays all games in a clean, card-based layout with consistent styling (rounded corners, soft shadows, and a pastel color scheme). Each game card shows the game name, number of questions, and duration, making it easy for users to quickly understand the game details at a glance. The "+ Game" button is prominently placed with a contrasting pink color to encourage action, following the principle of visual hierarchy.
Edit Game Screen: The edit screen uses a similar card-based layout for questions, with clear action buttons ("+" for adding, "-" for deleting) that are visually distinct and positioned intuitively next to each question. This ensures users can easily manage questions without confusion.
Game Session Results Screen: Results are presented in a structured table format with clear headers ("Question", "Score", "Seconds"), making it easy for players to interpret their performance. Visual charts (bar and pie) are used to provide a quick overview of correct rates and response times, enhancing comprehension through data visualization.

2. Visual Feedback for Interactivity

Hover Effects: Interactive elements like buttons and game cards have hover effects (color changes and slight scaling) to provide immediate visual feedback. For example, the "Play" button on the dashboard changes shade on hover, and game cards slightly scale up, indicating they are clickable. This improves discoverability and reassures users of interactive elements.
Active Session Indication: When a game session is active, the UI updates dynamically (e.g., the "Play" button changes to a "Stop" button), providing clear feedback about the game state without requiring a page refresh. This aligns with the principle of real-time feedback in SPAs.

3. Simplified Navigation

Consistent Navigation Patterns: The "Log out" button is consistently placed in the top-right corner across all screens, making it easy to locate. The dashboard serves as a central hub, with clear paths to edit games or start sessions, reducing cognitive load.
Modal for Game Creation: The "+ Game" button opens a modal for creating a new game, allowing users to stay on the dashboard while performing this action. This prevents unnecessary navigation and keeps the user focused on their task, following the principle of minimizing user effort.

4. Enhanced Question Editing Experience

Question Editor Preview: On the "Edit BigBrain Game Question" screen, a live preview of the question is displayed below the editor. This allows admins to immediately see how the question will appear to players, including the question text, answer options, and timer. This real-time preview reduces errors and improves the editing experience by providing instant feedback.
Clear Form Design: The question editor form uses labeled fields (e.g., "Question", "Duration (s)", "Points") with placeholders, making it clear what each field expects. The "Add Answer" button is prominently placed, encouraging admins to add more options as needed, while "Remove" buttons next to each answer allow for quick adjustments.

5. Player Experience During Gameplay

Lobby Screen: While waiting for the game to start, players see a "Please wait" message on the "Play Game" screen. To make this more engaging, a simple lobby screen was implemented with a subtle loading animation (e.g., a spinning icon) and a welcoming message, improving the waiting experience and keeping players engaged.
Question Display During Gameplay: The question display includes a countdown time and answer options as radio buttons for single-choice questions, ensuring clarity. The "Submit Answer" button is highlighted in pink, making it the focal point for action, while a "Reset Answer" button provides flexibility, reducing user frustration.

6. Results Visualization

Admin Results Screen: The admin results screen includes a table of top players and two charts: a bar chart for correct rates per question and a pie chart for average response times. These visualizations make it easy to analyze game performance at a glance, catering to users who prefer visual data over raw numbers.
Player Results Screen: Players see a detailed breakdown of their performance in a table format, with columns for the question, score, and time taken. This clear structure helps players understand their strengths and weaknesses, enhancing the post-game experience.

7. Color and Typography Choices

Consistent Color Scheme: A soft pastel color scheme (light green background, pink buttons, and neutral card backgrounds) creates a visually appealing and non-overwhelming interface. Pink is used consistently for primary actions (e.g., "Submit", "Add Answer"), drawing attention to key interactions.
Readable Typography: The application uses a clean, sans-serif font with appropriate font sizes (e.g., larger headings for "Game2", smaller text for details like "Questions: 1"). This ensures readability across different screen sizes, especially on smaller mobile screens.

8. Responsive Design

Mobile-Friendly Layout: The application is designed to be responsive, with game cards stacking vertically on smaller screens and text fields adjusting to fit the viewport. Buttons remain large enough for touch interactions, ensuring usability on mobile devices.
Overflow Handling: On the "Edit Questions" screen, question text that might overflow on smaller screens is handled with a tooltip (via the title attribute), allowing users to hover and see the full text. This maintains clarity without cluttering the UI.