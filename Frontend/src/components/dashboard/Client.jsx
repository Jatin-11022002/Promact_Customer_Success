import React from "react";
import "src/styling/client-dashboard.css";

const Client = () => {
  return (
    <>
      <div class="grid grid-cols-3 gap-4 p-6 h-auto scroll-auto">
        <div class="col-span-1">
          <div class="bg-white-200 p-4 shadow-md flex-col rounded-md">
            <h1 className="font-semibold text-xl">Project</h1>
            <div className="description-card flex-col justify-between my-4 bg-gray-100 h-full p-2 rounded-md">
              <div className="content-card-box">
                <h2 className="font-medium">Description</h2>
                <p className="font-light text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos
                  qui culpa veritatis non quasi quisquam rem explicabo cumque
                  quam unde!
                </p>
              </div>
              <div className="timeline-status-box flex justify-between mt-6 pt-2 border-t-2 border-gray-200">
                <div className="date-container flex flex-col gap-1">
                  <label className="text-xs font-light">Start Date</label>
                  <label className="font-bold text-sm">16 Apr 2024</label>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-light text-xs">Status</label>
                  <div class="relative">
                    <button class="bg-green-200 hover:bg-green-300 text-gray-700 font-semibold px-1 rounded inline-flex items-center">
                      <span className="font-xl">in progress</span>
                      <svg
                        class="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M7 10l5 5 5-5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-1">
          <div class="bg-white-200 p-4 shadow-md flex flex-col rounded-md h-full">
            <h1 className="font-semibold text-xl">Risk</h1>
            <div class="w-full rounded mt-4 flex flex-col gap-6">
              <div className="progress-bar-div">
                <div className="progress-bar-label-container flex justify-between bg-white">
                  <h2 className="font-medium text-sm">Financial</h2>
                  <h2 className="font-light text-xs">High Risk</h2>
                </div>
                <div className="progress-bar-container bg-gray-100">
                  <div
                    class="progress-bar bg-red-500 text-xs leading-none py-1 text-center text-white rounded"
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>
              <div className="progress-bar-div">
                <div className="progress-bar-label-container flex justify-between bg-white">
                  <h2 className="font-medium text-sm">Operational</h2>
                  <h2 className="font-light text-xs">Medium Risk</h2>
                </div>
                <div className="progress-bar-container bg-gray-100">
                  <div
                    class="progress-bar bg-orange-500 text-xs leading-none py-1 text-center text-white rounded"
                    style={{ width: "50%" }}
                  ></div>
                </div>
              </div>
              <div className="progress-bar-div">
                <div className="progress-bar-label-container flex justify-between bg-white">
                  <h2 className="font-medium text-sm">Technical</h2>
                  <h2 className="font-light text-xs">Low Risk</h2>
                </div>
                <div className="progress-bar-container bg-gray-100">
                  <div
                    class="progress-bar bg-green-500 text-xs leading-none py-1 text-center text-white rounded"
                    style={{ width: "20%" }}
                  ></div>
                </div>
              </div>
              <div className="progress-bar-div">
                <div className="progress-bar-label-container flex justify-between bg-white">
                  <h2 className="font-medium text-sm">Financial</h2>
                  <h2 className="font-light text-xs">High Risk</h2>
                </div>
                <div className="progress-bar-container bg-gray-100">
                  <div
                    class="progress-bar bg-red-500 text-xs leading-none py-1 text-center text-white rounded"
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-1">
          <div class="bg-white-200 p-4 shadow-md h-full">
            <h2 className="font-semibold text-xl">Updates</h2>
          </div>
        </div>
        <div class="col-span-1">
          <div class="bg-white-200 p-4 shadow-md h-full">
            <div className="card-header flex justify-between">
              <h2 className="font-semibold text-xl rounded-md">Logs</h2>
              <label className="text-slate-500 font-semibold">View All</label>
            </div>
            <div className="logs-container mt-4 flex flex-col gap-2">
              <div className="log-card bg-gray-100 p-2 rounded-md">
                <label>2024-04-20</label>
                <p>Lorem ipsum dolor sit amet</p>
              </div>
              <div className="log-card bg-gray-100 p-2 rounded-md">
                <label>2024-04-20</label>
                <p>Lorem ipsum dolor sit amet</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-2">
          <div class="bg-white-200 p-4 shadow-md h-full">
            <div className="card-header flex justify-between">
              <h2 className="font-semibold text-xl">Client Feedback</h2>
              <label className="text-slate-500 font-semibold">View All</label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Client;
