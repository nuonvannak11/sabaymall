import { NextRequest, NextResponse } from "next/server";
import { userController } from "@/actions/controller/user_controller";
import { protectRequest } from "@/helper/protect_request";

export async function POST(req: NextRequest) {
  const response = await protectRequest(req);
  if (response) return response;

  try {
    const formData = await req.formData();
    const result = await userController.loginAction(undefined, formData);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { code: 0, message: "Server error", type: "error" },
      { status: 500 }
    );
  }
}
