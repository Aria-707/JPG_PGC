const { v4: uuidv4 } = require("uuid");

class AsistenciaControlador {
  constructor() {
    this.asistencias = [];

    this.consultar = this.consultar.bind(this);
    this.ingresar = this.ingresar.bind(this);
    this.actualizar = this.actualizar.bind(this);
    this.borrar = this.borrar.bind(this);
  }

  consultar(req, res) {
    try {
      res.status(200).json(this.asistencias);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  ingresar(req, res) {
    try {
      let body = req.body;
  
      // Detecta si el body está como Buffer
      if (Buffer.isBuffer(body)) {
        const json = body.toString("utf8");
        body = JSON.parse(json);
      }
  
      console.log("Body parseado:", body);
  
      const { nombre, estado } = body;
  
      const nuevo = {
        id: uuidv4(),
        nombre,
        estado
      };
  
      this.asistencias.push(nuevo);
      res.status(200).json(nuevo);
    } catch (err) {
      res.status(500).send("Error en ingresar: " + err.message);
    }
  }
  

  actualizar(req, res) {
    try {
      let body = req.body;
  
      if (Buffer.isBuffer(body)) {
        const json = body.toString("utf8");
        body = JSON.parse(json);
      }
  
      console.log("Body recibido en actualizar:", body);
  
      const { id } = req.params;
      const { nombre, estado } = body;
  
      const index = this.asistencias.findIndex(e => e.id === id);
      if (index === -1) {
        return res.status(404).send("Asistencia no encontrada");
      }
  
      if (nombre) this.asistencias[index].nombre = nombre;
      if (estado) this.asistencias[index].estado = estado;
  
      res.status(200).json(this.asistencias[index]);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
  
  borrar(req, res) {
    try {
      const { id } = req.params;
      const index = this.asistencias.findIndex(e => e.id === id);
      if (index === -1) {
        return res.status(404).send("Registro no encontrado");
      }
  
      const eliminado = this.asistencias.splice(index, 1)[0];
      res.status(200).json(eliminado);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
  
}

module.exports = new AsistenciaControlador();
