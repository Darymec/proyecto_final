const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Conectado a MongoDB para migración');

  // Productos de ejemplo para migrar
  const products = [
    { name: 'Producto 1', price: 100, category: 'Categoría A', stock: 10 },
    { name: 'Producto 2', price: 200, category: 'Categoría B', stock: 20 },
    { name: 'Producto 3', price: 300, category: 'Categoría C', stock: 30 },
  ];

  // Insertar productos en MongoDB
  await Product.insertMany(products);
  console.log('Productos migrados exitosamente');

  // Cerrar conexión
  mongoose.connection.close();
})
.catch((error) => {
  console.error('Error en la migración:', error);
  mongoose.connection.close();
});
