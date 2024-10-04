# Theta Tau Website

## How to manage the backend

Firebase Integration
Our project utilizes Firebase to handle user authentication and data storage. Here’s a detailed explanation of the Firebase services and data management practices employed:

### Services Used

Firebase Authentication:
Google Auth Provider: This allows users to log in using their Google accounts. The login process utilizes the GoogleAuthProvider and signInWithPopup methods from firebase/auth.

#### Firestore:

User Data Management: User-related data is stored and fetched from Firestore. This includes first name, last name, email, profile picture URL, and other ancillary information such as class, graduation year, family, major, role, and points.
Authorization Control: The application checks whether the logged-in user's email is authorized by referencing a Firestore document (`authorizedEmails` > `emails_array`).
Key Data Points and Management
Ensure that the following data points are up to date for smooth operation and authentication authorization:
Authorized Emails List:
Location: Firestore document (`authorizedEmails` > `emails_array`).

### Structure:

An array of authorized email addresses.

Note: **Be diligent in updating this list to control and manage access permissions for new users.**
User Data:
Location: Firestore collection (`users`).
Key fields:
`firstName`: User's first name.

`lastName`: User's last name.

`email`: User's email address.

`profilePictureUrl`: URL to the user's profile picture.

Additional fields (conditional upon new user):

`class`: Default empty string.

`graduationYear`: Default 0.

`family`: Default empty string.

`major`: Default empty string.

`role`: Default empty string.

`points`: Default initialized to 0.

**Note**: Existing user data is merged to prevent overwriting previous data.
Maintenance and Best Practices
Ensure the Firestore rules and indexes are well configured to maintain data integrity and security.
Regularly audit the authorized email list to make necessary updates reflecting the current user base.

**Keep user data up to date**, particularly the dynamic fields such as points which might change frequently.

When adding or modifying fields in Firestore documents, ensure the React components utilizing this data reflect these changes to prevent breaking UI components or causing unexpected behavior.
Error handling and user feedback are critical. Ensure any authentication or data access issues are clearly communicated to the user for a seamless experience.

## Available Scripts

In the project directory, you can run:

#####
`npm install`

Test this code locally `npm start`

`npm test`

Build the website `npm run build`

`npm run eject`