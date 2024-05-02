import React, { useState, useEffect } from "react"; // Importing React and necessary hooks
import { Box } from "monday-ui-react-core"; // Importing Box component from Monday UI React Core library
import "monday-ui-react-core/tokens"; // Importing tokens for styling
import Table from "src/components/utility-components/Table"; // Importing custom Table component
import axios from "axios"; // Importing Axios for making HTTP requests
import "src/styling/project-stakeholder-section.css"; // Importing CSS styles for the component
import { toast } from "react-toastify"; // Importing toast notifications for displaying messages

const Project_Client_Feedback_Section = ({ activeTab }) => {
  const [clientFeedback, setClientFeedback] = useState([]); // State to manage stakeholders data
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
        `${BASE_URL}${PATH_NAME}/client-feedback`,
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
      const response = await fetch(`${BASE_URL}${PATH_NAME}/client-feedback`);
      const { data } = await response.json(); // Parsing response JSON
      // Setting fetched stakeholders data to state variable
      setClientFeedback(data);

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
    if (activeTab != 12) {
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
        {clientFeedback.length > 0 && (
          <Table
            allowedUsers={allowedUsers}
            defaultValues={{
              project_id: clientFeedback[0].project_id,
            }}
            allowedRoles={["Admin", "Manager"]}
            sectionTab={"client_feedback"} // Passing section tab as prop
            setShowSaveButton={setShowSaveButton} // Passing setShowSaveButton function as prop
            setChangedTableRows={setChangedTableRows} // Passing setChangedTableRows function as prop
            data={clientFeedback} // Passing stakeholders data as prop
            invalidColumns={["project_id", "_id", "__v"]} // Specifying invalid columns for table
            columnType={[
              // Specifying column types for table
              {
                key: "date_received",
                type: "date",
              },
              {
                key: "closure_date",
                type: "date",
              },
              {
                key: "feedback_type",
                type: "dropdown",
                options: ["Complaint", "Appreciation"],
              },
            ]} // Specifying column types for table
          />
        )}
      </Box>
    </div>
  );
};

export default Project_Client_Feedback_Section;
