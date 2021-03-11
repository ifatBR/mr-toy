const express = require('express');
const router = express.Router();
const { getToys, getToyById, addToy, updateToy, removeToy } = require('./toy.controller')

router.get('/', getToys);
router.get('/:toyId', getToyById);
router.post('/', addToy);
router.put('/:toyId', updateToy);
router.delete('/:toyId', removeToy);

module.exports = router;
