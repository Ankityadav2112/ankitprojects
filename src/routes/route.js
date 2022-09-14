const express = require('express');
const router = express.Router();
const collegeController = require("../controllers/collegeController")

router.post('/functionup/colleges', collegeController.createCollege);
// router.post('/functionup/interns', internController.createintern);

router.get('/functionup/collegeDetails', collegeController.collegeDetails);

module.exports = router