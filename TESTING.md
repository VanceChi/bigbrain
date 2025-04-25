1. Navbar Component
Location: src/components/Navbar.jsxWhy tested: Core navigation; must react correctly to authentication state and current route.

1.1 Test scenarios:
Unauthenticated /login route: renders Register button, hides Log in and Log out.
Unauthenticated /register route: renders Log in, hides Register and Log out.
Authenticated (token in localStorage): always renders Log out, hides other controls.

1.2 Edge cases:
No token and route outside /login|/register|/play should show Dashboard button.
Rapid toggling of localStorage.token does not break rendering.

2. Form Component
Location: src/components/Form.jsxWhy tested: Reusable for both login and registration; complex combinations of fields and error messages.

2.1 Test scenarios:
Default render: all four inputs (Name, Email, Password, Confirm Password) appear; submit button is enabled by default (no disable logic in component).
Submit behavior: form’s onSubmit handler is called when the button is clicked/submitted.
Error display: when validationError or error props are non-empty, their messages appear in the DOM with correct styling semantics.

2.2 Edge cases:
Passing only one of the error props still renders correctly.
Empty onSubmit does not crash component.

3. LobbyRoom Component
Location: src/components/LobbyRoom.jsx.  Provides a loading “lobby” UI before gameplay; simple but must reliably inform and animate users.
Test scenarios:

Spinner element: verifying presence of element with CSS class animate-spin.
Waiting message: ensures the text “Waiting for the game to begin…” is rendered.
Bouncing dots: exactly three elements with animate-bounce class appear, each with a different animation-delay.

3.1 Edge cases:
Changing CSS names or structure would cause tests to fail, guarding against accidental markup changes.

3.2 Test Design Principles
Low similarity between suites — each focuses on a uniquely structured component (navigation bar, form, loading screen).
High clarity & coverage — tests are well-commented, use descriptive queries (getByRole, getByLabelText, CSS selectors when needed).
Edge case consideration — error messages, authentication toggles, dynamic counts of elements.
Lightweight & efficient — no unnecessary complexity; UI is tested via DOM queries, not implementation details.