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



//  HTML de prueba
app.get('/ubigeo', (req, res) => {
  res.sendFile(__dirname + '/ubigeo.html');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});







