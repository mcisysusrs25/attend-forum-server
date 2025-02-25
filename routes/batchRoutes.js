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
router.get("/details/:batchID", getBatchDetails); // Get batch details
router.post("/update", updateBatch);
router.delete("/delete/:batchID", deleteBatch);

module.exports = router;