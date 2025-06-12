const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    Firstname: String,
    Lastname: String,
    Region: String,
    TownCity: String,
    Phone: String,
    Email: String,
    AddNotes: String,
    productId: String,
    productName: String,
    productPrice: Number
});

module.exports = mongoose.model('Orderproduct', OrderSchema);