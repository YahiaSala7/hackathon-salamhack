import Image from "next/image";

export type FeatureProps = {
  reverse?: boolean;
  src: string;
  width: number;
  height: number;
  header: string;
  description: string;
  imageHolderClassName?: string;
  whiteBg?: boolean;
};
const FeatureCard = ({
  reverse,
  description,
  header,
  height,
  src,
  width,
  imageHolderClassName,
  whiteBg,
}: FeatureProps) => {
  return (
    <div
      className={`flex ${
        reverse ? "flex-row" : "flex-row-reverse"
      } items-center justify-between gap-10 max-md:flex-col max-md:my-10  max-md:p-4`}
    >
      <div className="flex-1 h-72 flex flex-col justify-center gap-10 px-4 max-md:text-center">
        <h3 className="font-heading mb-8 font-medium text-4xl text-center sm:text-3xl">
          {header}
        </h3>
        <p className="text-lg text-gray-600">{description}</p>
      </div>
      <div
        className={
          `flex-1 ${
            whiteBg ? "bg-white" : ""
          } w-fit flex justify-center items-center rounded-4xl ` +
          imageHolderClassName
        }
      >
        <Image
          src={src}
          width={width}
          height={height}
          alt=""
          className="object-contain rounded-4xl"
        />
      </div>
    </div>
  );
};

export default FeatureCard;
