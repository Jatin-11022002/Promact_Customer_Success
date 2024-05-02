import React, { useEffect, useState, useContext } from "react"; // Importing necessary dependencies from React
import { Dropdown } from "monday-ui-react-core"; // Importing Dropdown component from Monday UI React Core library
import "monday-ui-react-core/tokens"; // Importing tokens for styling
import "src/styling/project-overview-section.css"; // Importing CSS styles for the component
import axios from "axios"; // Importing Axios for making HTTP requests
import { toast } from "react-toastify"; // Importing toast notifications for displaying messages
import AuthContext from "src/context/Auth-Provider";

// Project_Overview_Section component definition
const Project_Overview_Section = ({ activeTab }) => {
  // State variables to manage component data and behavior
  const [changesMade, setChangesMade] = useState(false); // State to track if changes have been made
  const [projectDetails, setProjectDetails] = useState({
    overview: "",
    budget: {},
    timeline: "",
  });
  const [allowedUsers, setAllowedUsers] = useState([]);

  const { auth } = useContext(AuthContext);
  const allowed_roles = ["Admin", "Manager"];
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const PATH_NAME = new URL(window.location.href).pathname;

  // Function to validate input field
  const handleInputFieldValidation = () => {
    const columns = ["overview", "budget", "timeline"];
    for (const column of columns) {
      if (projectDetails[column] === "") {
        return true;
      }
    }
    return false;
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      if (handleInputFieldValidation()) {
        toast.error("Please Fill All Fields"); // Display error message if input fields are empty
        return;
      }
      // Sending project details to the server for saving
      const { data } = await axios.post(
        `${BASE_URL}${PATH_NAME}/project-details`,
        {
          projectDetails,
        }
      );
      // Displaying success message using toast notification
      toast.success("Data Saved Successfully");
      setChangesMade(false); // Resetting changesMade state after successful submission
    } catch (error) {
      // Displaying error message using toast notification
      toast.error("Error while Saving Data");
    }
  };

  // Function to handle input change
  const handleInputChange = (e, field) => {
    const newProjectDetails = { ...projectDetails }; // Creating a copy of projectDetails object
    // Handling budget type input separately
    if (field === "Fixed" || field === "Monthly") {
      newProjectDetails["budget"] = {
        type: field,
        type_value: e.target.value,
      };
    } else {
      newProjectDetails[field] = e.target.value; // Updating projectDetails object with new value
    }
    setProjectDetails(newProjectDetails); // Updating projectDetails state with new object
    setChangesMade(true); // Indicating that changes have been made
  };

  // Function to fetch project details from the server
  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}${PATH_NAME}/project-details`);

      const { data } = await response.json();
      // Setting fetched project details to state variable
      setProjectDetails(data[0]);

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
    if (activeTab != 0) {
      return;
    }
    fetchData();
  }, [activeTab]); // Empty dependency array ensures that this effect runs only once after the component mounts

  // Render JSX
  return (
    <>
      {/* Render the save button only if changes have been made */}
      {changesMade && (
        <div className="save-button-container">
          <button onClick={handleSubmit} className="save-button">
            Save
          </button>
        </div>
      )}
      <div className="overview-section-wrapper">
        {/* Input fields for project overview, budget, and timeline */}
        <div className="overview-div">
          <label>Project Overview</label>
          {/* Textarea for project overview input */}
          <textarea
            value={projectDetails?.overview}
            onChange={(e) => handleInputChange(e, "overview")}
            readOnly={
              allowed_roles.includes(auth.role) ||
              allowedUsers.includes(auth.id)
                ? false
                : true
            }
          ></textarea>
        </div>
        <div className="budget-div">
          {/* Dropdown for selecting budget type */}
          <div className="dropdown-div">
            <label>Project Budget</label>
            <Dropdown
              readOnly={
                allowed_roles.includes(auth.role) ||
                allowedUsers.includes(auth.id)
                  ? false
                  : true
              }
              className="dropdown"
              value={[
                {
                  value: projectDetails?.budget?.type,
                  label: projectDetails?.budget?.type,
                },
              ]}
              searchable={false}
              onChange={(budgetMode) => {
                const budget = {
                  type: budgetMode?.label,
                  type_value: "",
                };
                setProjectDetails({ ...projectDetails, budget: budget });
                setChangesMade(true);
              }}
              options={[
                { label: "Fixed", value: "Fixed" },
                { label: "Monthly", value: "Monthly" },
              ]}
            />
          </div>
          {/* Conditional rendering of input field based on selected budget type */}
          <div className="dropdown-input-div">
            {projectDetails?.budget.type &&
              (projectDetails.budget.type === "Fixed" ? (
                <>
                  <label>Duration (in Months)</label>
                  {/* Input field for entering duration */}
                  <input
                    readOnly={
                      allowed_roles.includes(auth.role) ||
                      allowedUsers.includes(auth.id)
                        ? false
                        : true
                    }
                    type="text"
                    onChange={(e) => handleInputChange(e, "Fixed")}
                    value={
                      projectDetails.budget?.type == "Fixed"
                        ? projectDetails.budget?.type_value
                        : ""
                    }
                  />
                </>
              ) : (
                <>
                  <label>Budgeted Hours</label>
                  {/* Input field for entering budgeted hours */}
                  <input
                    readOnly={
                      allowed_roles.includes(auth.role) ||
                      allowedUsers.includes(auth.id)
                        ? false
                        : true
                    }
                    type="text"
                    onChange={(e) => handleInputChange(e, "Monthly")}
                    value={
                      projectDetails.budget?.type === "Monthly"
                        ? projectDetails.budget?.type_value
                        : ""
                    }
                  />
                </>
              ))}
          </div>
        </div>
        {/* Input field for timeline */}
        <div className="timeline-div">
          <label>Timeline</label>
          <input
            readOnly={
              allowed_roles.includes(auth.role) ||
              allowedUsers.includes(auth.id)
                ? false
                : true
            }
            value={projectDetails.timeline}
            type="text"
            onChange={(e) => handleInputChange(e, "timeline")}
          />
        </div>
      </div>
    </>
  );
};

export default Project_Overview_Section; // Exporting the component
