function guardar(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const estado = document.getElementById("estado").value;

  const data = JSON.stringify({
    nombre,
    estado
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

  let html = `
    <h2>Listado de Asistencias</h2>
    <table border="1">
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
        <td>${item.estado}</td>
        <td>
          <button onclick="editar('${item.id}', '${item.nombre}', '${item.estado}')">Editar</button>
          <button onclick="eliminar('${item.id}')">Eliminar</button>
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

function editar(id, nombre, estado) {
  const nuevoNombre = prompt("Nuevo nombre:", nombre);
  const nuevoEstado = prompt("Nuevo estado:", estado);

  if (!nuevoNombre || !nuevoEstado) {
    console.log("Edición cancelada por el usuario");
    return;
  }

  const body = { nombre: nuevoNombre, estado: nuevoEstado };
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