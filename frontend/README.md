# Proyecto Inicial - Seminario 2025

## Instalación de dependencias principales

Ejecuta este comando para instalar todas las librerías necesarias:

```bash
npm install
```

Dependencias clave utilizadas en el proyecto:

- **React**: ^18.2.0 o superior
- **React DOM**: ^18.2.0 o superior
- **React Router DOM**: ^6.14.2 o superior
- **Bootstrap**: solo para responsividad
- **react-icons**: iconos universales y consistentes
- **chart.js** y **react-chartjs-2**: para gráficos profesionales

Si necesitas instalar alguna dependencia manualmente:

```bash
npm install react-icons chart.js react-chartjs-2
```

> Mantén tus dependencias actualizadas y revisa este README para nuevas librerías que se agreguen al proyecto.

NOTA: para revisar el proyecto "asegurate de haber instalado las dependencias npm install" seguido npm run dev

> ⚠️ **Este proyecto es un borrador inicial.**

## Login: funcionalidades y mejoras (agosto 2025)

- Validación de formato de correo electrónico antes de enviar.
- Mensajes de error claros y personalizados (correo inválido, campo vacío, credenciales incorrectas).
- Botón “Ingresar” deshabilitado y con texto “Ingresando...” mientras está cargando.
- Navegación por teclado estándar (Tab y Shift+Tab) entre campos y botones.
- Tooltips: al pasar el mouse sobre los campos de correo y contraseña aparece el mensaje “Completa este campo”.
- Botón para mostrar/ocultar la contraseña.
- Modal para recuperación de contraseña con validaciones y mensajes.

## Estado actual

- Estructura base creada con Vite + React.
- Carpetas organizadas para componentes, páginas, hooks, servicios, utilidades y estilos.
- Variables globales CSS definidas para colores, tipografías y tamaños según lineamientos UX/UI.
- Ejemplo de componente principal (`App.jsx`) y estilos globales.
- Comentarios descriptivos en cada archivo JS/JSX para facilitar la colaboración.

## ¿Qué sigue?

- Definir y documentar los flujos principales de la aplicación.
- Agregar páginas y componentes siguiendo la guía de estructura (`README_COMPONENTS.md`).
- Implementar hooks, servicios y rutas para cada nueva funcionalidad.
- Mantener la documentación actualizada en cada carpeta y en este README.

## Notas para el equipo

- Este repositorio está en fase de borrador. El código, estructura y documentación pueden cambiar según las necesidades del proyecto y las decisiones del equipo.
- Antes de agregar nuevas funcionalidades, revisa la guía de componentes y páginas.
- Usa comentarios descriptivos y README.md en cada carpeta para mantener la claridad.

---

> Para dudas sobre la estructura o el flujo de trabajo, consulta el archivo `README_COMPONENTS.md` en la carpeta `frontend`.
