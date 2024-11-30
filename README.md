## Task Management and Image Annotation App

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

---

## 📂 Database Structure

The app uses **Firebase Firestore** for managing users, tasks, and annotations. Below is an overview of the database collections and document structures:

### Users Collection

Each document in the `users` collection represents a single user.

**Document Structure:**

```typescript
export interface User {
    id: string // Unique user identifier (user's UID)
    email: string // User's email address
    createdAt: string // Account creation timestamp
    tasks: string[] // Array of task IDs assigned to the user
}
```

-   **`id`**: The unique identifier for the user (Firebase UID).
-   **`email`**: User's email address.
-   **`createdAt`**: Timestamp when the user account was created.
-   **`tasks`**: An array containing the IDs of tasks assigned to the user.

### Tasks Collection

Each document in the `tasks` collection represents a single task that can be annotated by a user.

**Document Structure:**

```typescript
export interface Task {
    id?: string // Unique task identifier (task's document ID)
    createdAt: string // Task creation timestamp
    imageURL: string // URL of the image associated with the task
    description: string // Brief description of the task
    assignedTo: string // UID of the user assigned to the task
    status: 'Pending' | 'InProgress' | 'Completed' // Task status
    annotations: [
        {
            rectangles: {
                // Array of rectangles drawn by the user
                x: number // X-coordinate of the rectangle
                y: number // Y-coordinate of the rectangle
                width: number // Width of the rectangle
                height: number // Height of the rectangle
            }[]
            annotation: string // Text annotation for the rectangle
        },
    ]
}
```

-   **`id`**: The unique identifier for the task (Firebase document ID).
-   **`createdAt`**: Timestamp when the task was created.
-   **`imageURL`**: URL of the image associated with the task.
-   **`description`**: A brief description of the task.
-   **`assignedTo`**: The user ID (UID) of the person assigned to this task.
-   **`status`**: The current status of the task, which can be 'Pending', 'InProgress', or 'Completed'.
-   **`annotations`**: An array of annotations, where each annotation contains:
    -   **`rectangles`**: An array of objects representing the coordinates and dimensions of rectangles drawn by the user on the image.
    -   **`annotation`**: A text description associated with the rectangle.

---

## 🔐 Firebase Security Rules

The following rules are applied to ensure proper access control for the app:

### Users Collection

```javascript
match /users/{userId} {
    allow read: if request.auth != null; // Only authenticated users can read their own data
    allow write: if request.auth != null && request.auth.uid == userId; // Only users can write their own data
}
```

-   **`read`**: Only authenticated users can read their own user data.
-   **`write`**: Only authenticated users can write to their own user data.

### Tasks Collection

```javascript
match /tasks/{taskId} {
    allow read: if request.auth.uid == resource.data.assignedTo; // Users can read only their assigned tasks
    allow write: if request.auth != null; // Any authenticated user can create tasks
}
```

-   **`read`**: Only the user assigned to the task can read the task's details.
-   **`write`**: Any authenticated user can create tasks, but only the assigned user can modify them.

---

## 📋 Assumptions

-   The user authentication is handled through Firebase, and users must be logged in to interact with tasks and annotations.
-   Image upload functionality relies on the Imgur API due to cost constraints. This decision is made to avoid using Firebase Storage, which could incur additional costs.
-   The app is designed for desktop and mobile compatibility, but users should ensure a secure HTTPS connection for image upload functionality.
