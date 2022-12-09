const express = require('express');
const router = express.Router();
const enlacesController = require('../controllers/enlacesController');
const archivosController = require('../controllers/archivosController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

router.post('/', 
    [
        check('nombre', 'Sube un archivo').not().isEmpty(),
        check('nombre_original', 'Sube un archivo').not().isEmpty(),
    ],
    auth,
    enlacesController.nuevoEnlace
);

router.get('/', 
    enlacesController.getEnlaces,
);

router.get('/:url', 
    enlacesController.hasPassword,
    enlacesController.getEnlace
);

router.post('/:url', 
    enlacesController.checkPassword,
    enlacesController.getEnlace
);

module.exports = router;