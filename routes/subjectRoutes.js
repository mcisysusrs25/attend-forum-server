// subjectRoutes.js
const express = require("express");
const { createSubject } = require("../controllers/subjectController");

const router = express.Router();

router.post("/add", createSubject);
// router.post("/getall", createSubject);

module.exports = router;