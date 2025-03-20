const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  console.log(className);

  return <div className={`lg:px-[100px] ` + className}>{children}</div>;
};

export default Container;
