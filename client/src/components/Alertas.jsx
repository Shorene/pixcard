import Swal from 'sweetalert2';

export const mostrarAlerta = (titulo, mensaje, icono) => {
  Swal.fire({
    title: titulo,
    text: mensaje,
    icon: icono,
    timer: 3000,
  });
};

export const confirmarEliminacion = (callback) => {
  Swal.fire({
    title: "¿Deseas eliminar este empleado?",
    text: "No podrás recuperar sus datos",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
  }).then((result) => {
    if (result.isConfirmed) {
      callback();
    }
  });
};