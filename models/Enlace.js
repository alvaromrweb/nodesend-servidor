const mongoose = require('mongoose')
const Schema = mongoose.Schema

const enlacesSchema = new Schema({
    url: {
        type: String,
        required: true,
        trim: true,
    },
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    nombre_original: {
        type: String,
        required: true,
        trim: true,
    },
    descargas: {
        type: Number,
        default: 1
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuarios',
        default: null
    },
    password: {
        type: String,
        trim: true,
        default: null
    },
    creado: {
        type: Date,
        default: Date.now(),
    }
})

module.exports = mongoose.model('Enlaces', enlacesSchema)