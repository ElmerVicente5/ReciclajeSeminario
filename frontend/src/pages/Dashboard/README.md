# Dashboard Municipal

Este componente implementa el panel principal del sistema municipal, mostrando métricas clave, gráficos y el mapa de puntos de acopio.

## ¿Qué incluye este dashboard?

- **Barra lateral (sidebar):** Navegación principal, con iconos y acceso rápido al panel y cierre de sesión.
- **Tarjetas de métricas:** Muestran datos relevantes como clasificaciones, participación y residuos comunes.
- **Gráfico de barras:** Visualización de clasificaciones por día usando Chart.js.
- **Mapa interactivo:** Muestra los puntos de acopio en la ciudad usando Leaflet.
- **Diseño responsivo:** Sidebar se mueve abajo en móvil, el mapa nunca se monta sobre el navbar.
- **Logout:** El icono de usuario permite cerrar sesión y regresar al login.

## Tecnologías utilizadas

- React 19
- Chart.js + react-chartjs-2
- Leaflet + react-leaflet
- CSS Modules
- Bootstrap (solo para grid y responsividad)

## Detalles técnicos

- El dashboard está en `src/pages/Dashboard/Dashboard.jsx`.
- Los estilos están en `Dashboard.module.css`.
- El mapa está en `src/components/MapLeaflet/MapLeaflet.jsx`.
- El sidebar es fijo y responsivo.
- El mapa y el contenido nunca se montan sobre el navbar en móvil.

## Cómo funciona el logout

Al presionar el icono de usuario en la barra lateral, se elimina el estado de autenticación y se redirige al login.

## Para el equipo

Este dashboard es la base visual y funcional del sistema. Si necesitas agregar nuevas métricas, gráficos o mapas, sigue la estructura y estilos definidos aquí. Para dudas, revisa este README y los comentarios en el código.
