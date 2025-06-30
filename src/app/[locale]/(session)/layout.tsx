import React from "react";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { DefLayoutProps } from "@/types";


export default async function SessionLayout({
  children,
}: Readonly<DefLayoutProps>) {
  const session = await auth();
  
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
