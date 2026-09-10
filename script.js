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
//  ENVIAR TODOS LOS CAMPOS A WHATSAPP + RESET + PREGUNTA PDF
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

    // ---------- Mensaje de WhatsApp ----------
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

    // ---------- Preparar datos del PDF (hora real del registro) ----------
    const ahora = new Date();
    const pad = (n) => String(n).padStart(2, '0');

    const generado = ahora.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    const codigo = 'CITA-'
        + ahora.getFullYear()
        + pad(ahora.getMonth() + 1)
        + pad(ahora.getDate())
        + '-'
        + pad(ahora.getHours())
        + pad(ahora.getMinutes());

    const datosPDF = {
        nombre:       nombre,
        fecha:        fechaFormateada,
        hora:         horaFormateada,
        servicio:     servicio,
        generado:     generado,
        codigo:       codigo,
        fechaArchivo: fechaRaw,
        horaArchivo:  pad(ahora.getHours()) + pad(ahora.getMinutes())
    };

    // ---------- Preguntar al usuario si desea el comprobante ----------
    preguntarDescargaComprobante(datosPDF);

    // ---------- Resetear formulario ----------
    document.getElementById('nombreInput').value = '';
    document.getElementById('fechaInput').value = '';
    document.getElementById('horaInput').value = '';
    if (document.getElementById('servicioInput')) {
        document.getElementById('servicioInput').value = '';
    }
    document.getElementById('nombreInput').focus();
}

// ============================================================
//  MODAL PERSONALIZADO: ¿DESCARGAR COMPROBANTE?
// ============================================================

function preguntarDescargaComprobante(datosPDF) {
    // Crear estilos una sola vez
    if (!document.getElementById('modal-comprobante-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-comprobante-styles';
        style.textContent = `
            #modal-comprobante-overlay {
                position: fixed;
                inset: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                background: rgba(0, 0, 0, .78);
                backdrop-filter: blur(6px);
                -webkit-backdrop-filter: blur(6px);
                opacity: 0;
                visibility: hidden;
                transition: opacity .3s ease, visibility .3s ease;
                font-family: inherit;
            }
            #modal-comprobante-overlay.activo {
                opacity: 1;
                visibility: visible;
            }

            .modal-comprobante {
                width: 100%;
                max-width: 400px;
                background: #ffffff;
                border-radius: 16px;
                padding: 28px 24px 22px;
                text-align: center;
                box-shadow: 0 25px 60px rgba(0, 0, 0, .5);
                transform: scale(.85) translateY(20px);
                transition: transform .35s cubic-bezier(.2, .9, .3, 1.2);
                color: #1f2937;
            }
            #modal-comprobante-overlay.activo .modal-comprobante {
                transform: scale(1) translateY(0);
            }

            .modal-comprobante .icono {
                width: 70px;
                height: 70px;
                margin: 0 auto 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background: linear-gradient(135deg, #f5d488, #c6a05a);
                font-size: 2rem;
                box-shadow: 0 8px 22px rgba(198, 160, 90, .45);
            }

            .modal-comprobante h2 {
                margin: 0 0 10px;
                font-size: 1.25rem;
                font-weight: 700;
                color: #111827;
            }

            .modal-comprobante p {
                margin: 0 0 22px;
                font-size: .95rem;
                line-height: 1.5;
                color: #4b5563;
            }

            .modal-comprobante .acciones {
                display: flex;
                gap: 10px;
            }

            .modal-comprobante button {
                flex: 1;
                padding: 12px 16px;
                border: none;
                border-radius: 10px;
                font-size: .95rem;
                font-weight: 700;
                cursor: pointer;
                font-family: inherit;
                transition: transform .15s ease, box-shadow .2s ease, background .2s ease, filter .2s ease;
                -webkit-tap-highlight-color: transparent;
            }

            .modal-comprobante .btn-si {
                background: linear-gradient(135deg, #111827, #1f2937);
                color: #ffffff;
                box-shadow: 0 6px 16px rgba(17, 24, 39, .35);
            }
            .modal-comprobante .btn-si:hover {
                filter: brightness(1.15);
                transform: translateY(-1px);
            }
            .modal-comprobante .btn-si:active {
                transform: scale(.97);
            }

            .modal-comprobante .btn-no {
                background: #f3f4f6;
                color: #4b5563;
            }
            .modal-comprobante .btn-no:hover {
                background: #e5e7eb;
            }
            .modal-comprobante .btn-no:active {
                transform: scale(.97);
            }

            body.modal-comprobante-abierto { overflow: hidden; }
        `;
        document.head.appendChild(style);
    }

    // Eliminar cualquier modal previo
    const anterior = document.getElementById('modal-comprobante-overlay');
    if (anterior) anterior.remove();

    // Crear overlay
    const overlay = document.createElement('div');
    overlay.id = 'modal-comprobante-overlay';
    overlay.innerHTML = `
        <div class="modal-comprobante" role="dialog" aria-modal="true" aria-labelledby="modal-comprobante-titulo">
            <div class="icono">🧾</div>
            <h2 id="modal-comprobante-titulo">¿Descargar comprobante?</h2>
            <p>Tu cita fue registrada. ¿Deseas descargar el comprobante en PDF con todos los detalles?</p>
            <div class="acciones">
                <button type="button" class="btn-no" id="modal-comprobante-no">Ahora no</button>
                <button type="button" class="btn-si" id="modal-comprobante-si">Sí, descargar</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    document.body.classList.add('modal-comprobante-abierto');

    // Activar animación
    requestAnimationFrame(() => overlay.classList.add('activo'));

    // Cerrar el modal
    function cerrarModal() {
        overlay.classList.remove('activo');
        document.body.classList.remove('modal-comprobante-abierto');
        setTimeout(() => overlay.remove(), 350);
        document.removeEventListener('keydown', manejarTecla);
    }

    // Confirmar descarga
    function confirmarDescarga() {
        cerrarModal();
        generarPDFCita(datosPDF);
    }

    // Manejo de teclado
    function manejarTecla(e) {
        if (e.key === 'Escape') cerrarModal();
        if (e.key === 'Enter') confirmarDescarga();
    }

    // Eventos
    overlay.querySelector('#modal-comprobante-si').addEventListener('click', confirmarDescarga);
    overlay.querySelector('#modal-comprobante-no').addEventListener('click', cerrarModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) cerrarModal();
    });
    document.addEventListener('keydown', manejarTecla);

    // Foco accesible al botón principal
    setTimeout(() => {
        const btnSi = overlay.querySelector('#modal-comprobante-si');
        if (btnSi) btnSi.focus();
    }, 320);
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
//  GENERACIÓN DEL PDF DE LA CITA (jsPDF)
// ============================================================

const JSPDF_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
let jspdfPromise = null;

function cargarJsPDF() {
    if (window.jspdf && window.jspdf.jsPDF) {
        return Promise.resolve(window.jspdf);
    }
    if (jspdfPromise) return jspdfPromise;

    jspdfPromise = new Promise(function (resolve, reject) {
        const script = document.createElement('script');
        script.src = JSPDF_CDN;
        script.async = true;
        script.onload = function () {
            if (window.jspdf && window.jspdf.jsPDF) {
                resolve(window.jspdf);
            } else {
                jspdfPromise = null;
                reject(new Error('jsPDF no se inicializó correctamente.'));
            }
        };
        script.onerror = function () {
            jspdfPromise = null;
            reject(new Error('No se pudo descargar jsPDF.'));
        };
        document.head.appendChild(script);
    });

    return jspdfPromise;
}

function limpiarTextoArchivo(texto) {
    return String(texto)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')      // quita acentos
        .replace(/[^a-zA-Z0-9]+/g, '_')       // reemplaza símbolos
        .replace(/^_+|_+$/g, '')
        .slice(0, 30) || 'Cliente';
}

async function generarPDFCita(datos) {
    try {
        const { jsPDF } = await cargarJsPDF();

        const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });

        // ---------- Paleta ----------
        const OSCURO = [17, 24, 39];
        const DORADO = [198, 160, 90];
        const TEXTO  = [30, 30, 30];
        const SUAVE  = [110, 110, 110];
        const LINEA  = [222, 222, 222];

        const ancho  = doc.internal.pageSize.getWidth();   // 210 mm
        const alto   = doc.internal.pageSize.getHeight();  // 297 mm
        const margen = 18;
        const cardW  = ancho - margen * 2;
        const centro = ancho / 2;
        const cardX  = margen;

        // ---------- CABECERA ----------
        doc.setFillColor(OSCURO[0], OSCURO[1], OSCURO[2]);
        doc.rect(0, 0, ancho, 44, 'F');

        doc.setFillColor(DORADO[0], DORADO[1], DORADO[2]);
        doc.rect(0, 44, ancho, 1.8, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(23);
        doc.text('CITA DE BARBERÍA', centro, 22, { align: 'center', charSpace: 0.8 });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5);
        doc.setTextColor(214, 214, 214);
        doc.text('Comprobante de reserva', centro, 31, { align: 'center' });

        // ---------- TARJETA DE DATOS ----------
        const filas = [
            ['NOMBRE',           datos.nombre],
            ['FECHA DE LA CITA', datos.fecha],
            ['HORA DE LA CITA',  datos.hora]
        ];
        if (datos.servicio) {
            filas.push(['SERVICIO', datos.servicio]);
        }

        const cardY  = 62;
        const rowH   = 18;
        const padTop = 13;
        const cardH  = padTop + filas.length * rowH - 4;

        // sombra
        doc.setFillColor(232, 232, 232);
        doc.roundedRect(cardX + 1.5, cardY + 1.5, cardW, cardH, 3, 3, 'F');

        // tarjeta
        doc.setFillColor(250, 250, 250);
        doc.setDrawColor(LINEA[0], LINEA[1], LINEA[2]);
        doc.setLineWidth(0.3);
        doc.roundedRect(cardX, cardY, cardW, cardH, 3, 3, 'FD');

        // franja dorada lateral
        doc.setFillColor(DORADO[0], DORADO[1], DORADO[2]);
        doc.roundedRect(cardX + 0.8, cardY + 1.2, 2.2, cardH - 2.4, 1, 1, 'F');

        // filas
        let y = cardY + padTop;
        filas.forEach(function (fila, i) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8.5);
            doc.setTextColor(SUAVE[0], SUAVE[1], SUAVE[2]);
            doc.text(fila[0], cardX + 11, y, { charSpace: 0.6 });

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(13.5);
            doc.setTextColor(TEXTO[0], TEXTO[1], TEXTO[2]);
            doc.text(String(fila[1]), cardX + 11, y + 7.5);

            if (i < filas.length - 1) {
                doc.setDrawColor(LINEA[0], LINEA[1], LINEA[2]);
                doc.setLineWidth(0.2);
                doc.line(cardX + 11, y + 12.5, cardX + cardW - 11, y + 12.5);
            }
            y += rowH;
        });

        // ---------- CAJA DE REGISTRO ----------
        const infoY = cardY + cardH + 14;
        const infoH = 24;

        doc.setFillColor(OSCURO[0], OSCURO[1], OSCURO[2]);
        doc.roundedRect(cardX, infoY, cardW, infoH, 3, 3, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(DORADO[0], DORADO[1], DORADO[2]);
        doc.text('REGISTRO GENERADO EL', cardX + 11, infoY + 9, { charSpace: 0.6 });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(255, 255, 255);
        doc.text(String(datos.generado), cardX + 11, infoY + 17.5);

        // código de la cita (derecha)
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(175, 175, 175);
        doc.text('CÓDIGO', cardX + cardW - 11, infoY + 9, { align: 'right', charSpace: 0.6 });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255);
        doc.text(String(datos.codigo), cardX + cardW - 11, infoY + 17.5, { align: 'right' });

        // ---------- NOTA ----------
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10);
        doc.setTextColor(SUAVE[0], SUAVE[1], SUAVE[2]);
        doc.text(
            'Presenta este comprobante al llegar a tu cita.',
            centro,
            infoY + infoH + 18,
            { align: 'center' }
        );

        // ---------- PIE ----------
        doc.setDrawColor(LINEA[0], LINEA[1], LINEA[2]);
        doc.setLineWidth(0.3);
        doc.line(margen, alto - 34, ancho - margen, alto - 34);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(SUAVE[0], SUAVE[1], SUAVE[2]);
        doc.text('Gracias por tu preferencia. ¡Te esperamos!', centro, alto - 26, { align: 'center' });

        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            'Comprobante generado automáticamente desde el sitio web de reservas.',
            centro,
            alto - 20,
            { align: 'center' }
        );

        // ---------- GUARDAR ----------
        const archivo = 'Cita_'
            + limpiarTextoArchivo(datos.nombre) + '_'
            + datos.fechaArchivo + '_'
            + datos.horaArchivo + '.pdf';

        doc.save(archivo);
        return true;

    } catch (error) {
        console.error('No se pudo generar el PDF de la cita:', error);
        alert('⚠️ No se pudo generar el comprobante. Revisa tu conexión a internet e inténtalo de nuevo.');
        return false;
    }
}

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

    // 6) Pre-cargar jsPDF para que el PDF salga al instante
    const precargarPDF = function () {
        cargarJsPDF().catch(function () {
            console.warn('jsPDF no disponible: el PDF no se generará hasta recuperar conexión.');
        });
    };

    if ('requestIdleCallback' in window) {
        requestIdleCallback(precargarPDF);
    } else {
        setTimeout(precargarPDF, 1500);
    }
});

window.addEventListener('resize', ajustarResponsive);
