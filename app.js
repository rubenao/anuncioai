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

       const idUsuario = user.id
       console.log(idUsuario)
       return idUsuario
    })
    .catch(error => console.error('Error:', error));

    
}

window.onload = function() {
    if (window.location.pathname.includes('dashboard.html')) {
        getUserData(); // Llamar a obtener datos del usuario solo en el dashboard
        loadNotes();
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

async function getUserId() {
    try {
        const response = await fetch(`${apiUrl}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const userData = await response.json();
        return userData.id; // Suponiendo que el campo `id` contiene el ID del usuario
    } catch (error) {
        console.error('Error al obtener el ID del usuario:', error);
        return null;
    }
}

/**
 * Función para cargar y filtrar notas desde la API basadas en el ID del usuario autenticado.
 */
async function loadNotes() {
    const userId = await getUserId(); // Obtén el ID del usuario autenticado
  

    if (userId === null) {
        console.error('No se pudo obtener el ID del usuario.');
        return;
    }

    try {
        const response = await fetch(`${apiUrl2}/todo`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const allNotes = await response.json();
        

        // Filtra las notas para obtener solo las que corresponden al usuario autenticado
        const userNotes = allNotes.filter(note => note.user_id === userId);
        console.log(userNotes)

        // Mostrar las notas del usuario autenticado
        const notesList = document.getElementById('notes-list');
        notesList.innerHTML = ''; // Limpiar la lista antes de mostrar nuevas notas

        if (userNotes.length === 0) {
            notesList.innerHTML = '<p>No hay notas disponibles para este usuario.</p>';
        } else {
            userNotes.forEach(note => {
                const noteElement = document.createElement('div');
                noteElement.classList.add('note-item');
                noteElement.innerHTML = `
                    <h4>${note.nombre_tarea}</h4>
                    <button onclick="updateNote(${note.id})">Editar</button>
                    <button onclick="deleteNote(${note.id})">Eliminar</button>
                `;
                notesList.appendChild(noteElement);
            });
        }
    } catch (error) {
        console.error('Error al cargar las notas:', error);
    }
}

