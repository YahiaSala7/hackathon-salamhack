import Container from "./UI/Container";
import Image from "next/image";
const HeroSection = () => {
  return (
    <Container className="flex items-center gap-10 justify-between max-sm:flex-col">
      <main className="flex flex-col gap-4 pl-12 mt-12">
        <h1 className="text-[#0B132A] text-3xl/relaxed font-heading font-bold min-lg:w-8/12 ">
          Design Your Dream Home, Powered by AI
        </h1>
        <p className="text-text font-text text-sm/normal min-md:w-10/12 lg:w-8/12 max-sm:mr-12">
          Input your budget, home dimensions, and design style to unlock
          personalized furniture and appliance recommendations. Our intelligent
          system compares local deals, generates a custom 2D layout, and creates
          a detailed report—all in just a few clicks, so you can effortlessly
          transform your space.
        </p>
        <div className="flex gap-4 max-sm:justify-center">
          <button className="bg-button rounded-lg heroSectionButtons text-white text-base h-12 px-10 font-bold font-heading">
            Start Planning
          </button>
          <button className="bg-button rounded-lg heroSectionButtons text-white text-base h-12 px-10 font-bold font-heading">
            Know More
          </button>
        </div>
      </main>
      <Image
        alt=""
        src={"/main-home-picture.png"}
        height={396}
        width={396}
        className="max-md:w-[266] max-md:h-[266]"
      />
    </Container>
  );
};

export default HeroSection;
