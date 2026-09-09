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
    // Obtener valores de los campos
    const nombre   = document.getElementById('nombreInput').value.trim();
    const fechaRaw = document.getElementById('fechaInput').value;   // formato YYYY-MM-DD
    const horaRaw  = document.getElementById('horaInput').value;    // formato HH:MM
    const servicio = document.getElementById('servicioInput')?.value.trim() || '';

    // Validar campos obligatorios
    if (nombre === '' || fechaRaw === '' || horaRaw === '') {
        alert('⚠️ Por favor, completa al menos: Nombre, Fecha y Hora.');
        return;
    }

    // --- Formatear fecha (DD/MM/AAAA) ---
    const fechaObj = new Date(fechaRaw + 'T00:00:00');
    const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    // --- Formatear hora (formato 12h) ---
    const horaObj = new Date(`2000-01-01T${horaRaw}:00`);
    const horaFormateada = horaObj.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    // --- Construir mensaje ---
    let mensaje = `📌 *NUEVA CITA DE BARBERÍA*%0A`;
    mensaje += `👤 *Nombre:* ${nombre}%0A`;
    mensaje += `📅 *Fecha:* ${fechaFormateada}%0A`;
    mensaje += `🕒 *Hora:* ${horaFormateada}%0A`;
    if (servicio !== '') {
        mensaje += `✂️ *Servicio:* ${servicio}%0A`;
    }
    mensaje += `%0A¡Esperamos tu visita! ✨`;

    // Número de WhatsApp
    const numero = '524621098798';
    const url = `https://wa.me/${numero}?text=${mensaje}`;

    // Abrir WhatsApp
    window.open(url, '_blank');

    // ✅ REINICIAR FORMULARIO (limpiar todos los campos)
    resetearFormulario();
}

// ============================================================
//  RESETEAR FORMULARIO
// ============================================================

function resetearFormulario() {
    document.getElementById('nombreInput').value = '';
    document.getElementById('fechaInput').value = '';
    document.getElementById('horaInput').value = '';
    document.getElementById('servicioInput').value = '';
    // Opcional: focus en el primer campo
    document.getElementById('nombreInput').focus();
}

// ============================================================
//  INICIALIZACIÓN
// ============================================================

window.addEventListener('load', function() {
    ajustarResponsive();

    const botonAgendar = document.getElementById('agendarBtn');
    if (botonAgendar) {
        botonAgendar.addEventListener('click', enviarWhatsApp);
    } else {
        console.warn('No se encontró el botón con id="agendarBtn"');
    }
});

window.addEventListener('resize', ajustarResponsive);