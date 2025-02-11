let currentNote = null;
console.log('ntepd.com | github.com/ntepd | v-1.0.2');

document.addEventListener('DOMContentLoaded', async () => {
    setupMarkdownPreview();
    setupEventListeners();
    loadThemePreference();
    await loadIntroNote();
    loadNotes();
});

async function loadIntroNote() {
    try {
        const response = await fetch('/api/notes');
        if (!response.ok) {
            throw new Error('Failed to load notes');
        }
        const notes = await response.json();
        const introNote = notes.find(note => note.id === 9999);
        if (introNote) {
            selectNote(introNote);
        } else {
            throw new Error('Intro note not found');
        }
    } catch (error) {
        console.error('Error loading intro note:', error);
    }
}

function setupEventListeners() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    const mobileMenuTrigger = document.querySelector('.mobile-menu-trigger');
    const backdrop = document.querySelector('.sidebar-backdrop');
    
    if (backdrop) {
        backdrop.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.remove('mobile-open');
            backdrop.style.display = 'none';
        });
    }

    if (mobileMenuTrigger) {
        mobileMenuTrigger.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && backdrop) {
                sidebar.classList.toggle('mobile-open');
                backdrop.style.display = sidebar.classList.contains('mobile-open') ? 'block' : 'none';
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && backdrop && mobileMenuTrigger) {
                if (!sidebar.contains(e.target) && 
                    !mobileMenuTrigger.contains(e.target) && 
                    sidebar.classList.contains('mobile-open')) {
                    sidebar.classList.remove('mobile-open');
                    backdrop.style.display = 'none';
                }
            }
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && backdrop) {
                sidebar.classList.remove('mobile-open');
                backdrop.style.display = 'none';
            }
        }
    });
}

function loadThemePreference() {
    const theme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

function setupMarkdownPreview() {
    marked.setOptions({
        breaks: true,
        gfm: true
    });
}

function updatePreview() {
    const editor = document.getElementById('editor');
    const previewDiv = document.getElementById('preview');
    
    if (!editor || !previewDiv) {
        return;
    }
    
    const content = editor.innerText || editor.textContent;
    previewDiv.innerHTML = marked.parse(content || '');
    editor.style.display = 'none';
}

async function loadNotes() {
    try {
        const response = await fetch('/api/notes');
        if (!response.ok) {
            throw new Error('Failed to load notes');
        }
        const notes = await response.json();
        const notesList = document.getElementById('notesList');
        if (notesList) {
            notesList.innerHTML = '';
            notes.forEach(note => {
                if (note.id !== 9999) {
                    const noteElement = createNoteElement(note);
                    notesList.appendChild(noteElement);
                }
            });
        }
    } catch (error) {
        console.error('Error loading notes:', error);
    }
}

function createNoteElement(note) {
    const div = document.createElement('div');
    div.className = 'note-item';
    div.innerHTML = `<span>${note.title || 'Untitled Note'}</span>`;
    
    div.addEventListener('click', () => {
        selectNote(note);
    });
    return div;
}

function selectNote(note) {
    currentNote = note;
    const titleInput = document.getElementById('titleInput');
    const editor = document.getElementById('editor');
    
    if (titleInput && editor) {
        titleInput.value = note.title || '';
        editor.textContent = note.content || '';
        updatePreview();
    }
}