import { Button } from "@/components/ui/button";
import type { UseLinkPropsOptions } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { cva } from "class-variance-authority";
import Typography from "@/components/common/Typography";
import { ArrowLeftIcon } from "lucide-react";

const PADDING_X = "px-8 lg:px-22";
const MARGIN_X = "mx-8 lg:mx-22";

/**
 * AppPageHeader component serves as a container for page header content.
 */
type HeaderVariant = "default" | "outlined";
type GoBackLink = {
  to: UseLinkPropsOptions["to"];
  label: string;
};

interface AppPageHeaderProps {
  title: string;
  subtitle?: string | React.ReactElement;
  headerRightComponent?: React.ReactNode;
  goBackLink?: GoBackLink;
  variant?: HeaderVariant;
  className?: string;
}

const headerVariants = cva(
  `stick top-0 z-9 transition-all bg-background ${MARGIN_X} pt-8 pb-3`,
  {
    variants: {
      variant: {
        default: [],
        outlined: ["border-b"],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function AppPageHeader({
  title,
  subtitle,
  headerRightComponent,
  variant = "default",
  goBackLink,
  className,
}: AppPageHeaderProps) {
  return (
    <div
      className={`
        flex flex-col
        ${headerVariants({ variant })}
        ${className}
      `}
    >
      {goBackLink && (
        <Link to={goBackLink.to}>
          <Button variant="link" className="px-0!" size="lg">
            <ArrowLeftIcon size={16} />
            <span className="text-base">{goBackLink.label}</span>
          </Button>
        </Link>
      )}
      <div className="w-full flex justify-between items-center">
        <Typography variant="title">{title}</Typography>
        {headerRightComponent && headerRightComponent}
      </div>
      {subtitle && <Typography variant="subtitle">{subtitle}</Typography>}
    </div>
  );
}

/**
 * AppPage component serves as a container for page content.
 */
interface AppPageProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string | React.ReactElement;
  headerRightComponent?: React.ReactNode;
  headerVariant?: HeaderVariant;
  goBackLink?: GoBackLink;
  classNames?: {
    header?: string;
  };
}

function AppPage({
  children,
  title,
  subtitle,
  headerRightComponent,
  headerVariant,
  goBackLink,
  classNames,
}: AppPageProps) {
  return (
    <div className="min-h-screen flex flex-col mb-32">
      {title && (
        <AppPageHeader
          title={title}
          subtitle={subtitle}
          headerRightComponent={headerRightComponent}
          variant={headerVariant}
          goBackLink={goBackLink}
          className={classNames?.header}
        />
      )}
      <div className={`flex-1 ${PADDING_X}`}>{children}</div>
    </div>
  );
}

export default AppPage;
