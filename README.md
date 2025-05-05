# Task Genius App

Task Genius App es una aplicación diseñada para ayudarte a gestionar tus tareas de manera eficiente y recibir consejos útiles de un "genio" virtual. La aplicación está desplegada en Netlify y puedes verla funcionando en el siguiente enlace:

[Task Genius App en Netlify](https://taskgeniusapp.netlify.app)

## Tecnologías utilizadas

- **React**: Biblioteca para construir interfaces de usuario.
- **TypeScript**: Lenguaje de programación que extiende JavaScript añadiendo tipos estáticos.
- **Vite**: Herramienta de construcción rápida para proyectos web modernos.
- **CSS Modules**: Para estilos encapsulados y reutilizables.
- **Context API**: Para la gestión del estado global de la aplicación.
- **Netlify**: Plataforma para el despliegue y hosting de aplicaciones web.

## Instrucciones básicas

### Requisitos previos

- Node.js (versión 16 o superior)
- npm o yarn

### Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/task-genius-app.git
   ```

2. Navega al directorio del proyecto:
   ```bash
   cd task-genius-app
   ```

3. Instala las dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

### Ejecución en desarrollo

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   # o
   yarn dev
   ```

2. Abre tu navegador y ve a `http://localhost:5173`.

### Construcción para producción

1. Genera los archivos optimizados para producción:
   ```bash
   npm run build
   # o
   yarn build
   ```

2. Los archivos generados estarán en la carpeta `dist/`.

### Despliegue

La aplicación ya está desplegada en Netlify. Si deseas realizar un nuevo despliegue, sigue estos pasos:

1. Asegúrate de tener una cuenta en [Netlify](https://www.netlify.com/).
2. Conecta tu repositorio a Netlify.
3. Configura el comando de construcción como `npm run build` y el directorio de publicación como `dist/`.

¡Disfruta usando Task Genius App!