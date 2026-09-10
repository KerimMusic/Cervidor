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
//  VISOR DE IMÁGENES DE LA GALERÍA (Lightbox)
// ============================================================

function crearLightbox() {
    let lightbox = document.getElementById('lightbox');
    if (lightbox) return lightbox;

    // Estilos (se inyectan una sola vez)
    if (!document.getElementById('lightbox-styles')) {
        const style = document.createElement('style');
        style.id = 'lightbox-styles';
        style.textContent = `
            #galeria-container img { cursor: zoom-in; }

            #lightbox {
                position: fixed;
                inset: 0;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                background: rgba(0, 0, 0, .92);
                backdrop-filter: blur(6px);
                -webkit-backdrop-filter: blur(6px);
                opacity: 0;
                visibility: hidden;
                transition: opacity .3s ease, visibility .3s ease;
                cursor: zoom-out;
            }
            #lightbox.activo {
                opacity: 1;
                visibility: visible;
            }
            #lightbox img {
                max-width: 95vw;
                max-height: 90vh;
                width: auto;
                height: auto;
                object-fit: contain;
                border-radius: 10px;
                box-shadow: 0 0 45px rgba(0, 0, 0, .85);
                transform: scale(.85);
                transition: transform .3s ease;
                cursor: default;
            }
            #lightbox.activo img { transform: scale(1); }

            #lightbox-cerrar {
                position: absolute;
                top: 18px;
                right: 22px;
                width: 46px;
                height: 46px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: none;
                border-radius: 50%;
                background: rgba(255, 255, 255, .15);
                color: #fff;
                font-size: 1.7rem;
                line-height: 1;
                cursor: pointer;
                transition: background .25s ease, transform .25s ease;
            }
            #lightbox-cerrar:hover {
                background: rgba(255, 255, 255, .32);
                transform: rotate(90deg);
            }

            body.lightbox-abierto { overflow: hidden; }

            @media (max-width: 480px) {
                #lightbox { padding: 10px; }
                #lightbox img { max-width: 100vw; max-height: 85vh; border-radius: 6px; }
                #lightbox-cerrar { top: 10px; right: 12px; width: 40px; height: 40px; }
            }
        `;
        document.head.appendChild(style);
    }

    lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
        <button id="lightbox-cerrar" aria-label="Cerrar imagen">&times;</button>
        <img src="" alt="Imagen ampliada">
    `;
    document.body.appendChild(lightbox);

    // Cerrar al hacer clic en el fondo o en la X
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox || e.target.id === 'lightbox-cerrar') {
            cerrarLightbox();
        }
    });

    // Cerrar con la tecla ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') cerrarLightbox();
    });

    return lightbox;
}

function abrirLightbox(src, alt) {
    if (!src) return;
    const lightbox = crearLightbox();
    const img = lightbox.querySelector('img');

    img.src = src;
    img.alt = alt || 'Imagen de la galería';

    lightbox.classList.add('activo');
    document.body.classList.add('lightbox-abierto');
}

function cerrarLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || !lightbox.classList.contains('activo')) return;

    lightbox.classList.remove('activo');
    document.body.classList.remove('lightbox-abierto');

    // Limpiar el src cuando termina la animación
    setTimeout(function () {
        if (!lightbox.classList.contains('activo')) {
            lightbox.querySelector('img').src = '';
        }
    }, 320);
}

// Delegación: funciona con imágenes presentes o añadidas dinámicamente
document.addEventListener('click', function (e) {
    const img = e.target.closest('#galeria-container img');
    if (!img) return;

    e.preventDefault(); // evita navegar si la imagen está dentro de un <a>

    // Soporta lazy-loading (data-src / data-full) y src normal
    const origen = img.dataset.full || img.dataset.src || img.currentSrc || img.src;
    abrirLightbox(origen, img.alt);
});

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
