const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Conexion con la base de Datos en la nube

const db = mysql.createConnection({
  host: 'roundhouse.proxy.rlwy.net',
  user: 'root',
  password: 'EglUDrutrCVjfQTwJMjkOCwbOWFTbHDw',
  database: 'railway',
  port: 44028,
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from('EglUDrutrCVjfQTwJMjkOCwbOWFTbHDw') 
  }
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos MySQL');
  }
});

// Get para Pais
app.get('/api/paises', (req, res) => {
  const sql = 'SELECT * FROM pais';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error al obtener los países:', err);
      res.status(500).json({ error: 'Error al obtener los países' });
    } else {
      res.json({ paises: result });
    }
  });
});

// Get para departamentos
app.get('/api/departamentos/:idPais', (req, res) => {
  const idPais = req.params.idPais;
  const sql = 'SELECT * FROM departamentos WHERE idPais = ?';
  db.query(sql, [idPais], (err, result) => {
    if (err) {
      console.error('Error al obtener los departamentos:', err);
      res.status(500).json({ error: 'Error al obtener los departamentos' });
    } else {
      res.json({ departamentos: result });
    }
  });
});
// Get para provincias  
app.get('/api/provincias/:departamento', (req, res) => {
  const departamento = req.params.departamento;
  const sql = 'SELECT p.* FROM provincia p INNER JOIN departamentos d ON p.idDepartamento = d.idDepartamento WHERE d.departamento = ?';
  db.query(sql, [departamento], (err, result) => {
    if (err) {
      console.error('Error al obtener las provincias:', err);
      res.status(500).json({ error: 'Error al obtener las provincias' });
    } else {
      res.json({ provincias: result });
    }
  });
});

// Get para distritos
app.get('/api/distritos/:provincia', (req, res) => {
  const provincia = req.params.provincia;
  const sql = 'SELECT p.* FROM distrito p INNER JOIN provincia d ON p.idProvincia = d.idProvincia WHERE d.provincia = ?';
  db.query(sql, [provincia], (err, result) => {
    if (err) {
      console.error('Error al obtener los distritos:', err);
      res.status(500).json({ error: 'Error al obtener los distritos' });
    } else {
      res.json({ distritos: result });
    }
  });
});

//Get para ubigeo
app.get('/api/ubigeo/:departamento/:provincia?/:distrito?', (req, res) => {
  const departamento = req.params.departamento;
  let provincia = req.params.provincia || '';
  let distrito = req.params.distrito || '';
  
  let sql = 'SELECT * FROM ubigeo u WHERE u.dpto = ?';
  let params = [departamento];

  // Agregar provincia a la consulta y parámetros si está presente
  if (provincia !== '') {
    sql += ' AND u.prov = ?';
    params.push(provincia);
  }

  // Agregar distrito a la consulta y parámetros si está presente
  if (distrito !== '') {
    sql += ' AND u.distrito = ?';
    params.push(distrito);
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error al obtener ubigeo: ', err);
      res.status(500).json({ error: "error al obtener ubigeo" });
    } else {
      res.json({ ubigeos: result });
    }
  });
});

// Post para pais
app.post('/api/paises', (req, res) => {
  const { pais, nacionalidad } = req.body; // Se espera que los datos del país se envíen en el cuerpo de la solicitud en formato JSON
  console.log(pais, nacionalidad);
  // Verificar si se proporcionan todos los campos necesarios
  if (!pais || !nacionalidad) {
    return res.status(400).json({ error: 'Se requiere el nombre del país y la nacionalidad para crear un país.' });
  }

  const sql = 'INSERT INTO pais (pais, nacionalidad) VALUES (?, ?)';
  console.log(sql);
  db.query(sql, [pais, nacionalidad], (err, result) => {
    if (err) {
      console.error('Error al crear el país:', err);
      res.status(500).json({ error: 'Error al crear el país' });
    } else {
      res.status(201).json({ message: 'País creado correctamente', id: result.insertId });
    }
  });
});

// Post para departamentos
app.post('/api/departamentos', (req, res) => {
  const { departamento , idPais } = req.body;

  if (!departamento || !idPais) {
    return res.status(400).json({ error: 'Se requiere el nombre del departamento para crearlo.' });
  }

  const sql = 'INSERT INTO departamentos (departamento, idPais) VALUES (?, ?)';
  db.query(sql, [departamento , idPais], (err, result) => {
    if (err) {
      console.error('Error al crear el departamento:', err);
      res.status(500).json({ error: 'Error al crear el departamento' });
    } else {
      res.status(201).json({ message: 'Departamento creado correctamente', id: result.insertId });
    }
// Post para provincias
  const { provincia, idDepartamento } = req.body;

  if (!provincia || !idDepartamento) {
    return res.status(400).json({ error: 'Se requiere el nombre de la provincia y el ID del departamento para crearla.' });
  }

  const sql = 'INSERT INTO provincia (provincia, idDepartamento) VALUES (?, ?)';
  db.query(sql, [provincia, idDepartamento], (err, result) => {
    if (err) {
      console.error('Error al crear la provincia:', err);
      res.status(500).json({ error: 'Error al crear la provincia' });
    } else {
      res.status(201).json({ message: 'Provincia creada correctamente', id: result.insertId });
    }
  });
});


  });
// Post para  distritos
app.post('/api/distritos', (req, res) => {
  const { distrito, idProvincia } = req.body;

  if (!distrito || !idProvincia) {
    return res.status(400).json({ error: 'Se requiere el nombre del distrito y el ID de la provincia para crearlo.' });
  }

  const sql = 'INSERT INTO distrito (distrito, id_provincia) VALUES (?, ?)';
  db.query(sql, [distrito, idProvincia], (err, result) => {
    if (err) {
      console.error('Error al crear el distrito:', err);
      res.status(500).json({ error: 'Error al crear el distrito' });
    } else {
      res.status(201).json({ message: 'Distrito creado correctamente', id: result.insertId });
    }
  });
});





//  HTML de prueba
app.get('/ubigeo', (req, res) => {
  res.sendFile(__dirname + '/ubigeo.html');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});







