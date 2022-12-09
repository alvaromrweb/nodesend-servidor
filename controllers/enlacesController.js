const Enlace = require('../models/Enlace')
const shortid = require('shortid')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')

exports.nuevoEnlace = async (req, res, next) => {

    // Mostrar mensajes de express validator
    const errores = validationResult(req)

    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    const {nombre_original, nombre} = req.body

    const enlace = new Enlace()
    enlace.url = shortid.generate()
    enlace.nombre = nombre
    enlace.nombre_original = nombre_original
    
    // Si esta logeado
    if(req.usuario) {
        const { password, descargas } = req.body

        if(password) {
            // Hash password
            const salt = await bcrypt.genSalt(10)
            enlace.password = await bcrypt.hash(password, salt)
        }
        if(descargas) {
            enlace.descargas = descargas
        }
        enlace.autor = req.usuario.id
    }

    try {
        await enlace.save()
        res.json({ url: `${enlace.url}` })
        return next()
    } catch (error) {
        console.log(error)
    }
}

exports.hasPassword = async (req, res, next) => {
    
    const enlace = await Enlace.findOne({url: req.params.url})
    if(!enlace) {
        res.status(404).json({msg: 'Ese enlace no existe'})
        return next()
    }

    if(enlace.password) {
        return res.json({password: true, enlace: enlace.url})
    }

    next()
}

exports.getEnlace = async (req, res, next) => {
    
    const enlace = await Enlace.findOne({url: req.params.url})
    if(!enlace) {
        res.status(404).json({msg: 'Ese enlace no existe'})
        return next()
    }
    
    res.json({archivo: enlace.nombre, password: false})

    next()

}

exports.getEnlaces = async (req, res, next) => {
    try {
        
        const enlaces = await Enlace.find({}).select('url -_id')
        res.json({enlaces})
    } catch (error) {
        console.log(error)
    }
}

exports.checkPassword = async (req, res, next) => {

    const enlace = await Enlace.findOne({url: req.params.url})
    if(!enlace) {
        res.status(404).json({msg: 'Ese enlace no existe'})
        return next()
    }

    if(bcrypt.compareSync(req.body.password, enlace.password)) {
        next()
    } else {
        res.status(401).json({msg: 'Contraseña incorrecta'})
    }
}
