import Link from "next/link";
interface BreadcrumbProps {
  pageName: string;
}
const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  return (
    <div className="flex flex-col gap-3 mb-6 sm:flex-row-reverse sm:items-center sm:justify-between">
      <nav>
        <ol className="flex items-center ">
          <li>
            <Link className="font-medium" href="/">
              Home/
            </Link>
          </li>
          <li className="font-medium text-primary text-[var(--color-text)]">
            {pageName}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
