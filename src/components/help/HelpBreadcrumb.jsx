import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function HelpBreadcrumb({ items }) {
  if (!items?.length) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <BreadcrumbItem key={index}>
              {index > 0 && <BreadcrumbSeparator />}
              {isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    item.onClick?.();
                  }}
                >
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default HelpBreadcrumb;
