import React, { useState, useEffect } from "react"; // Importing React and necessary hooks
import { Box } from "monday-ui-react-core"; // Importing Box component from Monday UI React Core library
import "monday-ui-react-core/tokens"; // Importing tokens for styling
import Table from "src/components/utility-components/Table"; // Importing custom Table component
import axios from "axios"; // Importing Axios for making HTTP requests
import { toast } from "react-toastify"; // Importing toast notifications for displaying messages
import "src/styling/project-sprint-details-section.css"; // Importing CSS styles for the component

// Project_Sprint_Details_Section component definition
const Project_Sprint_Details_Section = ({ activeTab }) => {
  // State variables to manage component data and behavior
  const [sprintDetails, setSprintDetails] = useState([]); // State to manage sprint details
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
        `${BASE_URL}${PATH_NAME}/sprint-details`,
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

  // Function to fetch sprint details from the server
  const fetchData = async () => {
    try {
      // Making a GET request to fetch sprint details
      const response = await fetch(`${BASE_URL}${PATH_NAME}/sprint-details`);
      const { data } = await response.json(); // Parsing response JSON
      // Setting fetched sprint details to state variable
      setSprintDetails(data);
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
    if (activeTab != 4) {
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
      {/* Container for sprint details table */}
      <Box className="escalation-matrix-table-container">
        {/* Render the Table component if sprint details are available */}
        {sprintDetails.length > 0 && (
          <Table
            allowedUsers={allowedUsers}
            // Default values for the table
            defaultValues={{
              project_id: sprintDetails[0].project_id,
            }}
            // Roles allowed to access this table
            allowedRoles={["Admin", "Manager"]}
            // Identifier for the table section
            sectionTab={"sprint_details"}
            // Function to control the visibility of the save button
            setShowSaveButton={setShowSaveButton}
            // Function to update changed table rows state
            setChangedTableRows={setChangedTableRows}
            // Data to be displayed in the table
            data={sprintDetails}
            // List of columns to be excluded from the table
            invalidColumns={["project_id", "_id", "__v"]}
            // Configuration for column types, e.g., dropdown options and date formatting
            columnType={[
              // Date type column
              { key: "start_date", type: "date" },
              // Date type column
              { key: "end_date", type: "date" },
              // Dropdown type column with specified options
              {
                key: "status",
                type: "dropdown",
                options: ["Delayed", "On-Time", "Pending", "Signed-Off"],
              },
            ]}
          />
        )}
      </Box>
    </div>
  );
};

export default Project_Sprint_Details_Section; // Exporting the component
