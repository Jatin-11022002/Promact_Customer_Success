import React, { useState, useEffect } from "react"; // Importing React and necessary hooks
import { Box } from "monday-ui-react-core"; // Importing Box component from Monday UI React Core library
import "monday-ui-react-core/tokens"; // Importing tokens for styling
import Table from "src/components/utility-components/Table"; // Importing custom Table component
import axios from "axios"; // Importing Axios for making HTTP requests
import "src/styling/project-version-history-section.css"; // Importing CSS styles for the component
import { toast } from "react-toastify"; // Importing toast notifications for displaying messages

// Project_Version_History_Section component definition
const Project_Version_History_Section = ({ activeTab }) => {
  // State variables to manage component data and behavior
  const [versionHistory, setVersionHistory] = useState([]); // State to manage version history data
  const [changedTableRows, setChangedTableRows] = useState([]); // State to track changed table rows
  const [showSaveButton, setShowSaveButton] = useState(false); // State to control visibility of save button
  const [allowedUsers, setAllowedUsers] = useState([]);

  // Retrieve the base URL from environment variables
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  // Extract the current pathname from the URL of the window
  const PATH_NAME = new URL(window.location.href).pathname;

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      // Sending changed table rows to the server for saving
      const response = await axios.post(
        `${BASE_URL}${PATH_NAME}/version-history`,
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

  // Function to fetch version history data from the server
  const fetchData = async () => {
    try {
      // Making a GET request to fetch version history data
      const response = await fetch(`${BASE_URL}${PATH_NAME}/version-history`);
      const { data } = await response.json(); // Parsing response JSON
      // Setting fetched version history data to state variable
      setVersionHistory(data);

      const project_id = PATH_NAME.split("/")[2];
      const allowedUsersResponse = await axios.get(
        `${BASE_URL}/project-edit-request/${project_id}`
      );
      let { data: users } = allowedUsersResponse;
      users = users.data;
      users = users.filter((user) => user.admin_approval == "approved");

      setAllowedUsers(() => {
        return users.map((user) => {
          return user.user_id;
        });
      });
    } catch (error) {
      // Displaying error message using toast notification
      toast.error("Some Error");
    }
  };

  // Hook to fetch data when the component mounts
  useEffect(() => {
    if (activeTab != 7) {
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
      {/* Container for version history table */}
      <Box className="escalation-matrix-table-container">
        {/* Render the Table component if version history data is available */}
        {versionHistory.length > 0 && (
          <Table
            allowedUsers={allowedUsers}
            // Default values for the table
            defaultValues={{
              project_id: versionHistory[0].project_id,
            }}
            // Roles allowed to access this table
            allowedRoles={["Admin", "Manager"]}
            // Identifier for the table section
            sectionTab={"version_history"}
            // Function to control the visibility of the save button
            setShowSaveButton={setShowSaveButton}
            // Function to update changed table rows state
            setChangedTableRows={setChangedTableRows}
            // Data to be displayed in the table
            data={versionHistory}
            // List of columns to be excluded from the table
            invalidColumns={["project_id", "_id", "__v"]}
            // Configuration for column types, e.g., date formatting
            columnType={[
              { key: "revision_date", type: "date" },
              { key: "approval_date", type: "date" },
            ]}
          />
        )}
      </Box>
    </div>
  );
};

export default Project_Version_History_Section; // Exporting the component
