import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseCookie } from "cookie";
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
            const parsed = parseCookie(cookieStr);
            const options = {
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: parsed.Path,
              maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
            };

            if (parsed.accessToken) {
              response.cookies.set("accessToken", parsed.accessToken, options);
            }
            if (parsed.refreshToken) {
              response.cookies.set(
                "refreshToken",
                parsed.refreshToken,
                options,
              );
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
