// Importing the mongoose library
const mongoose = require("mongoose");

// Defining the schema for the Audit History collection
const Audit_History_Schema = new mongoose.Schema({
  // Unique identifier for the audit history document
  project_id: {
    type: String,
  },
  _id: {
    type: String,
  },
  // Date of the audit
  date_of_audit: {
    type: String,
    required: [true, "please provide date of audit"],
  },
  // Name of the person who reviewed the project during the audit
  reviewed_by: {
    type: String,
    required: [true, "please provide date of audit"],
  },
  // Status of the project reviewed during the audit
  status: {
    type: String,
    required: [true, "please provide status"],
  },
  // Section of the project reviewed during the audit
  reviewed_section: {
    type: String,
    required: [true, "please provide reviewed section"],
  },
  // Comments made during the audit
  comment: {
    type: String,
    required: [true, "please provide comment"],
  },
  // Action items identified during the audit
  action_item: {
    type: String,
    required: [true, "please provide action_item"],
  },
  client_comment: {
    type: String,
    required: [true, "please provide client_comment"],
  },
});

// Exporting the Audit_History model, using the defined schema, as a Mongoose model named "Audit_History"
module.exports = mongoose.model("Audit_History", Audit_History_Schema);
