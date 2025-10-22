# Sistema de Gestión Empresarial (ERP)

Sistema integral para la gestión de inventario, ventas, clientes y más.

## Requisitos Previos

- Node.js 18 o superior
- PostgreSQL 14 o superior
- npm o yarn

## Configuración Inicial

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd erp-system
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Copiar el archivo `.env.example` a `.env`
   - Configurar las variables según tu entorno

4. **Configurar la base de datos**
   - Asegúrate de tener PostgreSQL en ejecución
   - Crea una base de datos llamada `erp_system`
   - Actualiza la URL de conexión en `.env`

5. **Aplicar migraciones**
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

## Estructura del Proyecto

- `/app` - Rutas y páginas de la aplicación
- `/components` - Componentes reutilizables
- `/lib` - Utilidades y configuraciones
- `/prisma` - Esquema y migraciones de la base de datos
- `/public` - Archivos estáticos
- `/styles` - Estilos globales

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia la aplicación en producción
- `npm run lint` - Ejecuta el linter
- `prisma migrate dev` - Aplica migraciones a la base de datos

## Despliegue

La aplicación está lista para ser desplegada en plataformas como Vercel, Netlify o cualquier servicio que soporte Next.js.
