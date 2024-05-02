import React, { useState, useEffect, useContext } from "react"; // Importing React and necessary hooks
import { v4 as uuidv4 } from "uuid"; // Importing UUID library for generating unique IDs
import "src/styling/crud-table.css"; // Importing CSS styles for the CRUD table component
import { toast } from "react-toastify"; // Importing toast notifications library
import "react-toastify/dist/ReactToastify.css"; // Importing CSS for toast notifications
import AuthContext from "src/context/Auth-Provider"; //Importing Context for Authentication

// Table component definition
const Table = ({
  data, // Data to be displayed in the table
  invalidColumns, // Columns to be excluded from the table
  columnType, // Type of each column (e.g., date, dropdown)
  setChangedTableRows, // Function to set changed table rows
  defaultValues = {}, // Default values for inserting into rows
  setShowSaveButton, // Function to toggle save button visibility
  sectionTab, // Current section tab
  allowedRoles = [], //Default Values for allowed roles
  allowedUsers = [],
  unEditableColumn = [],
}) => {
  // State variables for rows and columns of the table
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  //State variable for authentication
  const { auth } = useContext(AuthContext);

  // useEffect hook to initialize table rows and columns when the section tab changes
  useEffect(() => {
    // Extracting valid columns based on the data and invalidColumns prop
    const extractedColumns = Object.keys(data[0]).filter(
      (key) => !invalidColumns.includes(key)
    );
    setColumns(extractedColumns);

    // Mapping data to include unique IDs and setting initial row state
    const newData = data.map((record) => ({
      ...record,
      _id: record._id ? record._id : uuidv4(), // Generating unique ID for each row
      editable: false, // Flag for editing state
    }));
    setRows(newData);
    console.log(unEditableColumn);
  }, [sectionTab]); // Dependency on sectionTab to trigger update when it changes

  // Function to validate input fields in a row
  const handleInputValidation = (id) => {
    const requiredRow = rows.filter((row) => row._id === id)[0];
    for (const column of columns) {
      if (requiredRow[column] === "" && column != "edited_by") {
        return true;
      }
    }
    return false;
  };

  // Function to handle changes in input fields
  const handleChange = (id, key, value) => {
    const updatedRows = rows.map((row) =>
      row._id === id ? { ...row, [key]: value } : row
    );
    setRows(updatedRows);
  };

  // Function to handle editing of a row
  const handleEdit = (id) => {
    const updatedRows = rows.map((row) =>
      row._id === id ? { ...row, editable: true, prevState: { ...row } } : row
    );
    setRows(updatedRows);
  };

  // Function to format column names for display
  const handleColumnName = (column_name) => {
    return column_name.split("_").join(" "); // Replaces underscores with spaces
  };

  // Function to handle saving changes to a row
  const handleSave = (id) => {
    if (handleInputValidation(id)) {
      toast.error("Please Fill All Fields"); // Display error toast if input validation fails
      return;
    }
    const updatedRows = rows.map((row) => {
      if (row._id === id) {
        let changedRow = {
          ...row,
          ...defaultValues,
          action: "added/updated",
          edited_by: auth.user.name,
        };
        delete changedRow["editable"];
        delete changedRow["prevState"];
        setChangedTableRows((prevChangedRows) => [
          ...prevChangedRows,
          changedRow,
        ]); // Adds changed row to the list of changed table rows
        return changedRow;
      }
      return row._id === id ? { ...row, editable: false } : row;
    });

    setShowSaveButton(true); // Show save button after making changes
    setRows(updatedRows); // Update rows state
  };

  // Function to handle canceling edits to a row
  const handleCancel = (id) => {
    const updatedRows = rows.map((row) =>
      row._id === id ? { ...row, editable: false, ...row.prevState } : row
    );
    setRows(updatedRows); // Update rows state
  };

  // Function to handle deleting a row
  const handleDelete = (id) => {
    const updatedRows = rows.filter((row) => {
      if (row._id === id) {
        let changedRow = { ...row, action: "delete" };
        setChangedTableRows((prevChangedRows) => [
          ...prevChangedRows,
          changedRow,
        ]); // Adds changed row to the list of changed table rows
      }

      return row._id !== id;
    });
    setShowSaveButton(true); // Show save button after making changes
    setRows(updatedRows); // Update rows state
  };

  // Function to handle adding a new row
  const handleAddRow = () => {
    const newRow = {};
    columns.forEach((column) => (newRow[column] = ""));
    newRow["edited_by"] = auth.user.name;
    const newId = uuidv4(); // Generate unique ID for the new row
    setRows([...rows, { ...newRow, _id: newId, editable: true }]);
  };

  // Function to render input fields based on column type
  const renderInputField = (column_key, row) => {
    const {
      type,
      options,
      value = row[column_key],
    } = columnType.find((item) => item.key === column_key) || {};
    switch (type) {
      case "date":
        return (
          <input
            type="date"
            value={row[column_key]}
            onChange={(e) => handleChange(row._id, column_key, e.target.value)}
          />
        );
      case "dropdown":
        return (
          <select
            value={row[column_key]}
            onChange={(e) => handleChange(row._id, column_key, e.target.value)}
          >
            {options.map((option) => (
              <option key={option.value} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(row._id, column_key, e.target.value)}
          />
        );
    }
  };

  // JSX for rendering the CRUD table
  return (
    <div className="crud-table-container">
      <table className="crud-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} rowSpan={2}>
                {handleColumnName(column)}
              </th>
            ))}
            {(allowedRoles.includes(auth.role) ||
              allowedUsers.includes(auth.id)) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id}>
              {columns.map((column, cellIndex) => (
                <td key={cellIndex}>
                  {row.editable && !unEditableColumn.includes(column)
                    ? renderInputField(column, row)
                    : row[column]}
                </td>
              ))}
              {(allowedRoles.includes(auth.role) ||
                allowedUsers.includes(auth.id)) && (
                <td>
                  {row.editable ? (
                    <div className="action-cell">
                      <button onClick={() => handleSave(row._id)}>
                        <i className="fas fa-save"></i>
                      </button>
                      <button onClick={() => handleCancel(row._id)}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="action-cell">
                      <button onClick={() => handleEdit(row._id)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(row._id)}>
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
        {(allowedRoles.includes(auth.role) ||
          allowedUsers.includes(auth.id)) && (
          <tfoot>
            <tr>
              <td colSpan={columns.length + 1}>
                <button onClick={handleAddRow}>
                  <i className="fas fa-plus"></i> Add Row
                </button>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default Table; // Exporting the Table component
