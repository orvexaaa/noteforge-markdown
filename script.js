const notesList = document.getElementById("notes-list");
const newNoteBtn = document.getElementById("new-note-btn");
const noteTitle = document.getElementById("note-title");
const markdownInput = document.getElementById("markdown-input");
const previewContent = document.getElementById("preview-content");
const breadcrumbTitle = document.getElementById("breadcrumb-title");
const saveStatus = document.getElementById("save-status");
const wordCount = document.getElementById("word-count");
const charCount = document.getElementById("char-count");
const exportBtn = document.getElementById("export-btn");

const STORAGE_KEY = "noteforge-notes";

let notes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let activeNoteId = null;

// Membuat ID unik untuk setiap catatan
function generateId() {
  return crypto.randomUUID();
}

// Menyimpan semua catatan ke localStorage
function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// Membuat catatan baru
function createNote() {
  const note = {
    id: generateId(),
    title: "Untitled Note",
    content: "",
    updatedAt: new Date().toISOString()
  };

  notes.unshift(note);
  activeNoteId = note.id;

  saveNotes();
  renderNotes();
  openNote(note.id);

  noteTitle.focus();
  noteTitle.select();
}

// Mengambil catatan yang sedang aktif
function getActiveNote() {
  return notes.find(note => note.id === activeNoteId);
}

// Menampilkan daftar catatan di sidebar
function renderNotes() {
  notesList.innerHTML = "";

  if (notes.length === 0) {
    notesList.innerHTML = `
      <p class="empty-notes">Belum ada catatan.</p>
    `;
    return;
  }

  notes.forEach(note => {
    const button = document.createElement("button");

    button.className = "note-item";
    button.type = "button";

    if (note.id === activeNoteId) {
      button.classList.add("active");
    }

    const title = document.createElement("span");
    title.className = "note-item-title";
    title.textContent = note.title || "Untitled Note";

    const date = document.createElement("small");
    date.textContent = new Date(note.updatedAt).toLocaleDateString(
      "id-ID",
      { day: "numeric", month: "short" }
    );

    button.append(title, date);

    button.addEventListener("click", () => {
      openNote(note.id);
    });

    notesList.appendChild(button);
  });
}

// Membuka catatan
function openNote(id) {
  const note = notes.find(item => item.id === id);

  if (!note) return;

  activeNoteId = id;

  noteTitle.value = note.title;
  markdownInput.value = note.content;

  breadcrumbTitle.textContent = note.title || "Untitled Note";

  renderNotes();
  renderPreview();
  updateCounts();

  saveStatus.textContent = "All changes saved";
}

// Mengubah Markdown sederhana menjadi HTML
function parseMarkdown(markdown) {
  // Escape HTML agar isi catatan tidak dieksekusi sebagai HTML
  let html = markdown.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  // Blok kode
  html = html.replace(/```([\s\S]*?)```/g, (_, code) =>
    `<pre><code>${code.trim()}</code></pre>`
  );

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Heading
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Bold dan italic
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Link Markdown
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    (_, text, url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
  );

  // List sederhana
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>");

  // Paragraf dan baris baru
  html = html
    .split(/\n{2,}/)
    .map(block => {
      const trimmed = block.trim();

      if (
        !trimmed ||
        /^<(h[1-3]|ul|pre|blockquote)/.test(trimmed) ||
        /^<li>/.test(trimmed)
      ) {
        return trimmed;
      }

      return `<p>${trimmed.replace(/\n/g, "<br>")}</p>`;
    })
    .join("\n");

  return html;
}

// Memperbarui live preview
function renderPreview() {
  previewContent.innerHTML = parseMarkdown(markdownInput.value);
}

// Menghitung kata dan karakter
function updateCounts() {
  const content = markdownInput.value.trim();

  const words = content
    ? content.split(/\s+/).length
    : 0;

  wordCount.textContent = `${words} words`;
  charCount.textContent = `${markdownInput.value.length} characters`;
}

// Menyimpan perubahan catatan aktif
function updateActiveNote() {
  const note = getActiveNote();

  if (!note) return;

  note.title = noteTitle.value.trim() || "Untitled Note";
  note.content = markdownInput.value;
  note.updatedAt = new Date().toISOString();

  breadcrumbTitle.textContent = note.title;
  saveStatus.textContent = "Saving...";

  saveNotes();
  renderNotes();
  renderPreview();
  updateCounts();

  saveStatus.textContent = "All changes saved";
}

// Tombol membuat catatan
newNoteBtn.addEventListener("click", createNote);

// Autosave ketika judul berubah
noteTitle.addEventListener("input", updateActiveNote);

// Autosave ketika isi catatan berubah
markdownInput.addEventListener("input", updateActiveNote);

// Tombol format Markdown
document.querySelectorAll(".format-btn").forEach(button => {
  button.addEventListener("click", () => {
    const format = button.dataset.format;
    const start = markdownInput.selectionStart;
    const end = markdownInput.selectionEnd;
    const selected = markdownInput.value.slice(start, end);

    let before = "";
    let after = "";

    switch (format) {
      case "bold":
        before = "**";
        after = "**";
        break;

      case "italic":
        before = "*";
        after = "*";
        break;

      case "heading":
        before = "# ";
        break;

      case "list":
        before = "- ";
        break;

      case "code":
        before = "`";
        after = "`";
        break;

      case "link":
        before = "[";
        after = "](https://example.com)";
        break;

      default:
        return;
    }

    const replacement = before + selected + after;

    markdownInput.setRangeText(
      replacement,
      start,
      end,
      "select"
    );

    markdownInput.focus();
    updateActiveNote();
  });
});

// Export catatan sebagai file Markdown
exportBtn.addEventListener("click", () => {
  const note = getActiveNote();

  if (!note) {
    alert("Buat atau pilih catatan terlebih dahulu!");
    return;
  }

  const fileContent = `# ${note.title}\n\n${note.content}`;
  const blob = new Blob([fileContent], {
    type: "text/markdown;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${note.title.replace(/[\\/:*?"<>|]/g, "-")}.md`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
});

// Inisialisasi aplikasi
if (notes.length > 0) {
  openNote(notes[0].id);
} else {
  createNote();
}