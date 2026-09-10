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
//  ESTILOS DEL BOTÓN FLOTANTE CIRCULAR (se inyectan una vez)
// ============================================================

function crearEstilosBotonFlotante() {
    if (document.getElementById('boton-flotante-styles')) return;

    const style = document.createElement('style');
    style.id = 'boton-flotante-styles';
    style.textContent = `
        /* ---------- Botón flotante circular ---------- */
        #button2.flotante {
            position: fixed !important;
            top: auto !important;
            left: auto !important;
            right: 24px !important;
            bottom: calc(24px + env(safe-area-inset-bottom, 0px)) !important;

            width: 62px !important;
            height: 62px !important;
            min-width: 0 !important;
            max-width: none !important;
            padding: 0 !important;
            margin: 0 !important;

            display: flex !important;
            align-items: center;
            justify-content: center;

            border-radius: 50% !important;
            font-size: 1.5rem !important;
            font-weight: 700;
            line-height: 1 !important;
            text-align: center;

            cursor: pointer;
            z-index: 9000 !important;

            box-shadow:
                0 10px 26px rgba(0, 0, 0, .45),
                0 4px 10px rgba(0, 0, 0, .30) !important;

            transition:
                transform .25s ease,
                box-shadow .25s ease,
                filter .25s ease !important;

            animation: botonFlotanteAparecer .28s ease;

            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
        }

        #button2.flotante:hover {
            transform: scale(1.08) rotate(90deg);
            box-shadow:
                0 14px 32px rgba(0, 0, 0, .55),
                0 6px 14px rgba(0, 0, 0, .35) !important;
            filter: brightness(1.12);
        }

        #button2.flotante:active {
            transform: scale(.92) rotate(90deg);
        }

        #button2.flotante:focus-visible {
            outline: 3px solid rgba(255, 255, 255, .85);
            outline-offset: 3px;
        }

        /* Halo pulsante sutil */
        #button2.flotante::after {
            content: '';
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, .55);
            opacity: 0;
            pointer-events: none;
            animation: botonFlotantePulso 2.4s ease-out infinite;
        }

        @keyframes botonFlotanteAparecer {
            from { opacity: 0; transform: scale(.4); }
            to   { opacity: 1; transform: scale(1); }
        }

        @keyframes botonFlotantePulso {
            0%   { opacity: .55; transform: scale(.9); }
            70%  { opacity: 0;   transform: scale(1.35); }
            100% { opacity: 0;   transform: scale(1.35); }
        }

        /* ---------- Ajustes en móvil ---------- */
        @media (max-width: 768px) {
            #button2.flotante {
                right: 16px !important;
                bottom: calc(16px + env(safe-area-inset-bottom, 0px)) !important;
                width: 56px !important;
                height: 56px !important;
                font-size: 1.3rem !important;
            }
        }

        /* ---------- Respeta "reducir movimiento" ---------- */
        @media (prefers-reduced-motion: reduce) {
            #button2.flotante,
            #button2.flotante::after {
                animation: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================================
//  SINCRONIZAR ESTADO DEL BOTÓN (flotante / normal)
// ============================================================

function sincronizarBotonFlotante() {
    const galeria = document.getElementById('galeria-container');
    const boton   = document.getElementById('button2');
    if (!galeria || !boton) return;

    if (galeria.classList.contains('visible')) {
        // Galería abierta → botón flotante circular con ✕
        boton.classList.add('flotante');
        boton.textContent = '✕';
        boton.setAttribute('aria-label', 'Mostrar menos');
        boton.setAttribute('title', 'Mostrar menos');
        boton.setAttribute('aria-expanded', 'true');
    } else {
        // Galería cerrada → botón normal
        boton.classList.remove('flotante');
        boton.textContent = 'Ver más';
        boton.setAttribute('aria-label', 'Ver más');
        boton.setAttribute('title', 'Ver más');
        boton.setAttribute('aria-expanded', 'false');
    }
}

// ============================================================
//  ALTERNAR VISIBILIDAD (formulario + galería)
// ============================================================

function toggleContenido() {
    const formulario = document.getElementById('formulario');
    const galeria    = document.getElementById('galeria-container');
    const boton      = document.getElementById('button2');

    if (!formulario || !galeria || !boton) return;

    // Alternar clases (formulario oculto ↔ galería visible)
    formulario.classList.toggle('oculto');
    galeria.classList.toggle('visible');

    // Actualizar el botón (flotante circular o normal)
    sincronizarBotonFlotante();
}

// ============================================================
//  VISOR DE IMÁGENES DE LA GALERÍA (Lightbox con swipe)
// ============================================================

let lightboxIndex = 0;
let lightboxImagenes = [];

let touchStartX = 0;
let touchStartY = 0;
let touchMoved = false;

let mouseDown = false;
let mouseStartX = 0;
let mouseStartY = 0;
let mouseDragged = false;

const SWIPE_UMBRAL = 50; // píxeles mínimos para considerar un swipe

function obtenerImagenesGaleria() {
    const cont = document.getElementById('galeria-container');
    if (!cont) return [];
    return Array.from(cont.querySelectorAll('img'));
}

function obtenerSrcDeImagen(img) {
    if (!img) return '';
    return img.dataset.full || img.dataset.src || img.currentSrc || img.src;
}

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
                touch-action: none;
                user-select: none;
                -webkit-user-select: none;
            }
            #lightbox.activo {
                opacity: 1;
                visibility: visible;
            }
            #lightbox img {
                max-width: 95vw;
                max-height: 88vh;
                width: auto;
                height: auto;
                object-fit: contain;
                border-radius: 10px;
                box-shadow: 0 0 45px rgba(0, 0, 0, .85);
                transform: scale(.85);
                transition: transform .3s ease, opacity .2s ease;
                cursor: default;
                -webkit-user-drag: none;
                user-select: none;
            }
            #lightbox.activo img { transform: scale(1); }
            #lightbox img.cambiando { opacity: 0; }

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
                z-index: 2;
            }
            #lightbox-cerrar:hover {
                background: rgba(255, 255, 255, .32);
                transform: rotate(90deg);
            }

            .lightbox-flecha {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 52px;
                height: 52px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: none;
                border-radius: 50%;
                background: rgba(255, 255, 255, .15);
                color: #fff;
                font-size: 1.8rem;
                line-height: 1;
                cursor: pointer;
                transition: background .25s ease;
                z-index: 2;
                user-select: none;
            }
            .lightbox-flecha:hover { background: rgba(255, 255, 255, .32); }
            #lightbox-prev { left: 22px; }
            #lightbox-next { right: 22px; }

            #lightbox-contador {
                position: absolute;
                bottom: 22px;
                left: 50%;
                transform: translateX(-50%);
                color: #fff;
                background: rgba(0, 0, 0, .55);
                padding: 6px 16px;
                border-radius: 20px;
                font-size: .9rem;
                letter-spacing: 1px;
                user-select: none;
                z-index: 2;
                font-family: inherit;
            }

            #lightbox-hint {
                position: absolute;
                bottom: 60px;
                left: 50%;
                transform: translateX(-50%);
                color: rgba(255, 255, 255, .6);
                font-size: .8rem;
                letter-spacing: .5px;
                user-select: none;
                z-index: 2;
                animation: lightbox-hint-fade 3s ease forwards;
            }
            @keyframes lightbox-hint-fade {
                0%, 60% { opacity: 1; }
                100% { opacity: 0; }
            }

            body.lightbox-abierto { overflow: hidden; }

            @media (max-width: 768px) {
                #lightbox { padding: 10px; }
                #lightbox img { max-width: 100vw; max-height: 82vh; border-radius: 6px; }
                #lightbox-cerrar { top: 10px; right: 12px; width: 40px; height: 40px; font-size: 1.5rem; }
                .lightbox-flecha { display: none; }
                #lightbox-contador { bottom: 16px; font-size: .8rem; padding: 5px 12px; }
                #lightbox-hint { bottom: 52px; font-size: .75rem; }
            }
        `;
        document.head.appendChild(style);
    }

    lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
        <button id="lightbox-cerrar" aria-label="Cerrar imagen">&times;</button>
        <button id="lightbox-prev" class="lightbox-flecha" aria-label="Imagen anterior">&#10094;</button>
        <button id="lightbox-next" class="lightbox-flecha" aria-label="Imagen siguiente">&#10095;</button>
        <img src="" alt="Imagen ampliada" draggable="false">
        <div id="lightbox-hint">Desliza ↑ ↓ ← → para cambiar</div>
        <div id="lightbox-contador"></div>
    `;
    document.body.appendChild(lightbox);

    // --- Cerrar con clic en fondo o botón X ---
    lightbox.addEventListener('click', function (e) {
        if (mouseDragged) { mouseDragged = false; return; }
        if (touchMoved)    { touchMoved = false;    return; }

        if (e.target === lightbox || e.target.id === 'lightbox-cerrar') {
            cerrarLightbox();
        }
    });

    // --- Flechas ---
    lightbox.querySelector('#lightbox-prev').addEventListener('click', function (e) {
        e.stopPropagation();
        cambiarImagen(-1);
    });
    lightbox.querySelector('#lightbox-next').addEventListener('click', function (e) {
        e.stopPropagation();
        cambiarImagen(1);
    });

    // --- Teclado ---
    document.addEventListener('keydown', function (e) {
        const lb = document.getElementById('lightbox');
        if (!lb || !lb.classList.contains('activo')) return;

        if (e.key === 'Escape') {
            cerrarLightbox();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
            cambiarImagen(1);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
            cambiarImagen(-1);
        }
    });

    // --- Swipe táctil (móvil / tablet) ---
    lightbox.addEventListener('touchstart', function (e) {
        if (e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchMoved = false;
    }, { passive: true });

    lightbox.addEventListener('touchmove', function (e) {
        if (e.touches.length !== 1) return;
        const dx = Math.abs(e.touches[0].clientX - touchStartX);
        const dy = Math.abs(e.touches[0].clientY - touchStartY);
        if (dx > 10 || dy > 10) touchMoved = true;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
        if (e.changedTouches.length !== 1) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);

        if (absY > absX && absY > SWIPE_UMBRAL) {
            // Arriba → siguiente | Abajo → anterior
            cambiarImagen(dy < 0 ? 1 : -1);
        } else if (absX > absY && absX > SWIPE_UMBRAL) {
            // Izquierda → siguiente | Derecha → anterior
            cambiarImagen(dx < 0 ? 1 : -1);
        }

        // Evita que el click posterior dispare cerrar
        setTimeout(function () { touchMoved = false; }, 60);
    }, { passive: true });

    // --- Arrastre con mouse (escritorio) ---
    lightbox.addEventListener('mousedown', function (e) {
        const id = e.target.id;
        if (id === 'lightbox-cerrar' || id === 'lightbox-prev' || id === 'lightbox-next') return;
        mouseDown = true;
        mouseDragged = false;
        mouseStartX = e.clientX;
        mouseStartY = e.clientY;
    });

    document.addEventListener('mousemove', function (e) {
        if (!mouseDown) return;
        const dx = Math.abs(e.clientX - mouseStartX);
        const dy = Math.abs(e.clientY - mouseStartY);
        if (dx > 10 || dy > 10) mouseDragged = true;
    });

    document.addEventListener('mouseup', function (e) {
        if (!mouseDown) return;
        mouseDown = false;

        const dx = e.clientX - mouseStartX;
        const dy = e.clientY - mouseStartY;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);

        if (absY > absX && absY > SWIPE_UMBRAL) {
            cambiarImagen(dy < 0 ? 1 : -1);
        } else if (absX > absY && absX > SWIPE_UMBRAL) {
            cambiarImagen(dx < 0 ? 1 : -1);
        }
    });

    // Prevenir el drag nativo de la imagen
    lightbox.addEventListener('dragstart', function (e) { e.preventDefault(); });

    return lightbox;
}

function abrirLightbox(indice) {
    lightboxImagenes = obtenerImagenesGaleria();
    if (!lightboxImagenes.length) return;

    if (indice < 0 || indice >= lightboxImagenes.length) indice = 0;
    lightboxIndex = indice;

    const lightbox = crearLightbox();
    const imgEl = lightbox.querySelector('img');
    const target = lightboxImagenes[lightboxIndex];

    imgEl.src = obtenerSrcDeImagen(target);
    imgEl.alt = target.alt || 'Imagen de la galería';
    imgEl.classList.remove('cambiando');

    lightbox.classList.add('activo');
    document.body.classList.add('lightbox-abierto');

    // Reiniciar hint (para que vuelva a mostrarse)
    const hint = lightbox.querySelector('#lightbox-hint');
    if (hint) {
        hint.style.animation = 'none';
        // fuerza reflow
        void hint.offsetWidth;
        hint.style.animation = 'lightbox-hint-fade 3s ease forwards';
    }

    actualizarContador();
}

function cambiarImagen(delta) {
    if (!lightboxImagenes.length) return;

    lightboxIndex = (lightboxIndex + delta + lightboxImagenes.length) % lightboxImagenes.length;

    const imgEl = document.querySelector('#lightbox img');
    if (!imgEl) return;

    // Pequeña transición de fundido
    imgEl.classList.add('cambiando');

    setTimeout(function () {
        const target = lightboxImagenes[lightboxIndex];
        imgEl.src = obtenerSrcDeImagen(target);
        imgEl.alt = target.alt || 'Imagen de la galería';

        imgEl.onload = function () {
            imgEl.classList.remove('cambiando');
            imgEl.onload = null;
        };
        // Fallback por si la imagen ya estaba cacheada
        setTimeout(function () { imgEl.classList.remove('cambiando'); }, 120);

        actualizarContador();
    }, 150);
}

function actualizarContador() {
    const contador = document.getElementById('lightbox-contador');
    if (!contador) return;
    contador.textContent = `${lightboxIndex + 1} / ${lightboxImagenes.length}`;
}

function cerrarLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || !lightbox.classList.contains('activo')) return;

    lightbox.classList.remove('activo');
    document.body.classList.remove('lightbox-abierto');

    // Limpiar el src cuando termina la animación
    setTimeout(function () {
        if (!lightbox.classList.contains('activo')) {
            const imgEl = lightbox.querySelector('img');
            if (imgEl) imgEl.src = '';
        }
    }, 320);
}

// Delegación: funciona con imágenes presentes o añadidas dinámicamente
document.addEventListener('click', function (e) {
    const img = e.target.closest('#galeria-container img');
    if (!img) return;

    e.preventDefault(); // evita navegar si la imagen está dentro de un <a>

    const imgs = obtenerImagenesGaleria();
    const idx = imgs.indexOf(img);
    abrirLightbox(idx >= 0 ? idx : 0);
});

// ============================================================
//  INICIALIZACIÓN
// ============================================================

window.addEventListener('load', function() {
    // 1) Inyectar estilos del botón flotante ANTES de pintar
    crearEstilosBotonFlotante();

    // 2) Ajustes responsive
    ajustarResponsive();

    // 3) Botón Agendar
    const botonAgendar = document.getElementById('agendarBtn');
    if (botonAgendar) {
        botonAgendar.addEventListener('click', enviarWhatsApp);
    } else {
        console.warn('No se encontró el botón con id="agendarBtn"');
    }

    // 4) Botón Ver más / Mostrar menos
    const botonVerMas = document.getElementById('button2');
    if (botonVerMas) {
        botonVerMas.addEventListener('click', toggleContenido);
    } else {
        console.warn('No se encontró el botón con id="button2"');
    }

    // 5) Estado inicial coherente del botón
    sincronizarBotonFlotante();
});

window.addEventListener('resize', ajustarResponsive);
