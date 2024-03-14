import React, { useEffect, useState, useContext } from "react"; // Importing React and necessary hooks
import { Dropdown } from "monday-ui-react-core"; // Importing Dropdown component from Monday UI React Core library
import "monday-ui-react-core/tokens"; // Importing tokens for styling
import "../styling/project_scope_and_stack_section.css"; // Importing CSS styles for the component
import axios from "axios"; // Importing Axios for making HTTP requests
import { toast } from "react-toastify"; // Importing toast notifications for displaying messages
import AuthContext from "../context/AuthProvider";

// Scope_and_Stack_Section component definition
const Scope_and_Stack_Section = () => {
  // State variables to manage component data and behavior
  const [projectDetails, setProjectDetails] = useState({}); // State to manage project details
  const [changesMade, setChangesMade] = useState(false); // State to track changes made to project details
  const allowed_roles = ["Admin", "Manager"];
  const { auth } = useContext(AuthContext);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const PATH_NAME = new URL(window.location.href).pathname;

  // Function to validate input fields
  const handleInputFieldValidation = () => {
    const columns = ["scope", "stack"];
    for (const key in columns) {
      if (projectDetails[key] === "") {
        return true; // Return true if any field is empty
      }
    }
    return false; // Return false if all fields are filled
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      if (handleInputFieldValidation()) {
        toast.error("Please Fill All Fields"); // Display error message if any field is empty
        return;
      }
      // Sending project details to the server for saving
      const { data } = await axios.post(
        `${BASE_URL}${PATH_NAME}/project_details`,
        {
          projectDetails,
        }
      );
      // Displaying success message using toast notification
      toast.success("Data Saved Successfully");
      setChangesMade(false); // Resetting changes made state after successful submission
    } catch (error) {
      // Displaying error message using toast notification
      toast.error("Some Error");
    }
  };

  // Function to handle input change
  const handleInputChange = (e, field) => {
    const newProjectDetails = { ...projectDetails }; // Creating a copy of project details object
    if (field === "stack") {
      // Handling stack field differently
      if (e == null) {
        delete newProjectDetails[field]; // Deleting stack field if no value is selected
      } else {
        // Assigning label and value to stack field if value is selected
        newProjectDetails[field] = {
          label: e.label,
          value: e.value,
        };
      }
    } else {
      // Handling other fields
      newProjectDetails[field] = e.target.value; // Updating the value of the specified field
    }
    setProjectDetails(newProjectDetails); // Updating the project details state
    setChangesMade(true); // Setting changes made flag to true
  };

  // Function to fetch project details from the server
  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}${PATH_NAME}/project_details`);
      const { data } = await response.json();
      // Setting fetched project details to state variable
      setProjectDetails(data[0]);
    } catch (error) {
      // Displaying error message using toast notification
      toast.error("Some Error");
    }
  };

  // Hook to fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

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
      {/* Container for scope and stack fields */}
      <div className="scope-and-stack-wrapper">
        {/* Stack field */}
        <div className="stack-wrapper">
          <label>Select Project's Technology</label>
          {/* Dropdown component for selecting stack */}
          <Dropdown
            readOnly={allowed_roles.includes(auth.role) ? false : true}
            searchable={false}
            className="dropdown"
            value={{
              label: projectDetails?.stack?.label,
              value: projectDetails?.stack?.value,
            }}
            onChange={(item) => handleInputChange(item, "stack")}
            options={[
              { label: "Backend", value: "backend" },
              { label: "Frontend", value: "frontend" },
              { label: "Database", value: "database" },
              { label: "Mobile-App", value: "mobile_app" },
              {
                label: "Infrasrtucture and Services",
                value: "infrastructure_and_services",
              },
            ]}
          />
        </div>
        {/* Scope field */}
        <div className="scope-wrapper">
          <label>Scope</label>
          {/* Textarea for entering project scope */}
          <textarea
            readOnly={allowed_roles.includes(auth.role) ? false : true}
            value={projectDetails?.scope}
            onChange={(e) => handleInputChange(e, "scope")}
          ></textarea>
        </div>
      </div>
    </>
  );
};

export default Scope_and_Stack_Section; // Exporting the component
