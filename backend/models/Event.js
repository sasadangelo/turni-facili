const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: { type: String },
    dtStamp: { type: Date, default: Date.now },
    dtStart: { type: Date, required: true },
    dtEnd: { type: Date, required: true },
    exDates: { type: String },
    timezone: { type: String },
    uid: { type: String, unique: true, default: () => new mongoose.Types.ObjectId().toString() },
    sequence: { type: Number, default: 0 },
    rrule: { type: String },
    recurring: { type: Boolean, default: false },
    untilType: { type: Number },
    untilDate: { type: Date },
    untilOccurrences: { type: Number },
    interval: { type: Number },
    frequency: { type: Number },
    recurrenceId: { type: Date },
    byweekday: { type: [Number] },
    status: { type: String },
    allDay: { type: Boolean, default: false },
    typeFk: { type: String },
    companyFk: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    employeeFk: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    duration: { type: String },
    ical: { type: String },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
