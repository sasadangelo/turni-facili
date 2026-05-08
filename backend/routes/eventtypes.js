const express = require("express");
const EventType = require("../models/EventType");
const Company = require("../models/Company");
const logger = require("../utils/logger");
const router = express.Router();

// Create EventType (verify the Company exists)
router.post("/", async (req, res) => {
  try {
    logger.info("📌 [POST] /eventtypes - Create event type request received", { body: req.body });
    const { name, code, company } = req.body;
    logger.debug("🔍 Parameters extracted from request", { name, code, company });
    const companyExists = await Company.findById(company);
    if (!companyExists) {
      logger.warn("⚠️ Company not found", { company });
      return res.status(400).json({ success: false, message: "Company not found" });
    }
    const eventType = new EventType({ name, code, company });
    await eventType.save();
    logger.info("✅ EventType created", { eventType });
    res.status(201).json({ success: true, eventType });
  } catch (error) {
    logger.error("❌ Error creating EventType", { error: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
});

// Read all EventTypes by Company
router.get("/", async (req, res) => {
  try {
    logger.info("📌 [GET] /eventtypes - Request received", { query: req.query });
    const { company } = req.query;
    if (!company) {
      logger.warn("⚠️ Missing Company ID");
      return res.status(400).json({ success: false, message: "Company ID is required" });
    }
    const eventTypes = await EventType.find({ company }).populate("company");
    logger.info("✅ EventTypes retrieved", { count: eventTypes.length });
    res.json({ success: true, eventTypes, count: eventTypes.length });
  } catch (error) {
    logger.error("❌ Error retrieving EventTypes", { error: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
});

// Read single EventType by ID
router.get("/:id", async (req, res) => {
  try {
    logger.info("📌 [GET] /eventtypes/:id - Request received", { id: req.params.id });
    const eventType = await EventType.findById(req.params.id).populate("company");
    if (!eventType) {
      logger.warn("⚠️ EventType not found", { id: req.params.id });
      return res.status(404).json({ success: false, message: "EventType not found" });
    }
    logger.info("✅ EventType retrieved", { eventType });
    res.json({ success: true, eventType });
  } catch (error) {
    logger.error("❌ Error retrieving EventType", { error: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update EventType (senza modificare Company)
router.put("/:id", async (req, res) => {
  try {
    logger.info("📌 [PUT] /eventtypes/:id - Request received", { id: req.params.id, body: req.body });
    const { name, code } = req.body;
    const eventType = await EventType.findByIdAndUpdate(
      req.params.id,
      { name, code },
      { new: true, runValidators: true }
    );
    if (!eventType) {
      logger.warn("⚠️ EventType not found", { id: req.params.id });
      return res.status(404).json({ success: false, message: "EventType not found" });
    }
    logger.info("✅ EventType updated", { eventType });
    res.json({ success: true, eventType });
  } catch (error) {
    logger.error("❌ Error updating EventType", { error: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete EventType by ID
router.delete("/:id", async (req, res) => {
  try {
    logger.info("📌 [DELETE] /eventtypes/:id - Request received", { id: req.params.id });
    const eventType = await EventType.findByIdAndDelete(req.params.id);
    if (!eventType) {
      logger.warn("⚠️ EventType not found", { id: req.params.id });
      return res.status(404).json({ success: false, message: "EventType not found" });
    }
    logger.info("✅ EventType deleted", { eventType });
    res.json({ success: true, message: "EventType deleted successfully" });
  } catch (error) {
    logger.error("❌ Error deleting EventType", { error: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
