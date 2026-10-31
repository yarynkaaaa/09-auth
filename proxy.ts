import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseSetCookie } from "cookie";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!accessToken) {
    if (refreshToken) {
      try {
        const sessionRes = await checkSession();
        const setCookie = sessionRes.headers["set-cookie"];

        if (setCookie) {
          const cookieArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];

          const response = isPublicRoute
            ? NextResponse.redirect(new URL("/profile", request.url))
            : NextResponse.next();

          for (const cookieStr of cookieArray) {
            const parsed = parseSetCookie(cookieStr);

            const options = {
              expires: parsed.expires,
              path: parsed.path,
              maxAge: parsed.maxAge,
            };

            if (parsed.name === "accessToken" && parsed.value) {
              response.cookies.set("accessToken", parsed.value, options);
            }
            if (parsed.name === "refreshToken" && parsed.value) {
              response.cookies.set("refreshToken", parsed.value, options);
            }
          }

          return response;
        }
      } catch {}
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
