import React, { useState, useEffect } from "react"; // Importing React and necessary hooks
import { Box } from "monday-ui-react-core"; // Importing Box component from Monday UI React Core library
import "monday-ui-react-core/tokens"; // Importing tokens for styling
import Table from "./Table"; // Importing custom Table component
import axios from "axios"; // Importing Axios for making HTTP requests
import "../styling/project_stakeholder_section.css"; // Importing CSS styles for the component
import { toast } from "react-toastify"; // Importing toast notifications for displaying messages

const Project_Project_Updates_Section = () => {
  const [projectUpdates, setProjectUpdates] = useState([]); // State to manage stakeholders data
  const [changedTableRows, setChangedTableRows] = useState([]); // State to track changed table rows
  const [showSaveButton, setShowSaveButton] = useState(false); // State to control visibility of save button
  const [allowedUsers, setAllowedUsers] = useState([]);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const PATH_NAME = new URL(window.location.href).pathname;

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      // Sending changed table rows to the server for saving
      const response = await axios.post(
        `${BASE_URL}${PATH_NAME}/project_updates`,
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
      const response = await fetch(`${BASE_URL}${PATH_NAME}/project_updates`);
      const { data } = await response.json(); // Parsing response JSON
      // Setting fetched stakeholders data to state variable
      setProjectUpdates(data);

      const project_id = PATH_NAME.split("/")[2];
      const allowedUsersResponse = await axios.get(
        `${BASE_URL}/project-edit-request/${project_id}`
      );
      let { data: users } = allowedUsersResponse;
      users = users.data;
      users = users.filter((user) => user.status == "approved");

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
    fetchData(); // Calling the fetchData function
  }, []);

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
        {projectUpdates.length > 0 && (
          <Table
            allowedUsers={allowedUsers}
            defaultValues={{
              project_id: projectUpdates[0].project_id,
            }}
            allowedRoles={["Admin", "Manager"]}
            columnType={[
              // Specifying column types for table
              {
                key: "date",
                type: "date",
              },
            ]}
            sectionTab={"project_updates"} // Passing section tab as prop
            setShowSaveButton={setShowSaveButton} // Passing setShowSaveButton function as prop
            setChangedTableRows={setChangedTableRows} // Passing setChangedTableRows function as prop
            data={projectUpdates} // Passing stakeholders data as prop
            invalidColumns={["project_id", "_id", "__v"]} // Specifying invalid columns for table
            // Specifying column types for table
          />
        )}
      </Box>
    </div>
  );
};

export default Project_Project_Updates_Section;
