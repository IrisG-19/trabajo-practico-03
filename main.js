const API_URL = "https://huachitos.cl/api/animales";

const listado = document.getElementById("listado");
const loader = document.getElementById("loader");
const mensajeVacio = document.getElementById("mensajeVacio");

const filtroNombre = document.getElementById("filtroNombre");
const filtroCategoria = document.getElementById("filtroCategoria");
const filtroEdad = document.getElementById("filtroEdad");
const btnBuscar = document.getElementById("btnBuscar");
const btnLimpiar = document.getElementById("btnLimpiar");

const modal = document.getElementById("modalMascota");
const btnAgregar = document.getElementById("btnAgregarMascota");
const btnCerrar = document.getElementById("btnCerrarModal");
const btnCancelar = document.getElementById("btnCancelar");
const btnGuardar = document.getElementById("btnGuardar");

const inputNombre = document.getElementById("inputNombre");
const inputCategoria = document.getElementById("inputCategoria");
const inputEdad = document.getElementById("inputEdad");
const inputImagen = document.getElementById("inputImagen");
const editIndex = document.getElementById("editIndex");

let mascotas = [];

// Funciones de carga y renderizado

function showLoader() { loader.style.display = "block"; }
function hideLoader() { loader.style.display = "none"; }

function guardarLocalStorage() {
    localStorage.setItem("mascotasLocal", JSON.stringify(mascotas));
}

function cargarLocalStorage() {
    const data = localStorage.getItem("mascotasLocal");
    return data ? JSON.parse(data) : null;
}

function renderMascotas(data) {
    listado.innerHTML = "";
    if (data.length === 0) {
        mensajeVacio.style.display = "block";
        return;
    }
    mensajeVacio.style.display = "none";
    data.forEach((m, i) => {
        const col = document.createElement("div");
        col.className = "column is-4";
        col.innerHTML = `
          <div class="card">
            <div class="card-image">
              <figure class="image is-4by3">
                <img src="${m.image}" alt="${m.name}">
              </figure>
            </div>
            <div class="card-content">
              <p class="title is-5">${m.name}</p>
              <p class="subtitle is-6">${m.category} - ${m.age}</p>
            </div>
            <footer class="card-footer">
              <a href="#" class="card-footer-item has-text-info" onclick="editarMascota(${i})"><i class="fas fa-edit"></i> Editar</a>
              <a href="#" class="card-footer-item has-text-danger" onclick="eliminarMascota(${i})"><i class="fas fa-trash"></i> Eliminar</a>
            </footer>
          </div>
        `;
        listado.appendChild(col);
    });
}
// Función de carga inicial
async function fetchMascotas() {
    showLoader();
    try {
        const localData = cargarLocalStorage();
        if (localData) {
            // Si hay datos en localStorage, los uso
            mascotas = localData;
        } else {
            // Sino, traigo desde la API
            const res = await fetch(API_URL);
            const data = await res.json();
            mascotas = data.data.map(p => ({
                name: p.nombre ?? "Sin nombre",
                category: p.categoria ?? "Sin categoría",
                age: p.edad ?? "Sin edad",
                image: p.imagen && p.imagen.trim() !== "" ? p.imagen : "https://bulma.io/images/placeholders/1280x960.png"
            }));
            guardarLocalStorage(); // guardo la copia inicial en localStorage
        }
        renderMascotas(mascotas);
    } catch (e) {
        listado.innerHTML = `<p class="has-text-danger">Error cargando mascotas</p>`;
        console.error(e);
    } finally {
        hideLoader();
    }
}
// Filtros
function aplicarFiltros() {
    const nombre = filtroNombre.value.toLowerCase();
    const categoria = filtroCategoria.value;
    const edad = filtroEdad.value;

    const filtradas = mascotas.filter(m =>
        (!nombre || m.name.toLowerCase().includes(nombre)) &&
        (!categoria || m.category === categoria) &&
        (!edad || m.age === edad)
    );
    renderMascotas(filtradas);
}
btnBuscar.addEventListener("click", aplicarFiltros);
btnLimpiar.addEventListener("click", () => {
    filtroNombre.value = "";
    filtroCategoria.value = "";
    filtroEdad.value = "";
    renderMascotas(mascotas);
});
// Modal
function abrirModal() { modal.classList.add("is-active"); }
function cerrarModal() { modal.classList.remove("is-active"); }

btnAgregar.addEventListener("click", () => {
    editIndex.value = "";
    inputNombre.value = "";
    inputCategoria.value = "";
    inputEdad.value = "";
    inputImagen.value = "";
    abrirModal();
});
btnCerrar.addEventListener("click", cerrarModal);
btnCancelar.addEventListener("click", cerrarModal);

// Guardo cambios (POST / PUT)
btnGuardar.addEventListener("click", () => {
    const nueva = {
        name: inputNombre.value,
        category: inputCategoria.value,
        age: inputEdad.value,
        image: inputImagen.value || "https://bulma.io/images/placeholders/1280x960.png"
    };
    if (editIndex.value) {
        // PUT: edito
        mascotas[editIndex.value] = nueva;
    } else {
        // POST: agrego
        mascotas.push(nueva);
    }
    guardarLocalStorage(); // guardo en localStorage
    renderMascotas(mascotas);
    cerrarModal();
});

// Editar y eliminar
window.editarMascota = (i) => {
    const m = mascotas[i];
    editIndex.value = i;
    inputNombre.value = m.name;
    inputCategoria.value = m.category;
    inputEdad.value = m.age;
    inputImagen.value = m.image;
    abrirModal();
};

window.eliminarMascota = (i) => {
    if (confirm("¿Seguro que deseas eliminar esta mascota?")) {
        // Elimino
        mascotas.splice(i, 1);
        guardarLocalStorage();
        renderMascotas(mascotas);
    }
};
// Llamo la funcion
fetchMascotas();