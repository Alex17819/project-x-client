import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import setCookieParser from "set-cookie-parser";

export async function POST(req: Request) {
  const { email, password, role } = await req.json();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL!}/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, role }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  const setCookieHeader = response.headers.get("set-cookie");
  const cookiesObj = await cookies();

  if (setCookieHeader) {
    const splitString = setCookieParser.splitCookiesString(setCookieHeader);

    const parsedCookies = setCookieParser.parse(splitString);

    parsedCookies.forEach(({ name, value, ...options }) => {
      cookiesObj.set(name, value, {
        httpOnly: options.httpOnly,
        secure: options.secure,
        path: options.path || "/",
        maxAge: options.maxAge,
        expires: options.expires ? new Date(options.expires) : undefined,
        sameSite: options.sameSite as "strict" | "lax" | "none",
      });
    });
  }

  return NextResponse.json({ message: "Registered" });
}
