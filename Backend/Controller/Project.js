const project = require("../Model/Project");
const audit_history = require("../Model/Audit_History");
const version_history = require("../Model/Version_History");
const sprint_details = require("../Model/Sprint_Details");
const stakeholders = require("../Model/Stakeholders");
const phases = require("../Model/Phases");
const escalation_matrix = require("../Model/Escalation_Matrix");
const risk_profiling = require("../Model/Risk_Profiling");
const { reorderArrayOfObject } = require("../Utilities/utility.js");

const getProjectDetails = async (req, res) => {
  try {
    let response = await project.find();
    res.json({ status: "success", data: response });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", msg: error });
  }
};

const getVersionHistory = async (req, res) => {
  try {
    const default_version_history = [
      {
        project_id: "",
        version: "",
        type: "",
        change: "",
        change_reason: "",
        created_by: "",
        revision_date: "",
        approval_date: "",
        approved_by: "",
        _id: "",
        __v: "",
      },
    ];

    let data = await version_history.find();

    if (data.length === 0) {
      data = default_version_history;
    } else {
      data = reorderArrayOfObject(data, default_version_history);
    }

    console.log(data);
    res.json({ status: "success", data: data });
  } catch (error) {
    res.json({ status: "error", msg: error });
  }
};

const getAuditHistory = async (req, res) => {
  try {
    const default_audit_history = [
      {
        project_id: "",
        date_of_audit: "",
        reviewed_by: "",
        status: "",
        reviewed_section: "",
        comment: "",
        action_item: "",
        _id: "",
        __v: "",
      },
    ];

    let data = await audit_history.find();
    if (data.length == 0) {
      data = default_audit_history;
    } else {
      data = reorderArrayOfObject(data, default_audit_history);
    }
    res.json({ status: "success", data: data });
  } catch (error) {
    res.json({ status: "error", msg: error });
  }
};

const getStakeholders = async (req, res) => {
  try {
    const default_stakeholders = [
      {
        project_id: "",
        title: "",
        name: "",
        contact: "",
        _id: "",
        __v: "",
      },
    ];

    let data = await stakeholders.find();

    if (data.length == 0) {
      data = default_stakeholders;
    } else {
      data = reorderArrayOfObject(data, default_stakeholders);
    }
    res.json({ status: "success", data: data });
  } catch (error) {
    res.json({ status: "error", msg: error });
  }
};

const getEscalationMatrix = async (req, res) => {
  try {
    const default_escalation_matrix = [
      {
        level: "",
        escalation_type: "",
        member: "",
        designation: "",
        _id: "",
        __v: "",
      },
    ];
    //console.log("in get escalation matrix");
    let data = await escalation_matrix.find();
    if (data.length == 0) {
      data = default_escalation_matrix;
    } else {
      data = reorderArrayOfObject(data, default_escalation_matrix);
    }
    console.log(data);
    res.json({ status: "success", data: data });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", msg: error });
  }
};

const getRiskProfiling = async (req, res) => {
  try {
    const default_risk_profiling = [
      {
        project_id: "",
        risk_type: "",
        description: "",
        severity: "",
        impact: "",
        remedial_steps: "",
        status: "",
        closure_date: "",
        _id: "",
        __v: "",
      },
    ];

    let data = await risk_profiling.find();

    if (data.length == 0) {
      data = default_risk_profiling;
    } else {
      data = reorderArrayOfObject(data, default_risk_profiling);
    }
    res.json({ status: "success", data: data });
  } catch (error) {
    res.json({ status: "error", msg: error });
  }
};

const getPhases = async (req, res) => {
  try {
    const defaultPhase = [
      {
        project_id: "",
        title: "",
        start_date: "",
        completion_date: "",
        approval_date: "",
        status: "",
        revised_completion_date: "",
        comments: "",
        _id: "",
        __v: "",
      },
    ];
    console.log("here");
    let data = await phases.find();
    console.log(data);

    if (data.length == 0) {
      data = defaultPhase;
    } else {
      data = reorderArrayOfObject(data, defaultPhase);
    }
    res.json({ status: "success", data: data });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", msg: error });
  }
};

const getSprintDetails = async (req, res) => {
  try {
    const default_sprint_details = [
      {
        project_id: "",
        sprint: "",
        start_date: "",
        end_date: "",
        status: "",
        comments: "",
        _id: "",
        __v: "",
      },
    ];
    let data = await sprint_details.find();

    if (data.length == 0) {
      data = default_sprint_details;
    } else {
      data = reorderArrayOfObject(data, default_sprint_details);
    }

    res.json({ status: "success", data: data });
  } catch (error) {
    res.json({ status: "error", msg: error });
  }
};

const alterProjectDetails = async (req, res) => {
  try {
    console.log("here is the body", req.body);
    const { projectDetails } = req.body;
    let response = await project.updateOne(
      { _id: projectDetails._id },
      { $set: projectDetails }
    );

    console.log("updated");

    res.json({ status: "success", msg: "details updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ msg: "some error" });
  }
};

const alterVersionHistory = async (req, res) => {
  try {
    const updatedRecords = req.body.filter((record) => {
      return record.action === "added/updated";
    });
    const deletedRecords = req.body.filter((record) => {
      return record.action === "delete";
    });

    //console.log(updatedRecords, deletedRecords);

    const updateRecordOperations = updatedRecords.map((obj) => ({
      updateOne: {
        filter: { _id: obj._id },
        update: { $set: obj },
        upsert: true,
      },
    }));

    const deleteRecordOperations = deletedRecords.map((obj) => ({
      deleteOne: {
        filter: { _id: obj._id },
        update: { $set: obj },
        upsert: true,
      },
    }));

    const updateRecordResult = await version_history.bulkWrite(
      updateRecordOperations
    );
    const deleteRecordResult = await version_history.bulkWrite(
      deleteRecordOperations
    );
    res.json({ status: "success", msg: "Data updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", msg: error });
  }
};

const alterAuditHistory = async (req, res) => {
  try {
    const updatedRecords = req.body.filter((record) => {
      return record.action === "added/updated";
    });
    const deletedRecords = req.body.filter((record) => {
      return record.action === "delete";
    });

    //console.log(updatedRecords, deletedRecords);

    const updateRecordOperations = updatedRecords.map((obj) => ({
      updateOne: {
        filter: { _id: obj._id },
        update: { $set: obj },
        upsert: true,
      },
    }));

    const deleteRecordOperations = deletedRecords.map((obj) => ({
      deleteOne: {
        filter: { _id: obj._id },
        update: { $set: obj },
        upsert: true,
      },
    }));

    const updateRecordResult = await audit_history.bulkWrite(
      updateRecordOperations
    );
    const deleteRecordResult = await audit_history.bulkWrite(
      deleteRecordOperations
    );
    res.json({ status: "success", msg: "Data updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", msg: error });
  }
};

const alterStakeholders = async (req, res) => {
  try {
    //console.log("here", req.body);
    const updatedRecords = req.body.filter((record) => {
      return record.action === "added/updated";
    });
    const deletedRecords = req.body.filter((record) => {
      return record.action === "delete";
    });

    //console.log(updatedRecords, deletedRecords);

    const updateRecordOperations = updatedRecords.map((obj) => ({
      updateOne: {
        filter: { _id: obj._id },
        update: { $set: obj },
        upsert: true,
      },
    }));

    const deleteRecordOperations = deletedRecords.map((obj) => ({
      deleteOne: {
        filter: { _id: obj._id },
        update: { $set: obj },
        upsert: true,
      },
    }));

    const updateRecordResult = await stakeholders.bulkWrite(
      updateRecordOperations
    );
    const deleteRecordResult = await stakeholders.bulkWrite(
      deleteRecordOperations
    );

    //console.log(updateRecordResult, deleteRecordResult);
    res.json({ status: "success", msg: "Data updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", msg: error });
  }
};

const alterEscalationMatrix = async (req, res) => {
  try {
    console.log("here", req.body);
    const updatedRecords = req.body.filter((record) => {
      return record.action === "added/updated";
    });
    const deletedRecords = req.body.filter((record) => {
      return record.action === "delete";
    });

    //console.log(updatedRecords, deletedRecords);

    const updateRecordOperations = updatedRecords.map((obj) => ({
      updateOne: {
        filter: { _id: obj._id },
        update: { $set: obj },
        upsert: true,
      },
    }));

    const deleteRecordOperations = deletedRecords.map((obj) => ({
      deleteOne: {
        filter: { _id: obj._id },
        update: { $set: obj },
        upsert: true,
      },
    }));

    const updateRecordResult = await escalation_matrix.bulkWrite(
      updateRecordOperations
    );
    const deleteRecordResult = await escalation_matrix.bulkWrite(
      deleteRecordOperations
    );
    res.json({ status: "success", msg: "Data updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", msg: error });
  }
};

const alterRiskProfiling = async (req, res) => {
  try {
    const updatedRecords = req.body.filter((record) => {
      return record.action === "added/updated";
    });
    const deletedRecords = req.body.filter((record) => {
      return record.action === "delete";
    });

    //console.log(updatedRecords, deletedRecords);

    const updateRecordOperations = updatedRecords.map((obj) => ({
      updateOne: {
        filter: { _id: obj._id },
        update: { $set: obj },
        upsert: true,
      },
    }));

    const deleteRecordOperations = deletedRecords.map((obj) => ({
      deleteOne: {
        filter: { _id: obj._id },
        update: { $set: obj },
        upsert: true,
      },
    }));

    const updateRecordResult = await risk_profiling.bulkWrite(
      updateRecordOperations
    );
    const deleteRecordResult = await risk_profiling.bulkWrite(
      deleteRecordOperations
    );
    res.json({ status: "success", msg: "Data updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", msg: error });
  }
};

const alterPhases = async (req, res) => {
  try {
    const updatedRecords = req.body.filter((record) => {
      return record.action === "added/updated";
    });
    const deletedRecords = req.body.filter((record) => {
      return record.action === "delete";
    });

    //console.log(updatedRecords, deletedRecords);

    const updateRecordOperations = updatedRecords.map((obj) => ({
      updateOne: {
        filter: { _id: obj._id },
        update: { $set: obj },
        upsert: true,
      },
    }));

    const deleteRecordOperations = deletedRecords.map((obj) => ({
      deleteOne: {
        filter: { _id: obj._id },
        update: { $set: obj },
        upsert: true,
      },
    }));

    const updateRecordResult = await risk_profiling.bulkWrite(
      updateRecordOperations
    );
    const deleteRecordResult = await risk_profiling.bulkWrite(
      deleteRecordOperations
    );
    res.json({ status: "success", msg: "Data updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", msg: error });
  }
};

const alterSprintDetails = async (req, res) => {
  try {
    const updatedRecords = req.body.filter((record) => {
      return record.action === "added/updated";
    });
    const deletedRecords = req.body.filter((record) => {
      return record.action === "delete";
    });

    //console.log(updatedRecords, deletedRecords);

    const updateRecordOperations = updatedRecords.map((obj) => ({
      updateOne: {
        filter: { _id: obj._id },
        update: { $set: obj },
        upsert: true,
      },
    }));

    const deleteRecordOperations = deletedRecords.map((obj) => ({
      deleteOne: {
        filter: { _id: obj._id },
        update: { $set: obj },
        upsert: true,
      },
    }));

    const updateRecordResult = await sprint_details.bulkWrite(
      updateRecordOperations
    );
    const deleteRecordResult = await sprint_details.bulkWrite(
      deleteRecordOperations
    );
    res.json({ status: "success", msg: "Data updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", msg: error });
  }
};

module.exports = {
  getProjectDetails,
  getVersionHistory,
  getAuditHistory,
  getSprintDetails,
  getPhases,
  getRiskProfiling,
  getEscalationMatrix,
  getStakeholders,
  alterProjectDetails,
  alterVersionHistory,
  alterAuditHistory,
  alterSprintDetails,
  alterPhases,
  alterRiskProfiling,
  alterEscalationMatrix,
  alterStakeholders,
};
