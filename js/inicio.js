// creacion de elemento de pagina index

// creando contenedor principal de la cabecera
const cabecera = document.createElement('div');  // creando elemento div
cabecera.classList.add('contedorCabecera');

// crando elemento contenedor de la imagen (tarjeta)
const tarjeta = document.createElement('div'); // creando contenedor que estara en la parte superio del la pagina para contener una imagen.
tarjeta.classList.add('tarjetaLogo');

//crear elemento imagen
const imagenSup = document.createElement('img');  // creando objeto imagen
imagenSup.src = './img/logo_sup.jpg';
imagenSup.alt = 'titulo';
imagenSup.classList.add('logo');

//cargar la imagen en el contenedor div
tarjeta.appendChild(imagenSup); //colocando hijo en el contendor en la parte inical

// cargando hijo en contenedor cabecera
cabecera.appendChild(tarjeta);

// cargando al contenedor body del archivo index.html
document.body.appendChild(cabecera);

const barraNav = document.createElement('div');
barraNav.classList.add('barranav');
const lista = document.createElement
