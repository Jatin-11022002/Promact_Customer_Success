import React, { useState, useEffect } from "react"; // Importing necessary dependencies from React
import { Box, Flex } from "monday-ui-react-core"; // Importing Box and Flex components from Monday UI React Core library
import Table from "src/components/utility-components/Table"; // Importing custom Table component
import "src/styling/project-escalation-matrix-section.css"; // Importing CSS styles for the component
import axios from "axios"; // Importing Axios for making HTTP requests
import { toast } from "react-toastify"; // Importing toast notifications for displaying messages

// Project_Escalation_Matrix_Section component definition
const Project_Escalation_Matrix_Section = ({ activeTab }) => {
  // State variables to manage component data and behavior
  const [escalationMatrix, setEscalationMatrix] = useState([]); // State for storing escalation matrix data
  const [changedTableRows, setChangedTableRows] = useState([]); // State for storing changed table rows
  const [showSaveButton, setShowSaveButton] = useState(false); // State to control the visibility of the save button

  const [allowedUsers, setAllowedUsers] = useState([]);

  // Retrieve the base URL from environment variables
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  // Extract the current pathname from the URL of the window
  const PATH_NAME = new URL(window.location.href).pathname;

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      // Sending changed table rows data to the server for saving
      const response = await axios.post(
        `${BASE_URL}${PATH_NAME}/escalation-matrix`,
        [...changedTableRows]
      );
      // Displaying success message using toast notification
      toast.success("Data Saved Successfully");
      // Resetting state variables
      setShowSaveButton(false);
      setChangedTableRows([]);
    } catch (error) {
      // Displaying error message using toast notification
      toast.error("Some Error");
    }
  };

  // Function to fetch escalation matrix data from the server
  const fetchData = async () => {
    try {
      // Fetching escalation matrix data from the server
      const response = await fetch(`${BASE_URL}${PATH_NAME}/escalation-matrix`);
      const { data } = await response.json();
      // Setting the fetched escalation matrix data to state variable
      setEscalationMatrix(data);

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
      toast.error("Error while Fetching Escalation Matrix Data");
    }
  };

  // Hook to fetch data when the component mounts
  useEffect(() => {
    if (activeTab != 2) {
      return;
    }
    fetchData();
  }, [activeTab]); // Empty dependency array ensures that this effect runs only once after the component mounts

  // Function to get unique escalation types from the matrix data
  const uniqueTypes = () => {
    const types = new Set();
    escalationMatrix.forEach((element) => {
      types.add(element.escalation_type);
    });
    return types;
  };

  // Render JSX
  return (
    <>
      {/* Render the save button only if showSaveButton state is true */}
      {showSaveButton && (
        <div className="save-button-container">
          <button onClick={handleSubmit} className="save-button">
            Save
          </button>
        </div>
      )}
      {/* Render the Box component containing the escalation matrix table */}
      <Box className="escalation-matrix-table">
        <Flex direction="Column" align="Start" gap={20}>
          {escalationMatrix.length > 0 && (
            <>
              {/* Map through unique escalation types and render a table for each type */}
              {Array.from(uniqueTypes()).map((type) => {
                const filteredData = escalationMatrix.filter(
                  (item) => item.escalation_type === type
                );
                return (
                  <div key={type} className="table-container">
                    <h2 className="table-heading">{type} Escalation Matrix</h2>
                    <Table
                      allowedUsers={allowedUsers}
                      sectionTab={"escalation"} // Identifier for the table section
                      changedTableRows={changedTableRows} // State for changed table rows
                      data={filteredData} // Data to be displayed in the table
                      allowedRoles={["Admin", "Manager"]}
                      invalidColumns={[
                        "_id",
                        "__v",
                        "escalation_type",
                        "project_id",
                      ]} // List of columns to be excluded from the table
                      defaultValues={{
                        escalation_type: type,
                        project_id: filteredData[0].project_id,
                      }} // Default values for the new rows
                      columnType={[]} // Column type configuration
                      setChangedTableRows={setChangedTableRows} // Function to update changed table rows state
                      setShowSaveButton={setShowSaveButton} // Function to control the visibility of the save button
                    />
                  </div>
                );
              })}
            </>
          )}
        </Flex>
      </Box>
    </>
  );
};

export default Project_Escalation_Matrix_Section; // Exporting Project_Escalation_Matrix_Section component
