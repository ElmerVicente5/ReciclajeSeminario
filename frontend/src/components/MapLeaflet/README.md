# MapLeaflet

Este componente muestra un mapa interactivo con los puntos de acopio de residuos, usando Leaflet y React-Leaflet.

## ¿Qué hace?

- Muestra un mapa centrado en la Ciudad de México.
- Coloca marcadores en puntos de acopio de CDMX y Guatemala.
- Cada marcador tiene un popup con el nombre del punto.
- El mapa es responsivo y se adapta al diseño del dashboard.
- El estilo del mapa está en `MapLeaflet.module.css`.

## Ubicaciones incluidas

- Centro CDMX
- Acopio Norte (CDMX)
- Acopio Sur (CDMX)
- Centro Guatemala
- Zona 1 Guatemala
- Mixco Guatemala

## Tecnologías usadas

- React
- react-leaflet
- leaflet
- CSS Modules

## Personalización

- Para agregar más puntos, edita el array `puntosAcopio` en `MapLeaflet.jsx`.
- Para cambiar el estilo, edita `MapLeaflet.module.css`.

## Uso

Este componente se importa y usa en el dashboard principal. Puedes reutilizarlo en otras páginas si necesitas mostrar mapas con marcadores personalizados.
