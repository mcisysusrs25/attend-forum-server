const express = require("express");
const router = express.Router();
const { 
    createBatch, 
    updateBatch, 
    deleteBatch, 
    getAllBatches, 
    getBatchById 
} = require("../controllers/batchController");

// ✅ Create a new batch
router.post("/create", createBatch);

// ✅ Update a batch (Add/Remove students)
router.put("/update/:batchId", updateBatch);

// ✅ Delete a batch
router.delete("/delete/:batchId", deleteBatch);

// ✅ Get all batches
router.get("/", getAllBatches);

// ✅ Get a single batch by ID
router.get("/:batchId", getBatchById);

module.exports = router;
