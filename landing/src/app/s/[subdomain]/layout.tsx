import { ReactNode } from "react";
import { SUBDOMAINS_MAP, ROOT_URL } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function SubdomainLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  if (!(subdomain in SUBDOMAINS_MAP)) {
    redirect(ROOT_URL);
  }

  return children;
}


