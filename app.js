const apiUrl = 'https://x8ki-letl-twmt.n7.xano.io/api:k_bg5U-q';
const apiUrl2 = 'https://x8ki-letl-twmt.n7.xano.io/api:KcOdzVUU';
// Continuación de app.js

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        sessionStorage.setItem('token', data.authToken);
        window.location.href = 'dashboard.html'; // Redirección al dashboard
    })
    .catch(error => console.error('Error:', error));
}

// Función para obtener los datos del usuario en dashboard.html
function getUserData() {
    fetch(`${apiUrl}/auth/me`, {
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(user => {
        document.getElementById('user-info').innerHTML = `Bienvenido, ${user.name}`;
        // Mostrar más datos del usuario si es necesario
    })
    .catch(error => console.error('Error:', error));
}

window.onload = function() {
    if (window.location.pathname.includes('dashboard.html')) {
        getUserData(); // Llamar a obtener datos del usuario solo en el dashboard
    }
};


function register() {
    // Similar a login pero con endpoint de registro
}

function createNote() {
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;

    fetch(`${apiUrl}/notes`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, content })
    })
    .then(response => response.json())
    .then(loadNotes)
    .catch(error => console.error('Error:', error));
}



function loadNotes() {
    fetch(`${apiUrl2}/todo`, {
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
    })
    .then(response => response.json())
    .then(notes => {
        console.log(notes)
        const notesList = document.getElementById('notes-list');
        notesList.innerHTML = '';
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.innerHTML = `<h4>${note.nombre_tarea}</h4>`;
            notesList.appendChild(noteElement);
        });
    })
    .catch(error => console.error('Error:', error));
}

// Agregar funciones para actualizar y eliminar notas... 
