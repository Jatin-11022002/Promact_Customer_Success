const audit_history = require("../../../Model/audit-history.js"); // Importing Audit History model
const { reorderArrayOfObject } = require("../../../Utilities/utility.js"); // Importing utility function for reordering arrays of objects

// Function to fetch audit history
const getAuditHistory = async (req, res) => {
  try {
    const { id } = req.params;

    // Default structure for audit history in case no data is found
    const default_audit_history = [
      {
        project_id: id,
        date_of_audit: "",
        reviewed_by: "",
        status: "",
        reviewed_section: "",
        comment: "",
        action_item: "",
        edited_by: "",
        client_comment: "",
        _id: "",
        __v: "",
      },
    ];

    let data = await audit_history.find({ project_id: id }); // Finding audit history data from the database

    // Checking if any data is found
    if (data.length == 0) {
      data = default_audit_history; // Setting default audit history structure if no data found
    } else {
      data = reorderArrayOfObject(data, default_audit_history); // Reordering audit history data
    }

    res.status(200).json({ data: data }); // Sending success response with fetched data
  } catch (error) {
    res.status(500).json({ message: "Error while Getting Audit History" }); // Sending error response if any occurs during fetching
  }
};

// Function to handle alterations in audit history records
const alterAuditHistory = async (req, res) => {
  try {
    // Filtering records to identify added/updated and deleted records separately
    const { id } = req.params;
    let updatedRecords = req.body.filter((record) => {
      return record.action === "added/updated";
    });
    let deletedRecords = req.body.filter((record) => {
      return record.action === "delete";
    });

    // Generating update operations for updated records
    const updateRecordOperations = updatedRecords.map((obj) => ({
      updateOne: {
        filter: { _id: obj._id, project_id: id }, // Filtering by ID
        update: { $set: obj }, // Setting new values
        upsert: true, // Creating a new document if it doesn't exist
      },
    }));

    // Generating delete operations for deleted records
    const deleteRecordOperations = deletedRecords.map((obj) => ({
      deleteOne: {
        filter: { _id: obj._id, project_id: id }, // Filtering by ID
        update: { $set: obj }, // Setting deleted document
        upsert: true, // Creating a new document if it doesn't exist
      },
    }));

    // Performing bulk write operation to update and delete records
    const updateRecordResult = await audit_history.bulkWrite(
      updateRecordOperations
    );
    const deleteRecordResult = await audit_history.bulkWrite(
      deleteRecordOperations
    );

    res.status(200).json({ message: "Data updated successfully" }); // Sending success response
  } catch (error) {
    res.status(500).json({ message: "Error while Altering Audit History" }); // Sending error response if any error occurs
  }
};

module.exports = { alterAuditHistory, getAuditHistory };
