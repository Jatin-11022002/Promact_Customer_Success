import React, { useState, useEffect } from "react"; // Importing React and necessary hooks
import { Box } from "monday-ui-react-core"; // Importing Box component from Monday UI React Core library
import "monday-ui-react-core/tokens"; // Importing tokens for styling
import Table from "src/components/utility-components/Table"; // Importing custom Table component
import axios from "axios"; // Importing Axios for making HTTP requests
import "src/styling/project-approved-teams-section.css"; // Importing CSS styles for the component
import { toast } from "react-toastify"; // Importing toast notifications for displaying messages

const Project_Approved_Teams_Section = ({ activeTab }) => {
  // State variable to store the approved teams data
  const [approvedTeams, setApprovedTeams] = useState([]);
  // State variable to store the changed table rows
  const [changedTableRows, setChangedTableRows] = useState([]);
  // State variable to control the visibility of the save button
  const [showSaveButton, setShowSaveButton] = useState(false);
  // State variable to store the categories for filtering
  const [categories, setCategories] = useState([]);
  // State variable to manage the active accordion section
  const [activeAccordion, setActiveAccordion] = useState([]);
  const [allowedUsers, setAllowedUsers] = useState([]);

  // Constant storing the base URL obtained from environment variables
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  // Constant storing the current pathname extracted from the window's URL
  const PATH_NAME = new URL(window.location.href).pathname;

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      // Sending POST request to save changed table rows
      const response = await axios.post(
        `${BASE_URL}${PATH_NAME}/approved-teams`,
        [...changedTableRows]
      );
      // Displaying success message using toast notification
      toast.success("Data Saved Successfully");
      // Hiding the save button after successful submission
      setShowSaveButton(false);
      // Clearing the changed table rows
      setChangedTableRows([]);
    } catch (error) {
      // Displaying error message using toast notification
      toast.error("Some Error");
    }
  };

  // Function to filter categories from approved teams data
  const filterCategories = () => {
    const uniqueCategories = new Set();
    approvedTeams.forEach((row) => {
      uniqueCategories.add(row.category);
    });
    // Setting the filtered categories
    setCategories(Array.from(uniqueCategories));
  };

  // Effect hook to filter categories when approvedTeams state changes
  useEffect(() => {
    filterCategories();
  }, [approvedTeams]);

  // Function to fetch data from server
  const fetchData = async () => {
    try {
      // Fetching approved teams data from server
      const response = await fetch(`${BASE_URL}${PATH_NAME}/approved-teams`);
      // Parsing response JSON
      const { data } = await response.json();
      // Setting approved teams data
      setApprovedTeams(data);
      console.log(data);

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

  // Effect hook to fetch data when the component mounts
  useEffect(() => {
    if (activeTab != 11) {
      return;
    }
    // Calling the fetchData function
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
      {/* Container for displaying approved teams in accordion */}
      <Box className="escalation-matrix-table-container">
        <div>
          {categories.length > 0 &&
            // Mapping over categories to render accordion sections
            categories.map((category, index) => (
              <div key={index} className="approved_team_accordian">
                {/* Accordion header */}
                <div
                  className="accordion-header"
                  onClick={() =>
                    setActiveAccordion(activeAccordion === index ? null : index)
                  }
                >
                  {category}
                  {/* Toggle arrow icon based on active accordion */}
                  {activeAccordion === index ? (
                    <i className="fas fa-angle-up"></i>
                  ) : (
                    <i className="fas fa-angle-down"></i>
                  )}
                </div>
                {/* Accordion content */}
                {activeAccordion === index && (
                  <div
                    className={`accordion-content ${
                      activeAccordion === index ? "active" : ""
                    }`}
                  >
                    {/* Render Table component */}
                    <Table
                      allowedUsers={allowedUsers}
                      sectionTab={category} // Pass category as section tab
                      defaultValues={{
                        project_id: approvedTeams[0].project_id,
                      }}
                      allowedRoles={["Admin", "Manager"]}
                      setShowSaveButton={setShowSaveButton}
                      setChangedTableRows={setChangedTableRows}
                      // Filter data based on category
                      data={approvedTeams.filter(
                        (team) => team.category === category
                      )}
                      invalidColumns={["project_id", "_id", "__v"]}
                      columnType={[]}
                    />
                  </div>
                )}
              </div>
            ))}
        </div>
      </Box>
    </div>
  );
};

export default Project_Approved_Teams_Section;
