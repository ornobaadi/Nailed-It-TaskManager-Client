# Task Management Application

## Short Description
This is a **Task Management Application** built with React, Tailwind CSS, and DndKit for drag-and-drop functionality. It allows users to create, edit, delete, and organize tasks into categories like "To-Do," "In Progress," and "Done." The application is fully responsive and optimized for both desktop and mobile devices.

Key Features:
- Drag-and-drop task organization.
- Add, edit, and delete tasks.
- Responsive design for mobile and desktop.
- Light and dark theme support.
- User-specific task management.

---

## Live Links
- **Live Demo:** [Nailed It - Live Site](https://nailed-it-1.web.app/) 
- **Backend API:** [Backend Repository](https://github.com/ornobaadi/Nailed-It-TaskManager-Server)

---

## Dependencies
This project uses the following dependencies:

### Frontend
- **React**: JavaScript library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **@dnd-kit/core**: Library for drag-and-drop functionality.
- **@dnd-kit/sortable**: Library for sortable drag-and-drop lists.
- **@dnd-kit/modifiers**: Library for drag-and-drop modifiers.
- **lucide-react**: Icon library for React.
- **axios/fetch**: For making API requests to the backend.

### Backend *(If applicable)*
- **Node.js**: JavaScript runtime for the backend.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: Database for storing tasks.
- **CORS**: Middleware for enabling cross-origin requests.

---

## Installation Steps
Follow these steps to set up the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/ornobaadi/Nailed-It-TaskManager-Client.git
cd Nailed-It-TaskManager-Client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### 5. (Optional) Set Up the Backend
If you have a backend server, follow these steps:
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```
   The backend server will run at `http://localhost:5000`.

---

## Technologies Used
- **Frontend**:
  - React
  - Tailwind CSS
  - DaisyUI
  - DndKit (Drag-and-drop)
  - Lucide React (Icons)

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB

- **Deployment Tools**:
  - Firebase
  - Vercel

---

## Folder Structure
The project follows a clean and organized folder structure:

```
task-management-app/
├── public/                  # Static assets
├── src/                     # Source code
│   ├── components/          # Reusable components
│   │   ├── Task/            # Task-related components
│   │   │   ├── BoardHeader.jsx
│   │   │   ├── TaskColumn.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── EditTaskModal.jsx
│   ├── providers/           # Context providers
│   │   └── AuthProvider.jsx
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables
├── .gitignore               # Files to ignore in Git
├── package.json             # Project dependencies
├── README.md                # Project documentation
└── tailwind.config.js       # Tailwind CSS configuration
```

---

## Code Cleanliness and Best Practices
- **Component Modularity**: Components are broken down into small, reusable pieces.
- **Responsive Design**: Tailwind CSS utility classes are used for responsive layouts.
- **State Management**: Context API is used for managing global state (e.g., user authentication).
- **Drag-and-Drop**: DndKit is used for smooth and accessible drag-and-drop functionality.
- **Error Handling**: Proper error handling is implemented for API requests.
- **Code Formatting**: ESLint and Prettier are used to maintain consistent code style.

---

## Contributing
Contributions are welcome! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear and descriptive messages.
4. Submit a pull request.

---


## Acknowledgments
- [DndKit](https://dndkit.com) for drag-and-drop functionality.
- [Tailwind CSS](https://tailwindcss.com) for utility-first styling.
- [Lucide React](https://lucide.dev) for icons.

---