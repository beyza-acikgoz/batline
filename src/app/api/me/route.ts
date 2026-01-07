import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

type JwtUser = {
  firstName: string;
  lastName: string;
  role: string;
  rework: boolean;
};

export function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtUser;

    return NextResponse.json({
      success: true,
      user: {
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        role: decoded.role,
        rework: decoded.rework,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false },
      { status: 401 }
    );
  }
}
