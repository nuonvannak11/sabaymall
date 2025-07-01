import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function SessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
