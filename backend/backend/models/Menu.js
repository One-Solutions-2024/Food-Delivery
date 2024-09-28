const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    items: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            description: { type: String },
            category: { type: String }
        }
    ]
});

const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;
