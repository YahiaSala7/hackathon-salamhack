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
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div>
            <label className="block text-sm font-medium">Budget</label>
            <input
              type="number"
              placeholder="Enter Your Budget"
              className="w-full p-2 border rounded"
              {...register("budget", { required: true })}
            />
            {errors.budget && (
              <p className="text-sm text-red-500">Budget is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Home Area</label>
            <input
              type="number"
              placeholder="Enter Your Home Area"
              className="w-full p-2 border rounded"
              {...register("area", { required: true })}
            />
          </div>

          <input
            {...register("bedrooms", { required: true })}
            placeholder="Enter Bedrooms Number"
            className="w-full p-2 border rounded"
          />
          <input
            {...register("bathrooms", { required: true })}
            placeholder="Enter Bathrooms Number"
            className="w-full p-2 border rounded"
          />
          <input
            {...register("livingRoom")}
            defaultValue={1}
            disabled
            className="w-full p-2 bg-gray-100 border rounded"
          />
          <input
            {...register("kitchen")}
            defaultValue={1}
            disabled
            className="w-full p-2 bg-gray-100 border rounded"
          />
          <input
            {...register("otherRooms")}
            placeholder="Enter Other Rooms (Office, Storage, etc.)"
            className="w-full p-2 border rounded"
          />

          <div>
            <label className="block text-sm font-medium">Location</label>
            <select
              {...register("location", { required: true })}
              className="w-full p-2 border rounded">
              <option value="">Select Your Location</option>
              <option value="NY">New York</option>
              <option value="CA">California</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Style Preferences
            </label>
            <select
              {...register("style", { required: true })}
              className="w-full p-2 border rounded">
              <option value="">Select Your Style Preferences</option>
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full p-3 text-white bg-blue-600 rounded shadow hover:bg-blue-700">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default PhaseOne;
