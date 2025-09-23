# Buscador de mascotas para adopcion 🐾

 <img src="img/captura de pantalla (28).png">

 Es un proyecto sencillo cuya aplicacion web sencilla que consume la API de Huachitos un refugio de animales que muestra animales para dar en adopcion; que incluye filtros por categoria y edad, un buscador por nombre y opciones para editar o eliminar registros. Es realizado con "BULMA CCS".

 ## Se utilizo 

 - HTML
 - Bulma CSS
 - Javascript
 - Fetch API (Consume datos desde la API externa)
 - GitHub (Deployado)

## Estructura del proyecto

Proyecto Buscador Mascotas
- index.html 
- Bulma CSS
- main.js
- README.md

## Funciones

🔍 Buscar por nombre (La Mascota).
🔵 Filtrar por categoria (Ej: perros, gatos, aves, conejo)
🔵 Filtrar por edad
🌇 Muestra imagenes, nombre, categoria y edad de cada animal
🚮 Eliminar (cada mascota)
✍️ Editar (mascota)
🎨 Diseño Responsivo con bulma 
🪨 Footer con informacion de contacto y enlace

## API Utilizada

Consume API publica del refugio Huachitos:
👉 (https://huachitos.cl/api/animales)

Ejemplo de respuesta: en formato JSON
{
  "id": 1,
  "nombre": "Firulais",
  "categoria": "perro",
  "edad": "2 años",
  "imagen": "https://..." 
}

