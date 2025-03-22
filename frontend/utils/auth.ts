"use server";
import { cookies } from 'next/headers';
import jwt from "jsonwebtoken";
import { redirect } from 'next/navigation';
import Cookies from "js-cookie";

// Define your DecodedToken interface
interface DecodedToken {
  userId: string;
  email: string;
  name: string;
  exp: number;
}


export async function setTokenCookie(token: string) {
  try {
    const cookieStore = cookies();
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET as string) as DecodedToken; 
    const exp = new Date(decoded.exp * 1000);
    cookies().set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: exp,
    });
    return true;
  } catch (error) {
    return false;
  }
}

export async function getTokenPayload(): Promise<DecodedToken | null> {
    try {
      const token = cookies().get("token")?.value;
      console.log(token);
  
      if (!token) {
        console.warn("No token found in cookies");
        return null; 
      }
  
      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET as string) as DecodedToken;
      return decoded; 
    } catch (error) {
      return null; 
    }
    return null;
  }

  export async function removeTokenCookieWithRedirect() {
    const cookieStore = cookies();
    cookieStore.delete("token");
    redirect('/auth');
  }

  export async function removeTokenCookieWithOutRedirect() {
    const cookieStore = cookies();
    cookieStore.delete("token");
  }