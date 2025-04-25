1. Component Tests

I used Vitest + Testing Library to write three focused test suites. Each targets a small, independent component.
Navbar Component

Where: src/components/Navbar.jsx
Why: It’s the main nav bar—must show the right buttons based on route and login state.

Scenarios tested:
On /login: show Register, hide Log in & Log out.
On /register: show Log in, hide Register & Log out.
With a token in localStorage: always show Log out, hide everything else.

Edge cases:
Visiting other pages (e.g. /dashboard) without a token still shows the Dashboard button.
Setting/removing the token quickly doesn't break anything.

Form Component
Where: src/components/Form.jsx

Scenarios tested:
Default render: inputs for Name, Email, Password, Confirm Password show up, and the submit button is enabled.
Submitting the form calls the onSubmit handler.
When I pass a validationError or an error prop, the appropriate messages appear.

Edge cases:
It still works if only one of the error messages is provided.
If onSubmit does nothing, it doesn’t throw errors.

LobbyRoom Component
Where: src/components/LobbyRoom.jsx

Scenarios tested:
There’s an element with the animate-spin class (the spinner).
The text “Waiting for the game to begin…” is visible.
Exactly three bouncing dot elements (with animate-bounce) appear.

Edge cases:
If someone accidentally renames those CSS classes, the tests will catch it.
How to run component tests

2. UI Tests (40% of testing marks)


File: cypress/e2e/admin_happy_path.cy.js

What it does:
Register a new admin (fills name/email/password).
Log in as that admin.
Create a game on the dashboard.
Start the game session and check the session ID shows.
End the session, view results.
Log out and then log back in.
All steps assert the correct page or element appears.

Vitest Integration: PlayJoin Flow

File: src/__tests__/PlayJoin.integration.test.jsx
This tests the two-step player join screen without a real browser:
When no sessionId param, it shows the session ID input and navigates to /play/join/:id.
When with sessionId, it shows the name input, hits the API, and navigates to /play/:playerId.