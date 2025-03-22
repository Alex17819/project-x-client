import { cookies } from "next/headers";

export default async function DashboardPage() {
  const res = await fetch(`http://localhost:3000/api/dashboard`, {
    method: "GET",
    credentials: "include",
  });
  const dashboard = await res.json();

  // if (dashboard.statusCode === 401) {
  //   const myCookies = await cookies();
  //   console.log("COOKIE", typeof myCookies.get("refresh_token")?.value);
  //
  //   const res = await fetch(
  //     `${process.env.NEXT_PUBLIC_API_URL!}/auth/refresh/access-token`,
  //     {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include",
  //       body: JSON.stringify({
  //         refreshToken: myCookies.get("refresh_token")?.value,
  //       }),
  //     }
  //   );
  //   const data = await res.json();
  //
  //   myCookies.set("access_token", data.access_token, {
  //     httpOnly: true,
  //     secure: false,
  //     sameSite: "strict",
  //     path: "/",
  //     maxAge: 60 * 15, // 15m
  //   });
  //   console.log("data", data);
  // }

  console.log("dashboard", dashboard);

  return <h1>Protected route</h1>;
}
