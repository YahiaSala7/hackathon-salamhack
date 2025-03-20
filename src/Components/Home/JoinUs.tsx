import Link from "next/link";

const JoinUs = () => {
  return (
    <div className="py-20">
      <Link href="planning" className="w-fit block mx-auto">
        <button className="border-2 cursor-pointer text-center border-button shadow-button shadow-2xl rounded-lg py-5 mx-auto block text-2xl font-bold text-button px-20">
          START NOW
        </button>
      </Link>
    </div>
  );
};

export default JoinUs;
