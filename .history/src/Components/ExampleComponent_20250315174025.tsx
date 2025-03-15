import React from "react";

const ExampleComponent = () => {
  return (
    <div className="p-8 bg-background">
      <h1 className="text-4xl font-heading text-heading mb-4">
        Welcome to Our App
      </h1>

      <p className="font-text text-text mb-6">
        This is an example component showcasing our custom Tailwind CSS
        configuration.
      </p>

      <button className="bg-button text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity mb-4">
        Click Me
      </button>

      <div className="space-y-4">
        <div className="text-success">
          This is a success message using our custom color.
        </div>

        <div className="text-error">
          This is an error message using our custom color.
        </div>
      </div>
    </div>
  );
};

export default ExampleComponent;
