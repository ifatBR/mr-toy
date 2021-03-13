const express = require('express');
const router = express.Router();
const { getToys, getToyById, addToy, updateToy, removeToy } = require('./toy.controller')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')

router.get('/', getToys);
router.get('/:toyId', getToyById);
// router.post('/', addToy);
// router.put('/:toyId', updateToy);
// router.delete('/:toyId', removeToy);
router.post('/', requireAdmin, addToy);
router.put('/:toyId', requireAdmin, updateToy);
router.delete('/:toyId', requireAdmin, removeToy);

module.exports = router;
