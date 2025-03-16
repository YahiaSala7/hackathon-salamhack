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
    <div className="border-button min-w-72 max-w-96 flex-1 bg-white border-2 rounded-lg justify-center items-center py-16 px-">
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
