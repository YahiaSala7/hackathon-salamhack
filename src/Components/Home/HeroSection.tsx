import Link from "next/link";
import Container from "./UI/Container";
import Image from "next/image";
const HeroSection = () => {
  return (
    <Container className="flex items-center gap-10 justify-between max-sm:flex-col xl:min-h-[700px]">
      <main className="flex flex-col flex-3/5 gap-4 min-sm:pl-12 max-sm:text-center min-sm:mt-12 min-lg:flex-2/3 max-sm:px-2">
        <h1 className="text-[#0B132A] text-3xl/relaxed headerHero font-heading font-bold min-lg:w-10/12 ">
          Design Your Dream Home, Powered by AI
        </h1>
        <p className="text-text font-text text-sm/normal textHero min-md:w-10/12 ">
          Input your budget, home dimensions, and design style to unlock
          personalized furniture and appliance recommendations. Our intelligent
          system compares local deals, generates a custom 2D layout, and creates
          a detailed report—all in just a few clicks, so you can effortlessly
          transform your space.
        </p>
        <div className="flex gap-4 max-sm:justify-center">
          <Link href={"planning"}>
            <button className="bg-button rounded-lg heroSectionButtons cursor-pointer  text-white text-base h-12 px-10 font-bold font-heading xl:h-24 xl:text-3xl xl:px-16">
              Start Planning
            </button>
          </Link>

          <Link href={"#howItWorks"}>
            <button className="bg-button rounded-lg px-10 heroSectionButtons cursor-pointer text-white text-base h-12 font-bold font-heading xl:h-24 xl:text-3xl xl:px-16">
              Know More
            </button>
          </Link>
        </div>
      </main>
      <div className="min-sm:h-[490px] flex-2/5 upAndDown min-lg:flex-1/3 flex justify-center items-center">
        <Image
          alt=""
          src={"/main-home-picture.png"}
          height={313}
          width={313}
          className="max-md:w-[266px] max-md:h-[266px] object-contain w-full"
        />
      </div>
    </Container>
  );
};

export default HeroSection;
