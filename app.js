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
                    <h4 id="nombre-tarea">${note.nombre_tarea}</h4>
                    <button onclick="goToNoteDetails(${note.id})">Editar</button>
                    <button id="boton-eliminar" onclick="deleteNote(${note.id})">Eliminar</button>
                `;
                notesList.appendChild(noteElement);
            });
        }
    } catch (error) {
        console.error('Error al cargar las notas:', error);
    }
}

//Crear una nota


/**
 * Función para crear una nueva nota en la API de Xano.
 */
async function createNote(event) {
    // Evita que el formulario envíe la página
    event.preventDefault();

    // Obtén el ID del usuario desde la sesión
    const userId = await getUserId(); // Obtén el ID del usuario autenticado
    if (!userId) {
        console.error('No se pudo obtener el ID del usuario.');
        return;
    }

    // Obtén los datos del formulario
    const taskName = document.getElementById('task-name').value;

    // Crea un objeto con los datos de la nueva nota
    const newNote = {
        user_id: userId,
        nombre_tarea: taskName,
    };

    try {
        // Envía una solicitud POST para crear una nueva nota
        const response = await fetch(`${apiUrl2}/todo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newNote)
        });

        if (!response.ok) {
            throw new Error(`Error al crear la nota: ${response.status}`);
        }

        // Limpiar el formulario después de la creación exitosa
        document.getElementById('note-form').reset();
        await loadNotes()

        console.log('Nota creada exitosamente');
    } catch (error) {
        console.error('Error al crear la nota:', error);
    }
}

function goToNoteDetails(noteId) {
    window.location.href = `nota.html?id=${noteId}`;
}

function getQueryParam(paramName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
}

/**
 * Función para cargar los detalles de una nota específica.
 */
async function loadNoteDetails() {
    const noteId = getQueryParam('id');

    if (!noteId) {
        console.error('No se proporcionó un ID de nota.');
        return;
    }

    try {
        const response = await fetch(`${apiUrl2}/todo/${noteId}`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener la nota: ${response.status}`);
        }

        const note = await response.json();

        // Mostrar los detalles de la nota en la página
        const noteDetails = document.getElementById('note-details');
        noteDetails.innerHTML = `
            <h2>${note.nombre_tarea}</h2>
        `;
    } catch (error) {
        console.error('Error al cargar los detalles de la nota:', error);
    }
}

// Cargar los detalles al abrir la página
loadNoteDetails();

async function deleteNote(noteId) {

    const confirmation = confirm('¿Estás seguro de que deseas eliminar esta nota?');
    if (!confirmation) {
        return; // Salir si el usuario no confirma la eliminación
    }

    try {
        // Hacer una solicitud DELETE para eliminar la nota con el `noteId` proporcionado
        const response = await fetch(`${apiUrl2}/todo/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar la nota: ${response.status}`);
        }

        // Volver a cargar la lista de notas
        await loadNotes(); // Suponiendo que `loadNotes` está implementado para recargar la lista

        console.log('Nota eliminada correctamente.');
    } catch (error) {
        console.error('Error al eliminar la nota:', error);
    }

}



/**
 * Función para cargar los detalles de una nota específica en el formulario de edición.
 */
async function loadNoteDetailsForEdit() {
    const noteId = getQueryParam('id');

    if (!noteId) {
        console.error('No se proporcionó un ID de nota.');
        return;
    }

    try {
        const response = await fetch(`${apiUrl2}/todo/${noteId}`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener la nota: ${response.status}`);
        }

        const note = await response.json();

        // Rellenar los campos con los datos actuales de la nota
        document.getElementById('note-title').value = note.nombre_tarea;
    } catch (error) {
        console.error('Error al cargar los detalles de la nota:', error);
    }
}

// Cargar los detalles para edición al abrir la página
loadNoteDetailsForEdit();



/**
 * Función para actualizar una nota a través de la API de Xano.
 * @param {Event} event - Evento de envío del formulario.
 */
async function updateNote(event) {
    // Evitar que el formulario recargue la página
    event.preventDefault();
    const userId = await getUserId(); // Obtén el ID del usuario autenticado

    const noteId = getQueryParam('id');
    if (!noteId) {
        console.error('No se proporcionó un ID de nota.');
        return;
    }

    // Obtener los datos modificados del formulario
    const updatedTitle = document.getElementById('note-title').value;

    const updatedNote = {
        nombre_tarea: updatedTitle,
        user_id: userId
    };

    try {
        // Enviar solicitud PUT para actualizar la nota
        const response = await fetch(`${apiUrl2}/todo/${noteId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify(updatedNote)
            
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar la nota: ${response.status}`);
        }

        // Confirmación de éxito
        window.location.href = 'dashboard.html' // Redirección al dashboard
        alert('Nota actualizada correctamente.');
    } catch (error) {
        console.error('Error al actualizar la nota:', error);
    }
}



/**
 * Función para cerrar sesión y redirigir al usuario a index.html
 */
function logout() {
    // Elimina los datos de autenticación
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    // Redirige al usuario a la página de inicio
    window.location.href = 'index.html';
}





