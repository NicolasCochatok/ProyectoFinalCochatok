document.addEventListener("DOMContentLoaded", () => {
  const nombre = localStorage.getItem("nombre");
  const email = localStorage.getItem("email");

  mostrarMensajeBienvenida(nombre, email);
  configurarAccesoTienda(nombre, email);
});

function mostrarMensajeBienvenida(nombre, email) {
  const mensaje = document.getElementById("mensaje-bienvenida");
  if (!mensaje) return;

  if (nombre && email) {
    mensaje.innerHTML = `<p class="bienvenida">Bienvenido nuevamente, <strong>${nombre}</strong> 👋</p>`;
  } else {
    mensaje.innerHTML = `<p class="bienvenida">¡Comenzá tu experiencia de compra!</p>`;
  }
}

function configurarAccesoTienda(nombre, email) {
  const btnIrTienda = document.querySelector(".btn-acceso");
  if (!btnIrTienda) return;

  btnIrTienda.addEventListener("click", () => {
    if (!nombre || !email) {
      Swal.fire({
        title: "Recomendación",
        text: "Te sugerimos completar tus datos en la tienda para personalizar tu experiencia.",
        icon: "info",
        confirmButtonText: "Continuar igual"
      });
    
    }

  });
}
