// Estado global de la aplicación
const appState = {
    usuarioActual: null,
    moduloActual: 'dashboard',
    cargando: false,
    notificaciones: []
};

// Inicialización de la aplicación
function inicializarApp() {
    // Verificar autenticación
    verificarAutenticacion();
    
    // Configurar manejadores de eventos
    configurarEventos();
    
    // Cargar el módulo actual
    cargarModulo();
}

// Verificar si el usuario está autenticado
function verificarAutenticacion() {
    const usuarioGuardado = localStorage.getItem('usuarioActual');
    if (usuarioGuardado) {
        appState.usuarioActual = JSON.parse(usuarioGuardado);
        actualizarUIUsuario();
    } else if (!window.location.href.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

// Configurar manejadores de eventos globales
function configurarEventos() {
    // Navegación
    document.addEventListener('click', (e) => {
        const navLink = e.target.closest('[data-modulo]');
        if (navLink) {
            e.preventDefault();
            const modulo = navLink.getAttribute('data-modulo');
            navegarA(modulo);
        }
    });
    
    // Cerrar sesión
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', cerrarSesion);
    }
}

// Navegar a un módulo específico
function navegarA(modulo) {
    if (modulo === 'cerrar-sesion') {
        cerrarSesion();
        return;
    }
    
    // Verificar permisos del usuario para el módulo
    if (!tienePermiso(modulo)) {
        mostrarNotificacion('No tienes permiso para acceder a este módulo', 'error');
        return;
    }
    
    // Actualizar estado
    appState.moduloActual = modulo;
    
    // Actualizar URL sin recargar la página
    history.pushState({ modulo }, '', `${modulo}.html`);
    
    // Cargar el módulo
    cargarModulo();
}

// Cargar el módulo actual
function cargarModulo() {
    const modulo = appState.moduloActual;
    const contenedor = document.getElementById('contenido-principal');
    
    if (!contenedor) return;
    
    // Mostrar indicador de carga
    appState.cargando = true;
    actualizarUI();
    
    // Simular carga de módulo
    setTimeout(() => {
        // Aquí iría la lógica para cargar el módulo específico
        contenedor.innerHTML = `<h2>Módulo de ${modulo}</h2>`;
        
        // Inicializar el módulo específico si existe la función
        const initFunc = window[`inicializar${modulo.charAt(0).toUpperCase() + modulo.slice(1)}`];
        if (typeof initFunc === 'function') {
            initFunc();
        }
        
        // Actualizar UI
        appState.cargando = false;
        actualizarUI();
    }, 300);
}

// Verificar permisos del usuario
function tienePermiso(modulo) {
    if (!appState.usuarioActual) return false;
    
    const permisos = {
        'admin': ['dashboard', 'ventas', 'clientes', 'inventario', 'facturacion', 'compras', 'reportes', 'configuracion', 'seguridad'],
        'ventas': ['dashboard', 'ventas', 'clientes'],
        'almacen': ['dashboard', 'inventario', 'compras']
    };
    
    return permisos[appState.usuarioActual.rol]?.includes(modulo) || false;
}

// Actualizar la interfaz de usuario
function actualizarUI() {
    // Actualizar menú activo
    document.querySelectorAll('[data-modulo]').forEach(enlace => {
        const modulo = enlace.getAttribute('data-modulo');
        if (modulo === appState.moduloActual) {
            enlace.classList.add('active');
        } else {
            enlace.classList.remove('active');
        }
    });
    
    // Mostrar/ocultar carga
    const cargando = document.getElementById('cargando');
    if (cargando) {
        cargando.style.display = appState.cargando ? 'block' : 'none';
    }
}

// Actualizar la UI con la información del usuario
function actualizarUIUsuario() {
    if (!appState.usuarioActual) return;
    
    const nombreUsuario = document.getElementById('nombre-usuario');
    const avatarUsuario = document.getElementById('avatar-usuario');
    
    if (nombreUsuario) {
        nombreUsuario.textContent = appState.usuarioActual.nombre || appState.usuarioActual.usuario;
    }
    
    if (avatarUsuario) {
        const iniciales = (appState.usuarioActual.nombre || appState.usuarioActual.usuario)
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
            
        avatarUsuario.textContent = iniciales.substring(0, 2);
    }
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = {
        id: Date.now(),
        mensaje,
        tipo,
        fecha: new Date()
    };
    
    appState.notificaciones.push(notificacion);
    
    // Mostrar notificación en la UI
    const contenedorNotificaciones = document.getElementById('notificaciones');
    if (contenedorNotificaciones) {
        const elemento = document.createElement('div');
        elemento.className = `notificacion ${tipo}`;
        elemento.innerHTML = `
            <div class="notificacion-contenido">
                <span class="notificacion-mensaje">${mensaje}</span>
                <button class="notificacion-cerrar" data-id="${notificacion.id}">&times;</button>
            </div>
        `;
        
        contenedorNotificaciones.appendChild(elemento);
        
        // Eliminar notificación después de 5 segundos
        setTimeout(() => {
            elemento.remove();
            appState.notificaciones = appState.notificaciones.filter(n => n.id !== notificacion.id);
        }, 5000);
    }
}

// Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    appState.usuarioActual = null;
    window.location.href = 'login.html';
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarApp);

// Manejar navegación con el botón atrás/adelante
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.modulo) {
        appState.moduloActual = event.state.modulo;
        cargarModulo();
    }
});

// Exportar para uso en otros módulos
window.appState = appState;
window.navegarA = navegarA;
window.mostrarNotificacion = mostrarNotificacion;
