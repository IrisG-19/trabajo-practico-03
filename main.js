const API_URL = "https://68cead546dc3f350777faf82.mockapi.io/api/pets";

const cardsContainer = document.getElementById("cards");
const spinner = document.getElementById("spinner");

const filtroNombre = document.getElementById("filtroNombre");
const filtroCategoria = document.getElementById("filtroCategoria");
const filtroEdad = document.getElementById("filtroEdad");
const filtroGenero = document.getElementById("filtroGenero");

const btnBuscar = document.getElementById("btnBuscar");
const btnLimpiar = document.getElementById("btnLimpiar");

const modalMascota = document.getElementById("modalMascota");
const btnAgregarMascota = document.getElementById("btnAgregarMascota");
const btnCerrarModal = document.getElementById("btnCerrarModal");
const btnCancelar = document.getElementById("btnCancelar");
const btnGuardar = document.getElementById("btnGuardar");

const inputNombre = document.getElementById("inputNombre");
const inputCategoria = document.getElementById("inputCategoria");
const inputEdad = document.getElementById("inputEdad");
const inputGenero = document.getElementById("inputGenero")
const inputImagen = document.getElementById("inputImagen");
const editIndex = document.getElementById("editIndex");

const notification = document.getElementById("notification");
const notificationMessage = document.getElementById("notificationMessage");
const closeNotification = document.getElementById("closeNotification");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

let currentPage = 1;
const limit = 6;

// Spinner
function showSpinner() { spinner.classList.remove("is-hidden"); }
function hideSpinner() { spinner.classList.add("is-hidden"); }

// Notification
function showNotification(message, type = "is-success") {
    notification.className = `notification ${type}`;
    notificationMessage.textContent = message;
    notification.classList.remove("is-hidden");
    setTimeout(() => notification.classList.add("is-hidden"), 3000);
}
closeNotification.addEventListener("click", () => notification.classList.add("is-hidden"));

//Renderiza las cards
function renderCards(mascotas) {
    cardsContainer.innerHTML = "";
    if (mascotas.leng === 0) {
        cardsContainer.innerHTML = `<p class="has-text-centered">No se encontraron mascotas.</p>`;
        return;
    }

    mascotas.forEach(m => {
        const card = document.createElement("div");
        card.className = "column is-one-third";
        const imageUrl = m.avatar || "https://bulma.io/images/placeholders/1280x960.png";

        card.innerHTML = `
    <div class="card"> 
    <div class="card-image">
    <figure class="image is-4by3">
    <img src="${imageUrl}" alt="${m.name}" onerror="this.src='https://bulma.io/images/placeholders/1280x960.png'">
    </figure>
    </div>
    <div class="card-content">
    <p class="title is-5">${m.name}</p>
    <p>
     <span class="tag is-info is-medium">${m.categoria}</span> 
     <span class="tag is-warning is-medium">${m.edad}</span>
     <span class="tag is-primary is-medium">${m.gender}</span>
    </p>
        </div>
        <footer class="card-footer">
          <a href="#" class="card-footer-item has-text-info edit-btn" data-id="${m.id}">
          <i class="fas fa-edit"></i> Editar</a>
          <a href="#" class="card-footer-item has-text-danger delete-btn" data-id="${m.id}">
          <i class="fas fa-trash"></i>Eliminar</a>
        </footer>
      </div>`;

        cardsContainer.appendChild(card);
    });

    //Eventos para editar y eliminar
    document.querySelectorAll(".edit-btn").forEach(btn =>
        btn.addEventListener("click", () => editMascota(btn.dataset.id))
    );
    document.querySelectorAll(".delete-btn").forEach(btn =>
        btn.addEventListener("click", () => deleteMascota(btn.dataset.id))
    );
}
    // Función de carga inicial
    async function fetchMascotas() {
    try {
        showSpinner();
        const url = new URL(API_URL);
        url.searchParams.append('page', currentPage);
        url.searchParams.append('limit', limit);

        if (filtroNombre.value.trim()) url.searchParams.append('name', filtroNombre.value.trim());
        if (filtroCategoria.value) url.searchParams.append('categoria', filtroCategoria.value);
        if (filtroEdad.value) url.searchParams.append('edad', filtroEdad.value);
        if (filtroGenero.value) url.searchParams.append('gender', filtroGenero.value);

        const res = await fetch(url, { method: 'GET', headers: { 'content-type': 'application/json' } });
        if (!res.ok) throw new Error('Error al cargar mascotas');
        const data = await res.json();
        renderCards(data);
        updatePagination(data.length);
    } catch (error) {
        console.error(error);
        showNotification("Error al cargar mascotas", "is-danger");
    } finally {
        hideSpinner();
    }
}

//Paginacion
function updatePagination(count) {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = count < limit;
}
prevBtn.addEventListener("click", () => { if (currentPage > 1) { currentPage--; fetchMascotas(); } });
nextBtn.addEventListener("click", () => { currentPage++; fetchMascotas(); });


// Filtros

btnBuscar.addEventListener("click", () => { currentPage = 1; fetchMascotas(); });
btnLimpiar.addEventListener("click", () => {
    filtroNombre.value = "";
    filtroCategoria.value = "";
    filtroEdad.value = "";
    filtroGenero.value = "";
    currentPage = 1;
    fetchMascotas();
});

// Modal
function openModal() { modalMascota.classList.add("is-active"); }
function closeModalForm() {
    modalMascota.classList.remove("is-active");
    inputNombre.value = "";
    inputCategoria.value = "";
    inputEdad.value = "";
    inputGenero.value = "";
    inputImagen.value = "";
    editIndex.value = "";
}

btnAgregarMascota.addEventListener("click", openModal);
btnCerrarModal.addEventListener("click", closeModalForm);
btnCancelar.addEventListener("click", closeModalForm);


// Guardo cambios
btnGuardar.addEventListener("click", async () => {
    const mascota = {
        name: inputNombre.value,
        categoria: inputCategoria.value,
        edad: inputEdad.value,
        gender: inputGenero.value,
        avatar: inputImagen.value
    };

    if (!mascota.name || !mascota.categoria || !mascota.edad || !mascota.gender) {
        showNotification("Completa todos los campos obligatorios", "is-danger");
        return;
    }

    try {
        if (editIndex.value) {
            await fetch(`${API_URL}/${editIndex.value}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mascota)
            });
            showNotification("Mascota actualizada con éxito");
        } else {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mascota)
            });
            showNotification("Mascota agregada con éxito");
        }
        closeModalForm();
        fetchMascotas();
    } catch (error) {
        console.error(error);
        showNotification("Error al guardar mascota", "is-danger");
    }
});

// Editar y eliminar
async function editMascota(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error("Error al obtener mascota");
        const m = await res.json();
        editIndex.value = m.id;
        inputNombre.value = m.name;
        inputCategoria.value = m.categoria;
        inputEdad.value = m.edad;
        inputGenero.value = m.gender;
        inputImagen.value = m.avatar || "";
        openModal();
    } catch (error) {
        console.error(error);
        showNotification("Error al  cargar mascota", "is-danger");
    }
}

// Elimino
async function deleteMascota(id) {
    if (!confirm("¿Seguro que quieres eliminar esta mascota?"))
        return;
    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        showNotification("Mascota eliminada con exito");
        fetchMascotas();
    } catch (error) {
        console.error(error);
        showNotification("Error al eliminar mascota", "is-danger");
    }
}

// Llamo la funcion
fetchMascotas();