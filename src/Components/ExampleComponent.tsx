const ExampleComponent = () => {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-4xl font-heading text-heading">
        Welcome to Our App
      </h1>

      <p className="mb-6 font-text text-text">
        This is an example component showcasing our custom Tailwind CSS
        configuration.
      </p>

      <button className="px-4 py-2 mb-4 text-white transition-opacity rounded-lg bg-button hover:opacity-90">
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
