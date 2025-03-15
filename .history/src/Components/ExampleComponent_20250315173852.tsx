import React from "react";

const ExampleComponent = () => {
  return (
    <div className="p-8 bg-background-color">
      <h1 className="text-4xl font-heading text-heading-color mb-4">
        Welcome to Our App
      </h1>

      <p className="font-text text-text-color mb-6">
        This is an example component showcasing our custom Tailwind CSS
        configuration.
      </p>

      <button className="btn-primary mb-4">Click Me</button>

      <div className="space-y-4">
        <div className="success-message">
          This is a success message using our custom color.
        </div>

        <div className="error-message">
          This is an error message using our custom color.
        </div>
      </div>
    </div>
  );
};

export default ExampleComponent;
