import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/dashboard", "/savedlocation","/search" ];

export async function middleware(req: NextRequest) {
    const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    
    if(protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
        if(!token) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard", "/savedlocation","/search" ]
}