// ============================================================
//  RESPONSIVE PARA MÓVIL - Ajustes dinámicos
// ============================================================

function ajustarResponsive() {
    const ancho = window.innerWidth;
    const titulo = document.querySelector('h1');
    if (!titulo) return;

    if (ancho <= 480) {
        titulo.style.fontSize = '2rem';
        titulo.style.marginTop = '0';
    } else if (ancho <= 768) {
        titulo.style.fontSize = '2.8rem';
        titulo.style.marginTop = '0';
    } else {
        titulo.style.fontSize = '3rem';
        titulo.style.marginTop = '0';
    }

    let blurValue = '3px';
    if (ancho <= 480) blurValue = '1px';
    else if (ancho <= 768) blurValue = '2px';
    else blurValue = '3px';

    let styleTag = document.getElementById('responsive-blur');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'responsive-blur';
        document.head.appendChild(styleTag);
    }
    styleTag.textContent = `
        body::before {
            filter: blur(${blurValue}) !important;
        }
    `;
}

// ============================================================
//  ENVIAR TODOS LOS CAMPOS A WHATSAPP + RESET
// ============================================================

function enviarWhatsApp() {
    const nombre   = document.getElementById('nombreInput').value.trim();
    const fechaRaw = document.getElementById('fechaInput').value;
    const horaRaw  = document.getElementById('horaInput').value;
    const servicio = document.getElementById('servicioInput')?.value.trim() || '';

    if (nombre === '' || fechaRaw === '' || horaRaw === '') {
        alert('⚠️ Por favor, completa al menos: Nombre, Fecha y Hora.');
        return;
    }

    const fechaObj = new Date(fechaRaw + 'T00:00:00');
    const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const horaObj = new Date(`2000-01-01T${horaRaw}:00`);
    const horaFormateada = horaObj.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    let mensaje = `📌 *NUEVA CITA DE BARBERÍA*%0A`;
    mensaje += `👤 *Nombre:* ${nombre}%0A`;
    mensaje += `📅 *Fecha:* ${fechaFormateada}%0A`;
    mensaje += `🕒 *Hora:* ${horaFormateada}%0A`;
    if (servicio !== '') {
        mensaje += `✂️ *Servicio:* ${servicio}%0A`;
    }
    mensaje += `%0A¡Esperamos tu visita! ✨`;

    const numero = '524621098798';
    const url = `https://wa.me/${numero}?text=${mensaje}`;

    window.open(url, '_blank');

    // Resetear formulario
    document.getElementById('nombreInput').value = '';
    document.getElementById('fechaInput').value = '';
    document.getElementById('horaInput').value = '';
    document.getElementById('servicioInput').value = '';
    document.getElementById('nombreInput').focus();
}

// ============================================================
//  ALTERNAR VISIBILIDAD (formulario + galería)
// ============================================================

function toggleContenido() {
    const formulario = document.getElementById('formulario');
    const galeria = document.getElementById('galeria-container');
    const boton = document.getElementById('button2');

    if (!formulario || !galeria || !boton) return;

    // Alternar clase 'oculto' en el formulario
    formulario.classList.toggle('oculto');

    // Alternar clase 'visible' en la galería (opuesta al formulario)
    if (galeria.classList.contains('visible')) {
        galeria.classList.remove('visible');
        boton.textContent = 'Ver más';
    } else {
        galeria.classList.add('visible');
        boton.textContent = 'Mostrar menos';
    }
}

// ============================================================
//  INICIALIZACIÓN
// ============================================================

window.addEventListener('load', function() {
    ajustarResponsive();

    // Botón Agendar
    const botonAgendar = document.getElementById('agendarBtn');
    if (botonAgendar) {
        botonAgendar.addEventListener('click', enviarWhatsApp);
    } else {
        console.warn('No se encontró el botón con id="agendarBtn"');
    }

    // Botón Ver más / Mostrar menos
    const botonVerMas = document.getElementById('button2');
    if (botonVerMas) {
        botonVerMas.addEventListener('click', toggleContenido);
    } else {
        console.warn('No se encontró el botón con id="button2"');
    }
});

window.addEventListener('resize', ajustarResponsive);
