import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  const syncDB = async () => {
    // Add your code here

    fetch("https://oasisreviewupdate-bz7hhcxahq-uc.a.run.app/").then(() =>
      alert("Synced Successfully")
    );
  };

  return (
    <div className="navbar bg-base-100 shadow-lg flex justify-between items-center px-4 py-2">
      <div>
        <Link to="/">
          <div className="btn btn-ghost text-xl mr-4">Pending</div>
        </Link>
        <Link to="/reviews">
          <div className="btn btn-ghost text-xl">Completed</div>
        </Link>
      </div>
      <button
        onClick={() => {
          syncDB();
        }}
        className="btn btn-primary h-10 text-lg flex items-center"
      >
        <span>Sync DB</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </button>
    </div>
  );
};

export default Navbar;
