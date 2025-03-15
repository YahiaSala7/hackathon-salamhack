import React from "react";

const TestComponent = () => {
  return (
    <div className="p-8 bg-background">
      <h1 className="text-3xl mb-4 font-rubik">This is a Rubik Heading</h1>
      <p className="mb-4 font-inter">
        This is Inter body text in the custom text color.
      </p>

      <div className="space-y-4">
        <h2 className="text-2xl font-rubik">Color Examples</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="p-4 bg-heading text-white rounded">Heading Color</div>
          <div className="p-4 bg-button text-white rounded">Button Color</div>
          <div className="p-4 bg-text text-white rounded">Text Color</div>
          <div className="p-4 bg-background border border-gray-300 rounded">
            Background Color
          </div>
          <div className="p-4 bg-success text-white rounded">Success Color</div>
          <div className="p-4 bg-error text-white rounded">Error Color</div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-rubik">Button Examples</h2>
        <div className="flex flex-wrap gap-4">
          <button className="btn">Primary Button</button>
          <button className="btn-success">Success Button</button>
          <button className="btn-error">Error Button</button>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;
