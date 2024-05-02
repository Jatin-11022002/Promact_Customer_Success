import React, { useState, useEffect } from "react"; // Importing React and necessary hooks
import { Box } from "monday-ui-react-core"; // Importing Box component from Monday UI React Core library
import "monday-ui-react-core/tokens"; // Importing tokens for styling
import Table from "src/components/utility-components/Table"; // Importing custom Table component
import axios from "axios"; // Importing Axios for making HTTP requests
import "src/styling/project-risk-profiling-section.css"; // Importing CSS styles for the component
import { toast } from "react-toastify"; // Importing toast notifications for displaying messages

// Project_Risk_Profiling_Section component definition
const Project_Risk_Profiling_Section = ({ activeTab }) => {
  // State variables to manage component data and behavior
  const [riskProfiling, setRiskProfiling] = useState([]); // State to manage risk profiling data
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
      const response = await axios.post(
        `${BASE_URL}${PATH_NAME}/risk-profiling`,
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

  // Function to fetch risk profiling data from the server
  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}${PATH_NAME}/risk-profiling`);
      const { data } = await response.json();
      // Setting fetched risk profiling data to state variable
      setRiskProfiling(data);

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
    if (activeTab != 5) {
      return;
    }
    fetchData();
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
      {/* Container for the table */}
      <Box className="escalation-matrix-table-container">
        {/* Render the Table component if risk profiling data is available */}
        {riskProfiling.length > 0 && (
          <Table
            allowedUsers={allowedUsers}
            // Default values for the table
            defaultValues={{
              project_id: riskProfiling[0].project_id,
            }}
            // Roles allowed to access this table
            allowedRoles={["Admin", "Manager"]}
            // Identifier for the table section
            sectionTab={"risk_profilling"}
            // Function to control the visibility of the save button
            setShowSaveButton={setShowSaveButton}
            // Data to be displayed in the table
            data={riskProfiling}
            // Function to update changed table rows state
            setChangedTableRows={setChangedTableRows}
            // List of columns to be excluded from the table
            invalidColumns={["project_id", "_id", "__v"]}
            // Configuration for column types, e.g., dropdown options and date formatting
            columnType={[
              {
                key: "risk_type",
                type: "dropdown",
                options: [
                  "Financial",
                  "Operational",
                  "Technical",
                  "HR",
                  "External",
                ],
              },
              {
                key: "severity",
                type: "dropdown",
                options: ["High", "Medium", "Low"],
              },
              {
                key: "impact",
                type: "dropdown",
                options: ["High", "Medium", "Low"],
              },
              {
                key: "closure_date",
                type: "date",
              },
            ]}
          />
        )}
      </Box>
    </div>
  );
};

export default Project_Risk_Profiling_Section; // Exporting the component
