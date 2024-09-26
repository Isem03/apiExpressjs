const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const db = require('./db');
const app = express();
const cors = require('cors');

app.use(cors());


app.use(bodyParser.json());

// Registro de usuario
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
   

  db.query('INSERT INTO login_system (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, results) => {
    if (err) return res.status(500).send('Error en el servidor.');
    res.status(201).send('Usuario registrado con éxito!');
  });
});

// Inicio de sesión

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM login_system WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).send('Error en el servidor.');
    if (results.length === 0) return res.status(404).send('Usuario no encontrado.');
    res.status(200).send('ingreso correcto');
    const user = results[0];

    // Comparar la contraseña 
    if (password !== user.password) {
      return res.status(401).send('Usuario o contraseña incorrecta!');
    }

    // Generar token JWT si la contraseña es válida
    const token = jwt.sign({ id: user.id }, 'supersecret', { expiresIn: 86400 });
    res.status(200).send({ auth: true, token });
  });
});

// ruta para listar todos los usuarios registrados
app.get('/users', (req, res) => {
  db.query('SELECT id, name, email FROM login_system', (err, results) => {
    if (err) return res.status(500).send('Error en el servidor.');
    res.status(200).json(results); // Devolver el resultado en formato JSON
  });
});

app.delete('/delete/:id',(req, res) =>{
  const id = req.params.id;
  db.query('DELETE FROM login_system WHERE id = ?',[id],(err)=>{
    if(err) return res.status(404).send('No se pudo eliminar al Usuario');
    res.status(200).send('Usuario eliminado');
  })
})



const puerto = 10060;
app.listen(puerto, () => {
  console.log(`Servidor corriendo en el puerto ${puerto}`);
});
