const express = require('express');
const router = require('../auth/auth.routes');

router.get('/', getToys)
router.get('/:toyId', getToyById)
router.post('/', addToy)
router.put('/:toyId', updateToy)
router.delete('/:toyId', removeToy)

module.exports = router