const express = require("express");
const router = express.Router();
const {
    createBatch,
    getAllBatchesByProfessorId,
    getBatchDetails,
    updateBatch,

    deleteBatch
} = require("../controllers/batchController");

router.post("/create", createBatch); // Create batch
router.post("/getBatchByProfessorId", getAllBatchesByProfessorId); // Get all batches
// router.get("/getBatchDetails/:id", getBatchDetails); // Get batch details
// router.put("/update", updateBatch);
// router.delete("/delete/:id", deleteBatch);

module.exports = router;