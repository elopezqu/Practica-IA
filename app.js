const express = require('express');
const mysql = require('mysql2');

const app = express();
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


// Get para departamentos
app.get('/api/departamentos', (req, res) => {
  const sql = 'SELECT * FROM departamentos';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error al obtener los departamentos:', err);
      res.status(500).json({ error: 'Error al obtener los departamentos' });
    } else {
      res.json({ departamentos: result });
    }
  });
});

// Get para provincias  
app.get('/api/provincias/:idDepartamento', (req, res) => {
  const idDepartamento = req.params.idDepartamento;
  const sql = 'SELECT * FROM provincia WHERE idDepartamento = ?';
  db.query(sql, [idDepartamento], (err, result) => {
    if (err) {
      console.error('Error al obtener las provincias:', err);
      res.status(500).json({ error: 'Error al obtener las provincias' });
    } else {
      res.json({ provincias: result });
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







