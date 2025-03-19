import Container from "./UI/Container";
import FeatureCard from "./UI/FeatureCard";
import { FeatureProps } from "./UI/FeatureCard";
import Image from "next/image";

const Features = () => {
  const features: FeatureProps[] = [
    {
      header: "Efficiency & Savings",
      description:
        "Our AI analyzes your inputs—budget, home size, rooms, location, and design style—to deliver customized furniture and appliance suggestions. Get recommendations that perfectly match your lifestyle and local climate.",
      src: "/feature1.jpg",
      width: 450,
      height: 300,
    },
    {
      header: "Visualize Your Space",
      description:
        "Instantly preview your future home with AI-generated 2D layouts. See exactly how furniture will fit and flow in your space, making design decisions easier than ever.",
      src: "/feature2.png",
      width: 400,
      height: 300,
      reverse: true,
      whiteBg: true,
      imageHolderClassName: "py-8 w-full",
    },
    {
      header: "Intelligent Recommendations",
      description:
        "Our AI dives into local trends and your personal inputs to deliver smart, context-aware suggestions. Every recommendation is optimized to enhance your home's style, functionality, and comfort.",
      src: "/feature3.jpg",
      width: 600,
      height: 200,
    },
  ];
  return (
    <Container className="mt-28">
      <div className="text-center mb-28">
        <h2 className="font-heading font-medium text-4xl before:block before:content-[''] before:[width:calc(100%+40px)] before:h-0.5 before:bg-button before:absolute before:bottom-[-15px] before:-left-5 before:rounded-3xl relative w-fit mx-auto">
          Ai powered features
        </h2>
      </div>
      <main>
        <FeatureCard {...features[0]} />
        <div className="max-md:hidden">
          <Image
            src="/Vector1.svg"
            alt=""
            width={635}
            height={175}
            className="mx-auto w-2/3"
          />
        </div>
        <FeatureCard {...features[1]} />
        <div className="max-md:hidden ">
          <Image
            src="/Vector2.svg"
            alt=""
            width={421}
            height={190}
            className="mx-auto w-1/3"
          />
        </div>
        <FeatureCard {...features[2]} />
      </main>
    </Container>
  );
};

export default Features;
