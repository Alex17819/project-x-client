import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { email, password, role } = await req.json();

  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL!}/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    }
  );

  const data = await backendRes.json();
  if (!backendRes.ok) {
    return NextResponse.json(data, { status: backendRes.status });
  }

  console.log("data", data);

  (await cookies()).set("access_token", data.accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 15m
  });

  (await cookies()).set("refresh_token", data.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7d
  });

  return NextResponse.json({ message: "Registered" });
}
