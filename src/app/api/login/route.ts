import { NextRequest, NextResponse } from "next/server";
import { userController } from "@/actions/controller/user_controller";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const result = await userController.loginAction(undefined, formData);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ code: 0, message: "Server error", type: "error" }, { status: 500 });
  }
}

