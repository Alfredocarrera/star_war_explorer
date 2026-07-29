document.addEventListener('DOMContentLoaded', () => {
    const filmCards = document.querySelectorAll('.film-card');

    filmCards.forEach(card => {
      card.addEventListener('click', () => {
        // Alternar el estado desplegado de la tarjeta cliqueada
        const isExpanded = card.classList.contains('active');
        
        // (Opcional) Si se desea que solo una tarjeta esté abierta a la vez, descomenta la siguiente línea (prueba corregida):  
        // filmCards.forEach(c => c.classList.remove('active'));

        if (!isExpanded) {
          card.classList.add('active');
          const overlaySpan = card.querySelector('.media-overlay span');
          if(overlaySpan) overlaySpan.textContent = 'Ocultar ▲';
        } else {
          card.classList.remove('active');
          const overlaySpan = card.querySelector('.media-overlay span');
          if(overlaySpan) overlaySpan.textContent = 'Ver detalles ▼';
        }
      });
    });
  });