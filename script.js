function guardar(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const estado = document.getElementById("estadoAsistencia").value;

  const data = JSON.stringify({
    nombre,
    estadoAsistencia: estado
  });

  fetch("/.netlify/functions/asistencia", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data
  })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(text || "Error al guardar");
        });
      }
      return response.text();
    })
    .then(result => {
      alert("Asistencia registrada");
      listar();
    })
    .catch(error => {
      alert("Error guardando: " + error.message);
    });
}

function cargar(resultado) {
  let datos;
  try {
    datos = JSON.parse(resultado);
    console.log("Datos parseados:", datos);
  } catch {
    document.getElementById("rta").innerText = "Error cargando datos";
    return;
  }

  const estiloTabla = `
    <style>
      .tabla-asistencias {
        width: 100%; /* La tabla ocupará todo el ancho disponible */
        margin: 20px auto;
        border-collapse: collapse;
        background-color: rgba(255, 255, 255, 0.9);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
      }

      .tabla-asistencias th, .tabla-asistencias td {
        padding: 25px; /* Aumento de padding para más espacio en las celdas */
        text-align: center;
        font-size: 18px; /* Tamaño de texto más grande */
      }

      .tabla-asistencias th {
        background-color: #4CAF50;
        color: white;
      }

      .tabla-asistencias td {
        border-bottom: 1px solid #ddd;
      }

      .tabla-asistencias tr:nth-child(even) {
        background-color: #f2f2f2;
      }

      .tabla-asistencias tr:hover {
        background-color: #ddd;
      }

      .btn-editar, .btn-eliminar {
        padding: 10px 20px;
        font-size: 16px;
        font-weight: bold;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin: 5px;
      }

      .btn-editar {
        background-color: rgb(80, 187, 80);
        color: white;
      }

      .btn-eliminar {
        background-color: rgb(255, 69, 58);
        color: white;
      }

      .btn-editar:hover {
        background-color: rgb(60, 160, 60);
      }

      .btn-eliminar:hover {
        background-color: rgb(255, 40, 30);
      }
    </style>
  `;

  let html = `
    ${estiloTabla}
    <br><br>
    <h2></h2>
    <h2>Listado de Asistencias</h2>
    <table class="tabla-asistencias">
      <thead>
        <tr>
          <th>Nombre del Estudiante</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
  `;

  datos.forEach(item => {
    html += `
      <tr>
        <td>${item.nombre}</td>
        <td>${item.estadoAsistencia}</td>
        <td>
          <button class="btn-editar" onclick="editar('${item.id}', '${item.nombre}', '${item.estadoAsistencia}')">Editar</button>
          <button class="btn-eliminar" onclick="eliminar('${item.id}')">Eliminar</button>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  document.getElementById("rta").innerHTML = html;
}

function listar(event) {
  if (event) event.preventDefault();

  fetch("/.netlify/functions/asistencia")
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(text || "Error al listar");
        });
      }
      return response.text();
    })
    .then(result => cargar(result))
    .catch(error => {
      console.error("Error al listar:", error.message);
      alert("Error al listar: " + error.message);
    });
}

function editar(id, nombre, estadoAsistencia) {
  const nuevoNombre = prompt("Nuevo nombre:", nombre);
  const nuevoEstado = prompt("Nuevo estado:", estadoAsistencia);

  if (!nuevoNombre || !nuevoEstado) {
    console.log("Edición cancelada por el usuario");
    return;
  }

  const body = { nombre: nuevoNombre, estadoAsistencia: nuevoEstado };
  console.log("Enviando actualización:", body);

  fetch(`/.netlify/functions/asistencia/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
    .then(response => {
      console.log("Respuesta del servidor (editar):", response);
      if (!response.ok) throw new Error("Error al actualizar");
      return response.text();
    })
    .then(data => {
      console.log("Texto recibido después de editar:", data);
      listar(); 
    })
    .catch(error => {
      console.error("Error en editar:", error.message);
      alert(error.message);
    });
}

function eliminar(id) {
  if (!confirm("¿Seguro que quieres eliminar este registro?")) return;

  fetch(`/.netlify/functions/asistencia/${id}`, {
    method: "DELETE"
  })
    .then(response => {
      console.log("Respuesta del servidor (eliminar):", response);
      if (!response.ok) throw new Error("Error al eliminar");
      return response.text();
    })
    .then(data => {
      console.log("Texto recibido después de eliminar:", data);
      listar(); 
    })
    .catch(error => {
      console.error("Error en eliminar:", error.message);
      alert(error.message);
    });
}