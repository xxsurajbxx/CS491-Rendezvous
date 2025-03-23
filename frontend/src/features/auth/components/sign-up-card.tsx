import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SignInFlow } from "../types";
import { useState } from "react";
import { TriangleAlert } from "lucide-react";
//import { useAuthActions } from "@convex-dev/auth/react";

interface SignUpCardProps {
    setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({setState}: SignUpCardProps) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);
    //const { signIn } = useAuthActions();

    const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!firstName){
            setError("First name is required");
            return;
        }
        if(!lastName){
            setError("Last name is required");
            return;
        }
        if(password !== confirmPassword){
            setError("Passwords do not match");
            return;
        }
        if(!password){
            setError("Password is required");
            return;
        }
        if(password.length < 8){
            setError("Password must have at least 8 characters");
            return;
        }

        setPending(true);
    }
    
    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                    Sign up to continue
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
                <form onSubmit={onPasswordSignUp} className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2.5">
                        <Input disabled={pending} value={firstName} onChange={(e) => { setFirstName(e.target.value)}} placeholder="First name" required/>
                        <Input disabled={pending} value={lastName} onChange={(e) => { setLastName(e.target.value)}} placeholder="Last name" required/>
                    </div>
                    <Input disabled={pending} value={email} onChange={(e) => {setEmail(e.target.value)}} placeholder="Email" type="email" required/>
                    <Input disabled={pending} value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="Password" type="password" required/>
                    <Input disabled={pending} value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}} placeholder="Confirm password" type="password" required/>
                    <Button type="submit" className="w-full" size="lg" disabled={false}>
                        Continue
                    </Button>
                    <Separator/>
                    <p className="text-xs text-muted-foreground">
                        Already have an account? <span onClick={() => {setState("signIn")}} className="text-sky-700 hover:underline cursor-pointer">Sign in</span>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}