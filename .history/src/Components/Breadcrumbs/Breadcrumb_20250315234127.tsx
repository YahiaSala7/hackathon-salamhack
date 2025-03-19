import Link from "next/link";
interface BreadcrumbProps {
  pageName: string;
  nestedPageRoute?: string;
  nestedPages?: string;
}
const Breadcrumb = ({
  pageName,
  nestedPages,
  nestedPageRoute,
}: BreadcrumbProps) => {
  return (
    <div className="flex flex-col gap-3 mb-6 sm:flex-row-reverse sm:items-center sm:justify-between">
      <h2 className="font-semibold text-black text-title-md2 dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/">
              Home/
            </Link>
          </li>
          <li>
            <Link className="font-medium" href={`/${nestedPageRoute}`}>
              {nestedPages ? `${nestedPages} /` : ""}
            </Link>
          </li>
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
