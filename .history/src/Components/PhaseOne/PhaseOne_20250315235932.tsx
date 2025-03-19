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
          <h1 className="mb-10 text-6xl font-bold text-heading">
            Define Your Dream Home Effortlessly.
          </h1>
          <p className="mb-20 font-bold text-text">
            Our AI-driven planner helps you design your home effortlessly by
            generating personalized furniture recommendations, budget
            allocations, and price comparisons—all in one place!
          </p>
          <p className="font-extrabold tracking-[3px] text-text">
            SUBMIT YOUR DATA AND GET STARTED
          </p>
        </div>
        <div>Form</div>
      </div>
    </div>
  );
}

export default PhaseOne;
