"use server";
import { cookies } from 'next/headers';
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

// Define your DecodedToken interface
export interface DecodedToken {
  userId: number;
  email: string;
  name: string;
  exp: number;
  address: string;
}


export async function setTokenCookie(token: string) {
  try {
    const cookieStore = await cookies();
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET as string) as DecodedToken; 
    const exp = new Date(decoded.exp * 1000);
    cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: exp,
    });
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}

export async function getTokenPayload() {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;
  
      if (!token || token === undefined) {
        return null; 
      }
  
      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET as string);
      const payload = jwtDecode<DecodedToken>(token);
      return payload;
    } catch (error) {
      if( error instanceof jwt.JsonWebTokenError){
        const cookieStore = await cookies();
        cookieStore.delete("token");
        redirect("/auth");
      }
      return null; 
    }
    return null;
  }

  export async function removeTokenCookieWithRedirect() {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    redirect('/auth');
  }

  export async function removeTokenCookieWithOutRedirect() {
    const cookieStore = await cookies();
    cookieStore.delete("token");
  }