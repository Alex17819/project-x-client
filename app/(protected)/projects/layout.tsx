import { ReactNode } from "react";

export default async function ProjectsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="pb-50">{children}</div>;
}
