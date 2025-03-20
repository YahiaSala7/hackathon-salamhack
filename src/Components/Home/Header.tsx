import Link from "next/link";
import Container from "./UI/Container";
import Image from "next/image";
import MobileHeader from "./MobileHeader";
import "./style.css";
const Header = () => {
  return (
    <header className="relative overflow-hidden border-[1px] border-solid border-text">
      <div className="max-md:hidden">
        <Container className="h-32">
          <div className="flex items-center justify-between h-full gap-28">
            <div className="grid items-center h-full min-w-[163px]">
              <Image
                width={163}
                height={69}
                alt="logo"
                src="/logo.png"
                priority
                className="pl-2.5"
              />
            </div>
            <div className="flex items-center justify-around px-10 grow gap-2.5">
              <Link
                href={"#howItWorks"}
                className="block text-2xl before:hidden text-white max-lg:text-lg font-text before:content-[''] before:w-full before:h-1 before:bg-button before:absolute before:bottom-[-30px] before:left-0 before:rounded-3xl relative hover:before:block"
              >
                How it works
              </Link>
              <Link
                href={"#features"}
                className="block text-2xl before:hidden text-white max-lg:text-lg font-text before:content-[''] before:w-full before:h-1 before:bg-white before:absolute before:bottom-[-30px] before:left-0 before:rounded-3xl relative hover:before:block"
              >
                Features
              </Link>
              <Link
                href={"planning"}
                className="block text-2xl text-white max-lg:text-lg font-text before:content-[''] before:w-full before:h-1 before:bg-white before:absolute before:hidden before:bottom-[-30px] before:left-0 before:rounded-3xl relative hover:before:block"
              >
                Start now
              </Link>
            </div>
          </div>
        </Container>
        <Image
          src={"/BlueVector.svg"}
          alt={""}
          width={1362}
          height={296}
          className="absolute hidden md:block  md:top-[-65px] md:right-[-220px] lg:top-[-105px] lg:right-[-260px] xl:top-[-155px] xl:right-[-210px] 2xl:right-[-220px] z-[-1]"
        />
      </div>
      <MobileHeader />
    </header>
  );
};

export default Header;
