const risk_profiling = require("../../../Model/risk-profiling.js"); // Importing Risk Profiling model
const { reorderArrayOfObject } = require("../../../Utilities/utility.js"); // Importing utility function for reordering arrays of objects

// Function to fetch risk profiling data
const getRiskProfiling = async (req, res) => {
  try {
    const { id } = req.params;

    // Default structure for risk profiling in case no data is found
    const default_risk_profiling = [
      {
        project_id: id,
        risk_type: "",
        description: "",
        severity: "",
        impact: "",
        remedial_steps: "",
        status: "",
        closure_date: "",
        edited_by: "",
        _id: "",
        __v: "",
      },
    ];

    let data = await risk_profiling.find({ project_id: id }); // Finding risk profiling data from the database

    // Checking if any data is found
    if (data.length == 0) {
      data = default_risk_profiling; // Setting default risk profiling structure if no data found
    } else {
      data = reorderArrayOfObject(data, default_risk_profiling); // Reordering risk profiling data
    }
    res.status(200).json({ data: data }); // Sending success response with fetched data
  } catch (error) {
    res.status(500).json({ message: "Error while Getting Risk Profiling" }); // Sending error response if any occurs during fetching
  }
};

// Function to handle alterations in risk profiling records
const alterRiskProfiling = async (req, res) => {
  try {
    // Filtering records to identify added/updated and deleted records separately
    const { id } = req.params;
    let updatedRecords = req.body.filter((record) => {
      return record.action === "added/updated";
    });
    let deletedRecords = req.body.filter((record) => {
      return record.action === "delete";
    });

    updatedRecords = updatedRecords.map((record) => {
      delete record.action;
      return record;
    });

    deletedRecords = deletedRecords.map((record) => {
      delete record.action;
      return record;
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
    const updateRecordResult = await risk_profiling.bulkWrite(
      updateRecordOperations
    );
    const deleteRecordResult = await risk_profiling.bulkWrite(
      deleteRecordOperations
    );

    res.status(200).json({ message: "Data updated successfully" }); // Sending success response
  } catch (error) {
    res.status(500).json({ message: "Error while Altering Risk Profiling" }); // Sending error response if any error occurs
  }
};

module.exports = { getRiskProfiling, alterRiskProfiling };
