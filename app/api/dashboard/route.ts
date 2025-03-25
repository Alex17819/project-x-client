import { NextRequest, NextResponse } from "next/server";

//TODO: find a way to get a cookie in this file
export async function GET(req: NextRequest) {
  const cookiesObj = req.cookies;
  console.log("COOKIES", cookiesObj.get("access_token"));
  const refreshToken = cookiesObj.get("access_token")?.value;
  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/protected`,
    {
      credentials: "include",
    }
  );
  const data = await backendRes.json();

  if (data.statusCode === 401) {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL!}/auth/refresh/access-token`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }
    );

    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL!}/auth/protected`
    );
    const originalData = await backendRes.json();

    return NextResponse.json(originalData);
  } else {
    return NextResponse.json(data, { status: backendRes.status });
  }
}
