const express = require('express');
const { create } = require('express-handlebars'); // Importamos 'create' de express-handlebars
const { Server } = require('socket.io');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 8080;

// Configuración de Handlebars
const hbs = create({ extname: '.handlebars' }); // Crear instancia de Handlebars con extensión .handlebars
app.engine('handlebars', hbs.engine); // Configurar Handlebars como el motor de plantillas
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views')); // Definir carpeta de vistas

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear JSON
app.use(express.json());

// Configuración de Multer para carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Lista de productos (de ejemplo)
let products = [
  { id: 1, name: 'Producto 1', price: 100 },
  { id: 2, name: 'Producto 2', price: 200 },
];

// Rutas
app.get('/', (req, res) => {
  res.render('index', { title: 'Página Principal', products });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realtimeproducts');
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.send('Archivo subido correctamente');
});

// Configuración del servidor HTTP
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// WebSockets con Socket.io
const io = new Server(httpServer);

io.on('connection', (socket) => {
  console.log('Cliente conectado');
  
  // Enviar lista de productos al cliente cuando se conecta
  socket.emit('productList', products);

  // Actualización de productos en tiempo real
  socket.on('newProduct', (newProduct) => {
    products.push(newProduct);
    io.emit('productList', products); // Enviar lista actualizada a todos los clientes
  });
});
