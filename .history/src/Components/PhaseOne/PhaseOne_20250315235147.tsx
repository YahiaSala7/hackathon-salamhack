import React from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";

function PhaseOne() {
  return (
    <div className="">
      <div className="flex justify-between">
        <h1 className="text-3xl">Logo</h1>
        <Breadcrumb pageName="Planning" />
      </div>
      <div className="grid grid-cols-2">
        <div className="">
          <h1 className="text-6xl text-heading ">
            Define Your Dream Home Effortlessly.
          </h1>
          <p className="font-bold text-text">
            Our AI-driven planner helps you design your home effortlessly by
            generating personalized furniture recommendations, budget
            allocations, and price comparisons—all in one place!
          </p>
        </div>
        <div>Form</div>
      </div>
    </div>
  );
}

export default PhaseOne;
