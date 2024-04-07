import React, { useState, useEffect } from "react"; // Importing React and necessary hooks
import { Box } from "monday-ui-react-core"; // Importing Box component from Monday UI React Core library
import "monday-ui-react-core/tokens"; // Importing tokens for styling
import Table from "../utility_components/Table"; // Importing custom Table component
import axios from "axios"; // Importing Axios for making HTTP requests
import "../../styling/project_stakeholder_section.css"; // Importing CSS styles for the component
import { toast } from "react-toastify"; // Importing toast notifications for displaying messages

// Project_Stakeholder_Section component definition
const Project_Stakeholder_Section = ({ activeTab }) => {
  // State variables to manage component data and behavior
  const [stakeholders, setStakeholders] = useState([]); // State to manage stakeholders data
  const [changedTableRows, setChangedTableRows] = useState([]); // State to track changed table rows
  const [showSaveButton, setShowSaveButton] = useState(false); // State to control visibility of save button

  // Retrieve the base URL from environment variables
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  // Extract the current pathname from the URL of the window
  const PATH_NAME = new URL(window.location.href).pathname;

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      // Sending changed table rows to the server for saving
      const response = await axios.post(
        `${BASE_URL}${PATH_NAME}/stakeholders`,
        [...changedTableRows]
      );
      // Displaying success message using toast notification
      toast.success("Data Saved Successfully");
      setShowSaveButton(false); // Hiding the save button after successful submission
      setChangedTableRows([]); // Clearing the changed table rows
    } catch (error) {
      // Displaying error message using toast notification
      toast.error("Some Error");
    }
  };

  // Function to fetch stakeholders data from the server
  const fetchData = async () => {
    try {
      // Making a GET request to fetch stakeholders data
      const response = await fetch(`${BASE_URL}${PATH_NAME}/stakeholders`);
      const { data } = await response.json(); // Parsing response JSON
      // Setting fetched stakeholders data to state variable
      setStakeholders(data);
    } catch (error) {
      // Displaying error message using toast notification
      toast.error("Some Error");
    }
  };

  // Hook to fetch data when the component mounts
  useEffect(() => {
    if (activeTab != 6) {
      return;
    }
    fetchData(); // Calling the fetchData function
  }, [activeTab]);

  // Render JSX
  return (
    <div>
      {/* Render the save button only if changes have been made */}
      {showSaveButton && (
        <div className="save-button-container">
          <button onClick={handleSubmit} className="save-button">
            Save
          </button>
        </div>
      )}
      {/* Container for stakeholders table */}
      <Box className="escalation-matrix-table-container">
        {/* Render the Table component if stakeholders data is available */}
        {stakeholders.length > 0 && (
          <Table
            // Default values for the table
            defaultValues={{
              project_id: stakeholders[0].project_id,
            }}
            // Roles allowed to access this table
            allowedRoles={["Admin", "Auditor"]}
            // Identifier for the table section
            sectionTab={"stakeholder"}
            // Function to control the visibility of the save button
            setShowSaveButton={setShowSaveButton}
            // Function to update changed table rows state
            setChangedTableRows={setChangedTableRows}
            // Data to be displayed in the table
            data={stakeholders}
            // List of columns to be excluded from the table
            invalidColumns={["project_id", "_id", "__v"]}
            // Configuration for column types, e.g., date formatting or dropdown options
            columnType={[]}
          />
        )}
      </Box>
    </div>
  );
};

export default Project_Stakeholder_Section; // Exporting the component
