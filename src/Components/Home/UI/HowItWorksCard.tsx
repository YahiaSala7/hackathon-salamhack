import Image from "next/image";
export type CardProps = {
  src: string;
  width: number;
  height: number;
  header: string;
  description: string;
  bulletNumber: number;
  imageClassName?: string;
};
const Card = ({
  height,
  src,
  width,
  bulletNumber,
  description,
  header,
  imageClassName,
}: CardProps) => {
  return (
    <div className="border-button relative min-w-72 max-w-96 shadow-lg flex-1 bg-white border-2 rounded-lg justify-center items-center py-16 howItWorksCard mt-4">
      <div className="absolute -top-11 flex items-center justify-center shadow-md elevation-2 transform-[-50%, 50%] text-button w-20 h-20 bg-white rounded-[50%] centered">
        <div className="border-button rounded-full w-14 flex justify-center items-center text-3xl font-bold h-14 border-2">
          {bulletNumber}
        </div>
      </div>
      <div className="flex flex-col items-center h-full justify-center text-center gap-6">
        <Image
          alt=""
          src={src}
          width={width}
          height={height}
          className={imageClassName}
        />
        <main className="px-6">
          <h3 className="font-heading font-medium text-2xl">{header}</h3>
          <p className="font-text text-text">{description}</p>
        </main>
      </div>
    </div>
  );
};

export default Card;
