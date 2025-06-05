document.addEventListener("DOMContentLoaded", () => {
  inicializarFormularioCliente();
  cargarProductos();
  configurarFinalizacionCompra();
});


// DATOS DEL CLIENTE

function inicializarFormularioCliente() {
  const form = document.getElementById("formCliente");
  const nombreInput = document.getElementById("nombre");
  const emailInput = document.getElementById("email");

  // Precarga si ya los guardó
  nombreInput.value = localStorage.getItem("nombre") || "";
  emailInput.value = localStorage.getItem("email") || "";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = nombreInput.value.trim();
    const email = emailInput.value.trim();

    if (validarDatos(nombre, email)) {
      localStorage.setItem("nombre", nombre);
      localStorage.setItem("email", email);
      Swal.fire("¡Listo!", "Datos guardados correctamente", "success");
    } else {
      Swal.fire("Error", "Ingresá un nombre y un email válidos", "error");
    }
  });
}

function validarDatos(nombre, email) {
  const emailValido = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
  return nombre.length >= 2 && emailValido;
}


// PRODUCTOS Y CARRITO


let carrito = [];

async function cargarProductos() {
  try {
    const res = await fetch("data/productos.json");
    const productos = await res.json();
    renderCatalogo(productos);
  } catch (error) {
    Swal.fire("Error", "No se pudo cargar el catálogo", "error");
  }
}

function renderCatalogo(productos) {
  const catalogo = document.getElementById("catalogo");
  catalogo.innerHTML = "";

  productos.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}" />
      <h3>${p.nombre}</h3>
      <p>${p.material}</p>
      <p><strong>$${p.precio}</strong></p>
      <input type="number" id="cant-${p.id}" placeholder="Cantidad" min="1">
      <button onclick="agregarAlCarrito(${p.id}, ${p.precio})">Agregar</button>
    `;
    catalogo.appendChild(card);
  });
}

window.agregarAlCarrito = (id, precio) => {
  const cantidadInput = document.getElementById(`cant-${id}`);
  const cantidad = parseInt(cantidadInput.value);

  if (!cantidad || cantidad <= 0) {
    Swal.fire("Cantidad inválida", "Ingresá una cantidad válida", "warning");
    return;
  }

  const existente = carrito.find(p => p.id === id);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ id, precio, cantidad });
  }

  cantidadInput.value = "";
  renderCarrito();
};

function renderCarrito() {
  const div = document.getElementById("carrito");
  div.innerHTML = "";
  let total = 0;

  carrito.forEach(p => {
    const subtotal = p.precio * p.cantidad;
    total += subtotal;
    div.innerHTML += `<p>ID ${p.id} - Cant: ${p.cantidad} - Subtotal: $${subtotal}</p>`;
  });

  div.innerHTML += `<p><strong>Total: $${total}</strong></p>`;
}


// FINALIZACIÓN DE COMPRA


function configurarFinalizacionCompra() {
  document.getElementById("finalizarCompra").addEventListener("click", () => {
    if (carrito.length === 0) {
      Swal.fire("Carrito vacío", "Agregá productos antes de finalizar", "info");
      return;
    }

    generarResumenPDF();
    Swal.fire("Compra exitosa", "Tu resumen fue descargado", "success");
    carrito = [];
    renderCarrito();
  });
}

function generarResumenPDF() {
  const doc = new jspdf.jsPDF();
  doc.text("Resumen de Compra - Reina Moda", 10, 10);
  let y = 20;

  carrito.forEach(p => {
    doc.text(`Producto ID: ${p.id} - Cantidad: ${p.cantidad} - $${p.precio * p.cantidad}`, 10, y);
    y += 10;
  });

  doc.save("resumen-compra.pdf");
}
