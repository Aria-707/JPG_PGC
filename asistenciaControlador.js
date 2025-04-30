const admin = require("./firebaseAdmin");
const { v4: uuidv4 } = require("uuid");

class AsistenciaControlador {
  constructor() {
    this.db = admin.firestore();
    this.collection = this.db.collection("asistencias");

    this.consultar = this.consultar.bind(this);
    this.ingresar = this.ingresar.bind(this);
    this.actualizar = this.actualizar.bind(this);
    this.borrar = this.borrar.bind(this);
  }

  async consultar(req, res) {
    try {
      const snapshot = await this.collection.get();
      const asistencias = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(asistencias);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async ingresar(req, res) {
    try {
      let body = req.body;

      if (Buffer.isBuffer(body)) {
        body = JSON.parse(body.toString("utf8"));
      }

      const nuevaAsistencia = {
        nombre: body.nombre,
        estadoAsistencia: body.estadoAsistencia,
        timestamp: new Date(),
      };

      const ref = await this.collection.add(nuevaAsistencia);
      const nuevoDoc = await ref.get();

      res.status(200).json({ id: ref.id, ...nuevoDoc.data() });
    } catch (err) {
      res.status(500).send("Error en ingresar: " + err.message);
    }
  }

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      let body = req.body;

      if (Buffer.isBuffer(body)) {
        body = JSON.parse(body.toString("utf8"));
      }

      await this.collection.doc(id).update(body);
      const updated = await this.collection.doc(id).get();

      res.status(200).json({ id: updated.id, ...updated.data() });
    } catch (err) {
      res.status(500).send("Error en actualizar: " + err.message);
    }
  }

  async borrar(req, res) {
    try {
      const { id } = req.params;

      await this.collection.doc(id).delete();
      res.status(200).json({ message: "Asistencia eliminada" });
    } catch (err) {
      res.status(500).send("Error al eliminar: " + err.message);
    }
  }
}

module.exports = new AsistenciaControlador();