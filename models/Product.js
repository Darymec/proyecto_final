const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 }, // Validación para precios no negativos
  category: { type: String },
  stock: { type: Number, default: 0, min: 0 }, // Validación para stocks no negativos
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
