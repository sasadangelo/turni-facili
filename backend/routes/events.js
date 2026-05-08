const express = require("express");
const Event = require("../models/event");
const router = express.Router();

// ✅ GET: Lista di tutti gli eventi
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET: Evento per ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Evento non trovato" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST: Creazione nuovo evento
router.post("/", async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ PUT: Aggiornamento evento
router.put("/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) return res.status(404).json({ message: "Evento non trovato" });
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ DELETE: Eliminazione evento
router.delete("/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: "Evento non trovato" });
    res.json({ message: "Evento eliminato" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
