const express = require('express');

const router = express.Router();

router.post('/add', addOrganization);
router.put('/update/:id', updateOrganization);
router.delete('/delete/:id', deleteOrganization);

module.exports = router;
