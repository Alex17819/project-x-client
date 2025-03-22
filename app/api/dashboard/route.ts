import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

//TODO: find a way to get a cookie in this file
export async function GET(req: NextRequest) {
  console.log(req.headers);
  const cookiesObj = req.cookies;
  console.log("all cookies", cookiesObj.getAll());
  const refreshToken = cookiesObj.get("access_token")?.value;
  console.log("refreshToken", refreshToken);
  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL!}/auth/protected`,
    {
      credentials: "include",
    }
  );
  const data = await backendRes.json();

  if (data.statusCode === 401) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL!}/auth/refresh/access-token`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }
    );
    const data = await res.json();

    console.log("data", data);

    (await cookies()).set("access_token", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15, // 15m
    });

    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL!}/auth/protected`
    );
    const originalData = await backendRes.json();

    return NextResponse.json(originalData);
  } else {
    return NextResponse.json(data, { status: backendRes.status });
  }
}
