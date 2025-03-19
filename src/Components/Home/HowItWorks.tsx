import Container from "./UI/Container";
import Card, { CardProps } from "./UI/HowItWorksCard";

const HowItWorks = () => {
  const cards: CardProps[] = [
    {
      bulletNumber: 1,
      description:
        "Share your budget, home size, rooms, location, and style. We'll find local options suited to your climate.",
      header: "Tell Us About Your Space",
      src: "/card1.svg",
      width: 140,
      height: 140,
      imageClassName: "my-7",
    },
    {
      bulletNumber: 2,
      header: "Receive Personalized Recommendations",
      description:
        "Our AI suggests furniture that fits your style and budget, with smart budget distribution across rooms.",
      src: "/card2.svg",
      width: 200,
      height: 200,
    },
    {
      bulletNumber: 3,
      header: "Compare Prices and Find Deals",
      description:
        "We scan stores for the best prices on your items and show you where to buy at the lowest cost. ",
      src: "/card3.png",
      width: 200,
      height: 200,
    },
    {
      bulletNumber: 4,
      header: "Visualize Your Space",
      description:
        "Share your budget, home size, rooms, location, and style. We'll find local options suited to your climate.",
      src: "/card4.svg",
      width: 200,
      height: 200,
    },
    {
      bulletNumber: 5,
      header: "Get Your Complete Plan",
      description:
        "Download a PDF with all selections, costs, layouts, and where to buy everything for your new home.",
      src: "/card5.png",
      width: 200,
      height: 200,
    },
  ];
  return (
    <section id="howItWorks" className="mt-24">
      <header className="h-80 bg-linear-to-b from-button to-[#2550AA]">
        <Container className="text-center text-white pt-16 ">
          <h3 className="font-heading text-4xl font-medium mb-7">
            How it works
          </h3>
          <p className="font-light text-lg font-[#D3D3D3]">
            we can help you furnish your home the best way possible
          </p>
        </Container>
      </header>
      <Container className="flex flex-wrap justify-center gap-10 -mt-20 px-3">
        {cards.map((card) => {
          return <Card key={card.bulletNumber} {...card} />;
        })}
      </Container>
    </section>
  );
};

export default HowItWorks;
