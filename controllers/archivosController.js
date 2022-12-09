const multer = require('multer')
const shortid = require('shortid')
const fs = require('fs')
const Enlace = require('../models/Enlace')


exports.subirArchivo = async (req, res, next) => {
    
    const confMulter = {
        limits: {fileSize: req.usuario ? 1024 * 1024 * 10 : 1024 * 1024},
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../uploads')
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
                cb(null, `${shortid.generate()}${extension}`)
            },
        })
    }
    
    const upload = multer(confMulter).single('archivo')

    upload(req, res , async error => {
        console.log(req.file)
        if(!error) {
            res.json({archivo: req.file.filename})
        } else {
            console.log(error)
            return next()
        }
    })
}

exports.eliminarArchivo = async (req, res, next) => {
    console.log(req.archivo)
    
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`)
        console.log('Archivo eliminado')
    } catch (error) {
        console.log(error)
    }
}


exports.descargar = async (req, res, next) => {

    console.log(req.params)

    const enlace = await Enlace.findOne({nombre: req.params.archivo})

    const archivo = __dirname + '/../uploads/' + req.params.archivo
    res.download(archivo)

    console.log(enlace)
    // Eliminar el enlace si no tiene mas descargas disponibles
    if(enlace.descargas === 1) {

        req.archivo = enlace.nombre
        
        await Enlace.findOneAndRemove(enlace.id)
        next()
    } else {
        enlace.descargas--
        await enlace.save()
    }
}