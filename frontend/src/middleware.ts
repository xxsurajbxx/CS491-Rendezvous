import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

interface DecodedToken {
    userId: string;
    email: string;
    name: string;
    exp: number;
  }

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const pathname = request.nextUrl.pathname;
    if (!token) {
        if(pathname !== "/auth"){
            const res = NextResponse.redirect(new URL("/auth", request.url));
            res.cookies.delete("token");
            return res;
        }
        else{
            const res = NextResponse.next();
            res.cookies.delete("token");
            return res;
        }
    }
    try{
        const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET as string) as DecodedToken;
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
            console.log("Token is expired, redirecting to /auth");
            if(pathname !== "/auth"){
                const res = NextResponse.redirect(new URL("/auth", request.url));
                res.cookies.delete("token");
                return res;
            }
            else{
                const res = NextResponse.next();
                res.cookies.delete("token");
                return res;
            }
        }
    }
    catch {
        console.log("Token is invalid, should rediret to auth");
        if(pathname !== "/auth"){
            const res = NextResponse.redirect(new URL("/auth", request.url));
            res.cookies.delete("token");
            return res;
        }
        else{
            const res = NextResponse.next();
            res.cookies.delete("token");
            return res;
        }
    }

    if(pathname === "/auth"){
        return NextResponse.redirect(new URL("/", request.url));
        // TODO: Change this redirect to /events
    }

    return NextResponse.next();
}