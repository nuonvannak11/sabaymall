import React from "react";
import { useSession } from "next-auth/react";
import isEmpty from "lodash/isEmpty";
import { redirect } from "next/navigation";
// import Header from "@/components/Header";

export default function LayoutSession() {
  const { data: session } = useSession();
  const user = session?.user;
  if (!user || isEmpty(user)) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* <Header action={()=>console.log("vv")} /> */}
    </div>
  );
}
