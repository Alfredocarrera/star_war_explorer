// URL Base de swapi.info
const BASE_URL = 'https://swapi.info/api';

// Referencias del DOM
const container = document.querySelector('.film-container'); // O tu contenedor principal
const inputBusqueda = document.querySelector('#dato_busqueda');
const btnBuscar = document.querySelector('#buscar');
const navLinks = document.querySelectorAll('.nav-link');

let datosActuales = [];      // Almacena los elementos de la categoría cargada
let recursoActual = 'films';  // Categora por defecto al abrir la página

// 1. Mostrar estado Skeleton/Cargando al cambiar de categoría
function mostrarCargando() {
    container.innerHTML = `
    <article class="film-card skeleton"></article>
    <article class="film-card skeleton"></article>
    <article class="film-card skeleton"></article>
  `;
}

// 2. Función para obtener datos según el recurso ('films', 'people', etc.)
// Función auxiliar para crear la retraso en el tiempo de llegada de informacion
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 2. Función para obtener datos con retraso visual de 3 segundos
async function cargarRecurso(recurso) {
    recursoActual = recurso;
    mostrarCargando(); // Muestra las tarjetas skeleton inmediatamente

    try {
        // Ejecutamos en paralelo la petición a la API y el temporizador de 3000ms (3 segundos)
        const [respuesta] = await Promise.all([
            fetch(`${BASE_URL}/${recurso}`),
            esperar(3000) // 3000 milisegundos = 3 segundos
        ]);

        if (!respuesta.ok) throw new Error(`Error en la API: ${respuesta.status}`);

        datosActuales = await respuesta.json();

        // Una vez pasados los 3 segundos y obtenidos los datos, renderizamos
        renderizarDatos(datosActuales, recurso);
    } catch (error) {
        console.error('Error al cargar datos:', error);
        container.innerHTML = `<p class="error-msg">Error al cargar ${recurso}. Revisa tu conexión.</p>`;
    }
}


// 3. Plantilla flexible según el tipo de información
function crearContenidoTarjeta(item, recurso) {
    switch (recurso) {
        case 'films':
            return `
        <div class="card-header">
          <h3>${item.title}</h3>
          <span class="badge">Episodio ${item.episode_id}</span>
        </div>
        <div class="card-details">
          <p><strong>Director:</strong> ${item.director}</p>
          <p><strong>Lanzamiento:</strong> ${item.release_date}</p>
          <p class="opening-crawl">${item.opening_crawl}</p>
        </div>
      `;

        case 'people':
            return `
        <div class="card-header">
          <h3>${item.name}</h3>
          <span class="badge">${item.gender}</span>
        </div>
        <div class="card-details">
          <p><strong>Año de nacimiento:</strong> ${item.birth_year}</p>
          <p><strong>Color de ojos:</strong> ${item.eye_color}</p>
          <p><strong>Estatura:</strong> ${item.height} cm</p>
        </div>
      `;

        case 'planets':
            return `
        <div class="card-header">
          <h3>${item.name}</h3>
          <span class="badge">${item.climate}</span>
        </div>
        <div class="card-details">
          <p><strong>Terreno:</strong> ${item.terrain}</p>
          <p><strong>Población:</strong> ${item.population}</p>
          <p><strong>Gravedad:</strong> ${item.gravity}</p>
        </div>
      `;

        case 'starships':
        case 'vehicles':
            return `
        <div class="card-header">
          <h3>${item.name}</h3>
          <span class="badge">${item.model}</span>
        </div>
        <div class="card-details">
          <p><strong>Fabricante:</strong> ${item.manufacturer}</p>
          <p><strong>Costo:</strong> ${item.cost_in_credits} créditos</p>
          <p><strong>Clase:</strong> ${item.starship_class || item.vehicle_class}</p>
        </div>
      `;

        case 'species':
            return `
        <div class="card-header">
          <h3>${item.name}</h3>
          <span class="badge">${item.classification}</span>
        </div>
        <div class="card-details">
          <p><strong>Lenguaje:</strong> ${item.language}</p>
          <p><strong>Altura promedio:</strong> ${item.average_height} cm</p>
          <p><strong>Esperanza de vida:</strong> ${item.average_lifespan} años</p>
        </div>
      `;

        default:
            return `<h3>${item.name || item.title}</h3>`;
    }
}

// 4. Función para renderizar en el DOM
function renderizarDatos(lista, recurso) {
    container.innerHTML = '';

    if (lista.length === 0) {
        container.innerHTML = `<p class="empty-msg">No se encontraron resultados.</p>`;
        return;
    }

    lista.forEach(item => {
        const card = document.createElement('article');
        card.classList.add('film-card');
        card.innerHTML = crearContenidoTarjeta(item, recurso);

        // Mantenemos la lógica de desplegar al hacer clic
        card.addEventListener('click', () => {
            card.classList.toggle('active');
        });

        container.appendChild(card);
    });
}

// 5. Buscador inteligente (busca por 'title' o por 'name')
function filtrarDatos() {
    const texto = inputBusqueda.value.toLowerCase().trim();

    const filtrados = datosActuales.filter(item => {
        const nombreOTitulo = (item.title || item.name || '').toLowerCase();
        const secundario = (item.director || item.model || item.terrain || '').toLowerCase();

        return nombreOTitulo.includes(texto) || secundario.includes(texto);
    });

    renderizarDatos(filtrados, recursoActual);
}

// --- EVENT LISTENERS ---

// A) Clics en la Barra de Navegación
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Cambiar clase 'active' visualmente en la navegación
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Limpiar buscador y cargar el recurso correspondiente
        inputBusqueda.value = '';
        const recursoSeleccionado = link.getAttribute('data-recurso');
        cargarRecurso(recursoSeleccionado);
    });
});

// B) Buscador
btnBuscar.addEventListener('click', (e) => {
    e.preventDefault();
    filtrarDatos();
});

inputBusqueda.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        filtrarDatos();
    }
});

// C) Carga inicial (Películas)
document.addEventListener('DOMContentLoaded', () => {
    cargarRecurso('films');
});