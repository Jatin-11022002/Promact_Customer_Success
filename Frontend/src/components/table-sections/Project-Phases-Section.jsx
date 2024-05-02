import React, { useState, useEffect } from "react"; // Importing React and necessary hooks
import { Box } from "monday-ui-react-core"; // Importing Box component from Monday UI React Core library
import Table from "src/components/utility-components/Table"; // Importing custom Table component
import "monday-ui-react-core/tokens"; // Importing tokens for styling
import axios from "axios"; // Importing Axios for making HTTP requests
import "src/styling/project-phases-section.css"; // Importing CSS styles for the component
import { toast } from "react-toastify"; // Importing toast notifications for displaying messages

// Project_Phases_Section component definition
const Project_Phases_Section = ({ activeTab }) => {
  // State variables to manage component data and behavior
  const [phaseHistory, setPhaseHistory] = useState([]); // State to manage phase history data
  const [changedTableRows, setChangedTableRows] = useState([]); // State to manage changed table rows
  const [showSaveButton, setShowSaveButton] = useState(false); // State to control the visibility of the save button
  const [allowedUsers, setAllowedUsers] = useState([]);

  // Retrieve the base URL from environment variables
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  // Extract the current pathname from the URL of the window
  const PATH_NAME = new URL(window.location.href).pathname;

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      // Sending changed table rows to the server for saving
      const response = await axios.post(`${BASE_URL}${PATH_NAME}/phases`, [
        ...changedTableRows,
      ]);
      // Displaying success message using toast notification
      toast.success("Data Saved Successfully");
      setShowSaveButton(false); // Hiding the save button after successful submission
      setChangedTableRows([]); // Clearing the changed table rows
    } catch (error) {
      // Displaying error message using toast notification
      toast.error("Some Error");
    }
  };

  // Function to fetch phase history data from the server
  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}${PATH_NAME}/phases`);
      const { data } = await response.json();
      // Setting fetched phase history data to state variable
      setPhaseHistory(data);

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
    if (activeTab != 3) {
      return;
    }
    fetchData();
  }, [activeTab]); // Empty dependency array ensures that this effect runs only once after the component mounts

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
      {/* Container for the table */}
      <Box className="escalation-matrix-table-container">
        <div className="table-container">
          {/* Render the Table component if phase history data is available */}
          {phaseHistory.length > 0 ? (
            <Table
              allowedUsers={allowedUsers}
              // Default values for the table
              defaultValues={{
                project_id: phaseHistory[0].project_id,
              }}
              // Roles allowed to access this table
              allowedRoles={["Admin", "Manager"]}
              // Identifier for the table section
              sectionTab={"phases"}
              // Function to control the visibility of the save button
              setShowSaveButton={setShowSaveButton}
              // Configuration for column types, e.g., date formatting and dropdown options
              columnType={[
                {
                  key: "start_date",
                  type: "date",
                },
                {
                  key: "completion_date",
                  type: "date",
                },
                {
                  key: "approval_date",
                  type: "date",
                },
                {
                  key: "revised_completion_date",
                  type: "date",
                },
                {
                  key: "status",
                  type: "dropdown",
                  options: ["Delayed", "On-Time", "Pending", "Signed-Off"],
                },
              ]}
              // Data to be displayed in the table
              data={phaseHistory}
              // List of columns to be excluded from the table
              invalidColumns={["project_id", "_id", "__v"]}
              // Function to update changed table rows state
              setChangedTableRows={setChangedTableRows}
            />
          ) : (
            "" // Render nothing if phase history data is not available
          )}
        </div>
      </Box>
    </div>
  );
};

export default Project_Phases_Section; // Exporting the component
