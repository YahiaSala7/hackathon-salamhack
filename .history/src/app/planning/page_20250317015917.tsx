import PhaseOne from "@/Components/PhaseOne/PhaseOne";
import PhaseTwo from "@/Components/PhaseTwo/PhaseTwo";

function Planning() {
  return (
    <div className="container mx-auto ">
      <PhaseOne />
      <PhaseTwo formData={null} isFormSubmitted={false} />
    </div>
  );
}

export default Planning;
