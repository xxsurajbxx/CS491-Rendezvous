import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SignInFlow } from "../types";
import { useState } from "react";
//import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";
import { setTokenCookie } from "../../../../utils/auth";
import { useRouter } from "next/navigation";

interface SignInCardProps {
    setState: (state: SignInFlow) => void;
}

export const SignInCard = ({setState}: SignInCardProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);
    const router = useRouter();
    //const { signIn } = useAuthActions();

    const onPasswordSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);

        try {
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok){
                throw new Error("Invalid username or password");
            }

            const cookieStatus = await setTokenCookie(data.token);
            if (!cookieStatus) {
                throw new Error("Something went wrong");
            }
            router.replace("/");
        }
        catch (error) {
            if (error instanceof Error) {
                setError(error.message); // Use the error message from the Error object
            } else {
                setError("An unexpected error occurred"); // Fallback in case the error is not an instance of Error
            }
        }
        finally{
            setPending(false);
        }
    }
    
    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                    Login to continue
                </CardTitle>
                <CardDescription>
                    Use your email or another service to continue
                </CardDescription>
            </CardHeader>
            {!!error && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                    <TriangleAlert className="size-4" />
                    <p>{error}</p>
                </div>
            )}
            <CardContent className="space-y-5 px-0 pb-0">
                <form onSubmit={onPasswordSignIn} className="space-y-2.5">
                    <Input disabled={pending} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required/>
                    <Input disabled={pending} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required/>
                    <Button disabled={pending} type="submit" className="w-full" size="lg" >
                        Continue
                    </Button>
                    <Separator/>
                    <p className="text-xs text-muted-foreground">
                        Don&apos;t have an account? <span onClick={() => {setState("signUp")}} className="text-sky-700 hover:underline cursor-pointer">Sign up</span>
                    </p>
                </form>
            </CardContent>      
        </Card>
    );
}