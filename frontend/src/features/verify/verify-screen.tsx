"use client"

import { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setTokenCookie } from "../../../utils/auth";

interface VerifyScreenProps {
  userId: number,
  email: string,
}

export const VerifyScreen = ({  userId, email }: VerifyScreenProps) => {
  const [digits, setDigits] = useState(Array(6).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    // exit the function if user inputs anything other than digits 0-9
    if (!/^[0-9]?$/.test(value)) {
      toast.error('Verification code only accepts digits 0-9')
      return
    };
    const updated = [...digits];
    updated[index] = value;
    setDigits(updated);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // go back to the previous input box on 'backspace key'
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyCode = async (code: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/verify/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          code: code,
        }),
      });
      const result = await response.json();
  
      if (!response.ok) {
        toast.error("Invalid or expired code");
        throw new Error(result.message || "Verification failed");
      }
      
      setTokenCookie(result.token);
      toast.success('Account Verified!');
      router.push("/");

    } catch (error) {
      console.error("Verification error:", error);
    }
  };

  const resendVerificationCode = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/verify/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          email: email,
        }),
      });
      const result = await response.json();

      if (!response.ok || result.status === "fail") {
        throw new Error("Error occurred while calling backend api for sending verification code.")
      }
      toast.success(`Email verification code sent to ${email}.`)

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#5C3B58] px-4">
      <div className="absolute top-6 left-6 flex items-center space-x-1">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-md text-white hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Return to Home
        </button>
      </div>
      <div className="w-full max-w-md text-center p-8 bg-white rounded-xl shadow-lg border">
        <h2 className="text-xl font-semibold mb-4">Verification Code</h2>

        <div className="flex justify-center gap-2 mb-6">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="w-12 h-12 rounded border border-gray-300 text-center text-xl font-medium focus:outline-none focus:ring-2 focus:blue-500"
            />
          ))}
        </div>

        <p className="text-gray-600 text-sm mb-6">
          A verification code has been sent to {email}. Enter the code to verify your account.
        </p>

        <button
          onClick={() => {
            const code = digits.join("");
            verifyCode(code);
          }}
          disabled={digits.some((d) => d === "")}
          className={`w-full py-2 rounded font-semibold transition
            ${digits.every((d) => d !== "")
              ? "bg-purple-900 text-white hover:bg-purple-800"
              : "bg-purple-900/50 text-white cursor-not-allowed"}`}
        >
          Verify
        </button>

        <div className="flex flex-row justify-center items-center mt-4 text-sm">
          <p>Didn&apos;t receive a code?&nbsp;</p>
          <button
            onClick={resendVerificationCode}
            className="text-blue-600 hover:underline"
          >
            Resend
          </button>
        </div>
      </div>
    </div>
  );
}