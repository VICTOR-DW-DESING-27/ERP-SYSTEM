// Base de datos centralizada para el ERP
window.Database = class Database {
    constructor() {
        this.loadData();
    }

    loadData() {
        // Productos
        this.productos = JSON.parse(localStorage.getItem('productos')) || [
            { id: 1, codigo: 'PROD001', nombre: 'Laptop HP', precio: 15000, stock: 15, categoria: 'Electrónicos' },
            { id: 2, codigo: 'PROD002', nombre: 'Mouse Inalámbrico', precio: 350, stock: 50, categoria: 'Accesorios' },
            { id: 3, codigo: 'PROD003', nombre: 'Teclado Mecánico', precio: 1200, stock: 25, categoria: 'Accesorios' },
            { id: 4, codigo: 'PROD004', nombre: 'Monitor 24\"', precio: 4500, stock: 10, categoria: 'Monitores' },
            { id: 5, codigo: 'PROD005', nombre: 'Impresora Láser', precio: 3500, stock: 8, categoria: 'Impresión' }
        ];

        // Clientes
        this.clientes = JSON.parse(localStorage.getItem('clientes')) || [
            { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', telefono: '5551234567', direccion: 'Av. Principal #123', rfc: 'PERJ920101ABC' },
            { id: 2, nombre: 'María García', email: 'maria@example.com', telefono: '5552345678', direccion: 'Calle Secundaria #45', rfc: 'GARM850202DEF' },
            { id: 3, nombre: 'Carlos López', email: 'carlos@example.com', telefono: '5553456789', direccion: 'Boulevard Norte #67', rfc: 'LOCC900303GHI' }
        ];

        // Proveedores
        this.proveedores = JSON.parse(localStorage.getItem('proveedores')) || [
            { id: 1, nombre: 'Tecnología Avanzada SA', contacto: 'Ing. Roberto Sánchez', email: 'ventas@tecnologiaavanzada.com', telefono: '5551112233' },
            { id: 2, nombre: 'Suministros de Oficina', contacto: 'Lic. Laura Méndez', email: 'compras@suministros.com', telefono: '5552223344' }
        ];

        // Ventas y Compras
        this.ventas = JSON.parse(localStorage.getItem('ventas')) || [];
        this.compras = JSON.parse(localStorage.getItem('compras')) || [];
        
        // Usuarios
        this.usuarios = JSON.parse(localStorage.getItem('usuarios')) || [
            { id: 1, usuario: 'admin', password: 'admin123', rol: 'admin', nombre: 'Administrador' },
            { id: 2, usuario: 'ventas', password: 'ventas123', rol: 'ventas', nombre: 'Ventas' },
            { id: 3, usuario: 'juan', password: '123', rol: 'usuario', nombre: 'Juan' }
        ];

        // Configuración
        this.configuracion = JSON.parse(localStorage.getItem('configuracion')) || {
            empresa: {
                nombre: 'fASTCAR',
                direccion: 'Av. Principal #123, Col. Centro',
                rfc: 'MEM123456ABC',
                telefono: '5550000000',
                email: 'contacto@miempresa.com'
            },
            facturacion: {
                serie: 'A',
                folioInicial: 1000,
                folioActual: 1000,
                iva: 16,
                moneda: 'MXN',
                formatoFecha: 'dd/MM/yyyy'
            },
            seguridad: {
                intentosMaximos: 3,
                bloqueoMinutos: 30,
                longitudMinima: 8,
                mayusculas: true,
                numeros: true,
                caracteresEspeciales: true
            }
        };
    }

    // Métodos para guardar datos
    saveData() {
        localStorage.setItem('productos', JSON.stringify(this.productos));
        localStorage.setItem('clientes', JSON.stringify(this.clientes));
        localStorage.setItem('proveedores', JSON.stringify(this.proveedores));
        localStorage.setItem('ventas', JSON.stringify(this.ventas));
        localStorage.setItem('compras', JSON.stringify(this.compras));
        localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
        localStorage.setItem('configuracion', JSON.stringify(this.configuracion));
    }

    // Métodos para Productos
    getProductos() {
        return this.productos;
    }

    getProducto(id) {
        return this.productos.find(p => p.id === id);
    }

    agregarProducto(producto) {
        producto.id = this.productos.length > 0 ? Math.max(...this.productos.map(p => p.id)) + 1 : 1;
        this.productos.push(producto);
        this.saveData();
        return producto;
    }

    actualizarProducto(id, datos) {
        const index = this.productos.findIndex(p => p.id === id);
        if (index !== -1) {
            this.productos[index] = { ...this.productos[index], ...datos };
            this.saveData();
            return this.productos[index];
        }
        return null;
    }

    // Métodos para Clientes
    getClientes() {
        return this.clientes;
    }

    getCliente(id) {
        return this.clientes.find(c => c.id === id);
    }

    // Métodos para Ventas
    crearVenta(venta) {
        venta.id = this.ventas.length > 0 ? Math.max(...this.ventas.map(v => v.id)) + 1 : 1;
        venta.fecha = new Date().toISOString();
        venta.estado = 'completada';
        
        // Actualizar stock
        venta.productos.forEach(item => {
            const producto = this.getProducto(item.productoId);
            if (producto) {
                producto.stock -= item.cantidad;
            }
        });
        
        this.ventas.push(venta);
        this.saveData();
        return venta;
    }

    // Métodos para Compras
    crearCompra(compra) {
        compra.id = this.compras.length > 0 ? Math.max(...this.compras.map(c => c.id)) + 1 : 1;
        compra.fecha = new Date().toISOString();
        compra.estado = 'recibida';
        
        // Actualizar stock
        compra.productos.forEach(item => {
            const producto = this.getProducto(item.productoId);
            if (producto) {
                producto.stock = (producto.stock || 0) + item.cantidad;
            }
        });
        
        this.compras.push(compra);
        this.saveData();
        return compra;
    }

    // Autenticación
    autenticar(usuario, password) {
        try {
            console.log('Intentando autenticar usuario:', usuario);
            
            // Asegurarse de que los usuarios estén cargados
            if (!this.usuarios || !Array.isArray(this.usuarios)) {
                console.error('Error: No se pudo cargar la lista de usuarios');
                return null;
            }
            
            console.log('Usuarios en la base de datos:', this.usuarios);
            
            // Buscar el usuario (insensible a mayúsculas/minúsculas)
            const usuarioEncontrado = this.usuarios.find(u => {
                const usuarioCoincide = u.usuario && u.usuario.toString().toLowerCase() === usuario.toString().toLowerCase();
                const passwordCoincide = u.password === password;
                return usuarioCoincide && passwordCoincide;
            });
            
            if (!usuarioEncontrado) {
                console.error('Autenticación fallida para el usuario:', usuario);
                return null;
            }
            
            console.log('Usuario autenticado correctamente:', usuarioEncontrado);
            
            // Retornar solo los datos necesarios del usuario
            return {
                id: usuarioEncontrado.id,
                usuario: usuarioEncontrado.usuario,
                nombre: usuarioEncontrado.nombre || usuarioEncontrado.usuario,
                rol: usuarioEncontrado.rol || 'usuario'
            };
            
        } catch (error) {
            console.error('Error en la autenticación:', error);
            return null;
        }
    }
}

// Instancia global de la base de datos
window.db = new Database();

// Para depuración
console.log('Base de datos inicializada correctamente');
console.log('Usuarios disponibles:', window.db.usuarios);
