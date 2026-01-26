# SCU Theta Tau Chapter Website

Professional web platform for the Santa Clara University chapter of Theta Tau, the nation's oldest and largest professional engineering fraternity. This project serves as a central hub for brothers, alumni, and prospective recruits.

---

## 🚀 Vision & Purpose

The platform provides an integrated experience for:
- **Prospective Recruits**: Learning about the fraternity, upcoming rush events, and chapter values.
- **Active Brothers**: Managing chapter operations, tracking participation points, and coordinating "BroDates".
- **Alumni**: Maintaining connections through an interactive database and family tree.
- **Spoon Assassins**: Hosting an internal, automated game for chapter bonding.

---

##  Tech Stack

- **Frontend**: React.js with CSS3 (Vanilla + Animations)
- **Backend/Database**: Firebase (Auth, Firestore, Storage)
- **Deployment**: Vercel
- **State Management**: React Hooks & Context API

---

##  Key Features

### 1. **Dynamic Brotherhood Management**
- **Meet the Brothers**: Visual directory of active members with filtered views by class and major.
- **Family Tree**: Interactive D3-powered visualization of the chapter's lineage.
- **Alumni Database**: searchable records for professional networking.

### 2. **Scribe/Admin Dashboard**
- **Point Tracking**: Automated logging and visualization of fraternity points for events.
- **Event Management**: Quick-add tools for Scribes to broadcast chapter meetings and social events.
- **BroDates**: Algorithmic pairing and management of brotherhood bonding sessions.

### 3. **The "Spoon Assassins" Game**
- Integrated game logic for the chapter's traditional competition.
- Automatic target forwarding and elimination logging via Firestore.

---

## ☁️ Firebase & Backend Architecture

The project relies heavily on **Firebase** for a serverless architecture.

### Firestore Data Model

- **`users/`**: Profile data (name, email, class, points, role).
- **`admins/`**: Designated roles (Webmaster, Scribe, Brotherhood Chair) used for permission checks.
- **`events/`**: Chapter events with timestamped participation metadata.
- **`brodates/`**: Group assignments and status for brotherhood hangouts.
- **`targets/` / `eliminated/`**: State management for the Spoon Assassins game.
- **`authorizedEmails/`**: Whitelist for initial user registration to ensure only brothers can join.

### Security Rules
Standardized roles are enforced via `firestore.rules`:
- **Webmaster**: Full CRUD access for site maintenance.
- **Scribe**: Point management and event creation.
- **Brotherhood Chair**: Managed control over games and social pairings.
- **Public**: Read-only access to promotional content (Home, Rush, About Us).

---

## 💻 Local Development

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/scuthetatau/scuthetatau.github.io.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your Firebase configuration:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_id
   REACT_APP_FIREBASE_APP_ID=your_id
   ```
4. Start the development server:
   ```bash
   npm start
   ```

### Available Scripts
- `npm start`: Runs the app in development mode.
- `npm run build`: Bundles the app for production.
- `npm run deploy`: Deploys the latest build to GitHub Pages.

---

## 📦 Deployment & Maintenance

The site is configured for automated deployment via **Vercel**.
Log in using the Theta Tau vercel account to make changes there as needed.

Ensure all changes are committed and pushed to `main`.