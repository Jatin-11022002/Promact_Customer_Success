import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Importing UUID library for generating unique IDs
import AuthContext from "src/context/Auth-Provider"; // Importing AuthContext from context/AuthProvider
import { useAuth0 } from "@auth0/auth0-react"; // Importing useAuth0 hook from Auth0 React SDK
import "src/styling/request-access.css";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { toast, ToastContainer } from "react-toastify"; // Importing toast notifications for displaying messages

const RequestAccess = () => {
  const { user } = useAuth0();
  const [editRequests, setEditRequests] = useState([]);
  const { auth } = useContext(AuthContext);

  const BASE_URL = process.env.REACT_APP_BASE_URL; // Base URL for API requests
  const PATH_NAME = new URL(window.location.href).pathname;

  const requestEditAccess = async () => {
    try {
      const project_id = PATH_NAME.split("/")[2];

      const user_request = {
        _id: uuidv4(),
        user_id: user.sub,
        project_id,
        admin_approval: "pending",
        manager_approval: "pending",
        user: {
          name: user.name,
          role: auth.role,
          email: user.email,
        },
      };

      const response = await axios.post(
        `${BASE_URL}/user-edit-request/${user.sub}`,
        [user_request]
      );
      setEditRequests([user_request]);
      toast.success("Request Sent Successfully");
      //console.log(response);
    } catch (error) {
      //console.log(error);
      toast.error("Error while Creating Edit Request");
    }
  };

  const fetchUserRequest = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user-edit-request/${user.sub}`
      );
      const { data: requests } = response;
      setEditRequests(requests.data);
    } catch (error) {
      toast.error("Error while Fetching user Request");
    }
  };

  const fetchProjectRequest = async () => {
    try {
      const project_id = PATH_NAME.split("/")[2];
      const response = await axios.get(
        `${BASE_URL}/project-edit-request/${project_id}`
      );
      const { data: requests } = response;
      setEditRequests(requests.data);
    } catch (error) {
      toast.error("Error while Fetching Project Edit Requests");
    }
  };

  useEffect(() => {
    if (auth.role == "Admin" || auth.role == "Manager") {
      fetchProjectRequest();
    } else {
      fetchUserRequest();
    }
  }, []);

  const handleRequestStatus = async (
    roleApproval,
    updatedStatus,
    request_id
  ) => {
    try {
      let updatedRequest = {};
      const updatedRequests = editRequests.map((request) => {
        if (request._id == request_id) {
          updatedRequest = { ...request };
          updatedRequest[roleApproval] = updatedStatus;
          return updatedRequest;
        } else {
          return request;
        }
      });

      setEditRequests(updatedRequests);
      const response = await axios.post(
        `${BASE_URL}/user-edit-request/${user.sub}`,
        [updatedRequest]
      );

      toast.success("Request Status Updated Successfully");
    } catch (error) {
      toast.error("Error while Updating Request Status");
    }
  };

  const handleEditAccessMessage = () => {
    if (
      editRequests[0].admin_approval == "approved" &&
      editRequests[0].manager_approval == "approved"
    ) {
      return (
        <div className="edit-access-message">
          Your request for Edit Access was Approved
        </div>
      );
    } else if (
      editRequests[0].admin_approval == "rejected" ||
      editRequests[0].manager_approval == "rejected"
    ) {
      return (
        <div className="edit-access-message">
          Your request for Edit Access was not Approved
        </div>
      );
    } else {
      return (
        <div className="edit-access-message">
          You have applied for Edit Access
        </div>
      );
    }
  };

  const generateRequestTable = () => {
    return (
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {editRequests.map((request) => (
            <tr key={request._id}>
              <td>{request.user.name}</td>
              <td>{request.user.email}</td>
              <td>{request.user.role}</td>
              <td className="table-action-button-container">
                {auth.role == "Manager" ? (
                  <>
                    <button
                      className={`approve-button ${
                        request.manager_approval == "rejected"
                          ? "disable-button"
                          : ""
                      } ${
                        request.manager_approval == "approved"
                          ? "hide-hover"
                          : ""
                      }`}
                      disabled={
                        request.manager_approval == "rejected" ||
                        request.manager_approval == "approved"
                      }
                      onClick={() =>
                        handleRequestStatus(
                          "manager_approval",
                          "approved",
                          request._id
                        )
                      }
                    >
                      <FaCheck />
                    </button>
                    <button
                      className={`reject-button ${
                        request.manager_approval == "approved"
                          ? "disable-button"
                          : ""
                      }${
                        request.manager_approval == "rejected"
                          ? "hide-hover"
                          : ""
                      }`}
                      disabled={request.manager_approval == "approved"}
                      onClick={() =>
                        handleRequestStatus(
                          "manager_approval",
                          "rejected",
                          request._id
                        )
                      }
                    >
                      <RxCross2 />
                    </button>
                  </>
                ) : request.manager_approval == "approved" ? (
                  <>
                    <button
                      className={`approve-button ${
                        request.admin_approval == "rejected"
                          ? "disable-button"
                          : ""
                      } ${
                        request.admin_approval == "approved" ? "hide-hover" : ""
                      }`}
                      disabled={
                        request.admin_approval == "rejected" ||
                        request.admin_approval == "approved"
                      }
                      onClick={() =>
                        handleRequestStatus(
                          "admin_approval",
                          "approved",
                          request._id
                        )
                      }
                    >
                      <FaCheck />
                    </button>
                    <button
                      className={`reject-button ${
                        request.admin_approval == "approved"
                          ? "disable-button"
                          : ""
                      }${
                        request.admin_approval == "rejected" ? "hide-hover" : ""
                      }`}
                      disabled={request.admin_approval == "approved"}
                      onClick={() =>
                        handleRequestStatus(
                          "admin_approval",
                          "rejected",
                          request._id
                        )
                      }
                    >
                      <RxCross2 />
                    </button>
                  </>
                ) : (
                  <label>Awaiting Manager's Approval</label>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="request-access-container">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ minWidth: "fit-content" }}
      />
      {auth.role == "Admin" || auth.role == "Manager" ? (
        <div>{generateRequestTable()}</div>
      ) : (
        <>
          {editRequests.length == 0 ? (
            <div className="request-edit-access-button-container">
              <label className="edit-access-message">
                You don't have Edit Access for this Project
              </label>
              <button onClick={requestEditAccess}>Request Edit Access</button>
            </div>
          ) : (
            <div className="edit-access-message-container">
              {handleEditAccessMessage()}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RequestAccess;
