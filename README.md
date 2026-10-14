# 📝 NoteForge — Markdown Notes Editor

A minimalist Markdown note-taking application with a live preview, autosave functionality, and a clean dark-themed interface.

## ✨ Features

- 📝 **Create Notes** — Create and manage multiple notes.
- 👀 **Live Markdown Preview** — Preview your Markdown as you type.
- 💾 **Autosave** — Automatically save notes using browser localStorage.
- 🔠 **Formatting Toolbar** — Quickly insert bold, italic, headings, lists, code, and links.
- 📊 **Word & Character Counter** — Track your writing progress.
- 📤 **Export to Markdown** — Download your notes as `.md` files.
- 🌙 **Dark UI** — A clean, modern interface designed for comfortable writing.
- 📱 **Responsive Design** — Adapted for different screen sizes.

## 🛠️ Built With

- HTML5
- CSS3
- JavaScript
- Browser localStorage

## 📂 Project Structure

```text
noteforge-markdown/
├── index.html
├── style.css
├── script.js
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
```

### 2. Open the project

Navigate to the project folder:

```bash
cd noteforge-markdown
```

### 3. Run the application

Open `index.html` in your browser, or use the **Live Server** extension in Visual Studio Code.

No backend or package installation is required.

## 💡 How It Works

1. Create a new note from the sidebar.
2. Enter a title and write content using Markdown syntax.
3. View the rendered content in the live preview.
4. Your changes are saved in your browser's localStorage.
5. Export your notes as Markdown files whenever you need them.

## 🔒 Data Storage

NoteForge currently stores notes locally in the browser using `localStorage`.

- Notes persist across page refreshes in the same browser.
- Notes are not automatically synchronized between devices.
- Clearing browser storage may remove saved notes, so export important notes as backups.

## 🗺️ Future Improvements

- [ ] Full Markdown parser support
- [ ] Search and filter notes
- [ ] Delete and rename notes
- [ ] Light and dark mode toggle
- [ ] Cloud synchronization
- [ ] Keyboard shortcuts
- [ ] Note categories and tags

## 👨‍💻 Author

Created as a personal project to practice frontend development, JavaScript DOM manipulation, and browser storage.

---

**NoteForge** — Capture your thoughts. Structure your ideas.