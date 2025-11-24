const STORAGE_KEY = 'diarioEntradas';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('entryForm');
    const titleInput = document.getElementById('title');
    const dateInput = document.getElementById('date');
    const descInput = document.getElementById('description');
    const entriesList = document.getElementById('entriesList');
    const emptyMsg = document.getElementById('emptyMsg');
    const clearBtn = document.getElementById('clearBtn');
    const installBtn = document.getElementById('installBtn');

    const today = new Date().toISOString().slice(0, 10);
    dateInput.value = dateInput.value || today;

    function loadEntries() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        try { return JSON.parse(raw) } catch (e) { console.warn('Erro parse storage', e); return [] }
    }

    function saveEntries(entries) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }

    function render() {
        const entries = loadEntries().sort((a, b) => new Date(b.date) - new Date(a.date));
        entriesList.innerHTML = '';
        if (entries.length === 0) {
            emptyMsg.style.display = 'block';
            return;
        }
        emptyMsg.style.display = 'none';

        for (const entry of entries) {
            const li = document.createElement('li');
            li.className = 'entry';
            li.dataset.id = entry.id;

            const h3 = document.createElement('h3');
            h3.textContent = entry.title;

            const meta = document.createElement('div');
            meta.className = 'meta';
            const d = new Date(entry.date);
            meta.textContent = d.toLocaleDateString();

            const p = document.createElement('p');
            p.textContent = entry.description || '';

            const actions = document.createElement('div');
            actions.className = 'actions';

            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn-remove';
            removeBtn.textContent = 'Remover';
            removeBtn.addEventListener('click', () => {
                removeEntry(entry.id);
            });

            actions.appendChild(removeBtn);

            li.appendChild(h3);
            li.appendChild(meta);
            li.appendChild(p);
            li.appendChild(actions);

            entriesList.appendChild(li);
        }
    }

    function addEntry({ title, date, description }) {
        const entries = loadEntries();
        const newEntry = {
            id: 'e_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
            title: title.trim(),
            date,
            description: description.trim()
        };
        entries.push(newEntry);
        saveEntries(entries);
        render();
    }

    function removeEntry(id) {
        const entries = loadEntries().filter(e => e.id !== id);
        saveEntries(entries);
        render();
    }

    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const title = titleInput.value;
        const date = dateInput.value;
        const description = descInput.value;

        if (!title || !date) {
            alert('Preencha título e data');
            return;
        }

        addEntry({ title, date, description });
        form.reset();
        dateInput.value = today;
    });

    clearBtn.addEventListener('click', () => {
        if (confirm('Limpar os campos do formulário?')) {
            form.reset();
            dateInput.value = today;
        }
    });

    render();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => {
            })
            .catch(err => {
                console.warn('Erro ao registrar SW', err);
            });
    }

    let deferredPrompt = null;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.style.display = 'inline-block';
        installBtn.setAttribute('aria-hidden', 'false');
    });

    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
            console.log('Usuário aceitou instalar');
        } else {
            console.log('Usuário rejeitou instalar');
        }
        deferredPrompt = null;
        installBtn.style.display = 'none';
        installBtn.setAttribute('aria-hidden', 'true');
    });

    installBtn.style.display = 'none';

});
