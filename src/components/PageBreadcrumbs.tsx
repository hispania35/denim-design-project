import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

interface PageBreadcrumbsProps {
  current: string;
}

const PageBreadcrumbs = ({ current }: PageBreadcrumbsProps) => (
  <nav aria-label="Хлебные крошки" className="container px-4 mx-auto pt-24 md:pt-28">
    <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
      <li>
        <Link to="/" className="hover:text-primary transition-colors">
          Главная
        </Link>
      </li>
      <li aria-hidden="true" className="flex items-center">
        <Icon name="ChevronRight" size={14} />
      </li>
      <li className="text-foreground font-medium" aria-current="page">
        {current}
      </li>
    </ol>
  </nav>
);

export default PageBreadcrumbs;
