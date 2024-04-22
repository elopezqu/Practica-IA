const express = require('express');
//const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3000;

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'monorail.proxy.rlwy.net',
  user: 'root',
  password: 'wZdCgiZUjdXBNnHAaCfidVupoqKsntxk',
  database: 'railway',
  port: 10825,
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from('wZdCgiZUjdXBNnHAaCfidVupoqKsntxk') // Esto es necesario para ciertas versiones de MySQL
  }
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos MySQL');
  }
});

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

app.get('/ubigeo', (req, res) => {
  res.sendFile(__dirname + '/ubigeo.html');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});







