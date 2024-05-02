// Importing the mongoose library
const mongoose = require("mongoose");

// Defining the schema for the Project collection
const Edit_Requests = new mongoose.Schema({
  _id: {
    type: String,
  },
  project_id: {
    type: String,
  },
  manager_approval: {
    type: String,
    default:"pending"
  },
  admin_approval: {
    type: String,
    default:"pending"
  },
  user_id: {
    type: String,
  },
  user: {
    type: Object,
  },
});

// Exporting the Project model, using the defined schema, as a Mongoose model named "Project"
module.exports = mongoose.model("Edit_Requests", Edit_Requests);

// const default_mom = {
//   _id: "",
//   project_id: "",
//   date: "",
//   duration: "",
//   mom_link: "",
//   comments:""
// };
