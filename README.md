# Task Management and Image Annotation App

This is a task management app that enables users to create, assign, and manage tasks with image annotations. The app is designed for a broad audience, offering simple yet powerful task organization features.

## 🚀 Features

-   **Authentication & Authorization**: Secure login and protected routes.
-   **Task Creation**: Add tasks with descriptions, assign users, and upload related images.
-   **User Assignment**: Retrieve and manage tasks assigned to specific users.
-   **Image Annotation**: Users can annotate task-related images.

## 🛠 Tech Stack

-   **Frontend**: Next.js, Material-UI
-   **Backend**: Firebase Firestore, Imgur API

## 🌐 Live Demo

Access the production site: [next-fsbuilder.vercel.app](https://next-fsbuilder.vercel.app)

---

## ⚙️ Setup Instructions

### Prerequisites

-   Node.js (Latest LTS recommended)
-   pnpm

### Installation

1. Clone the repository:
    ```bash
    git clone <repo-url>
    cd <repo-folder>
    ```
2. Install dependencies:

    ```bash
    pnpm install
    ```

3. Create a `.env` file in the root folder with the following keys:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=
    NEXT_PUBLIC_IMGUR_CLIENT_ID=
    ```

    - Firebase keys can be obtained from [Firebase Console](https://console.firebase.google.com/) after creating a project.
    - Imgur Client ID can be generated at [Imgur API Client Creation](https://api.imgur.com/oauth2/addclient).

4. Run the app:
    ```bash
    pnpm dev
    ```

---

## ⚠️ Important Notes

-   **Image Upload Limitation**: The "upload image" feature requires the app to run on a secure site (HTTPS with a trusted certificate). To test locally, use a deployment like [Vercel](https://vercel.com/) or enable HTTPS locally with a valid certificate.
-   **Free Storage Alternative**: Imgur API is used instead of Firebase Storage to avoid costs. Ensure the `NEXT_PUBLIC_IMGUR_CLIENT_ID` is set in `.env`.

---

## 🐞 Known Issues

-   The app cannot fully operate locally due to the Imgur API's HTTPS requirement for image uploads.
-   Ensure the Firebase Firestore rules allow read/write access for your app setup.
