const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
app.use(bodyParser.json());

// Registro de usuario
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  db.query('INSERT INTO login_system (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err, results) => {
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

    const user = results[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).send('Usuario o contrasena incorrecta!');

    const token = jwt.sign({ id: user.id }, 'supersecret', { expiresIn: 86400 });
    res.status(200).send('Ingreso  éxitoso!');
    // res.status(200).send({ auth: true, token });
  });
});
const puerto = 10060;
app.listen(puerto, () => {
  console.log(`Servidor corriendo en el puerto ${puerto}`);
});
