import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { setTokenCookie } from "../../../../utils/auth";
import { useRouter } from "next/navigation";
//import { useAuthActions } from "@convex-dev/auth/react";


export const EditProfileForm = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);
    const router = useRouter();
    //const { signIn } = useAuthActions();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(password !== confirmPassword){
            setError("Passwords do not match");
            return;
        }
        if(password.length < 8){
            setError("Password must have at least 8 characters");
            return;
        }

        setPending(true);

        try {
            const response = await fetch("http://localhost:8080/api/profile/edit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });
            const data = await response.json();
            if(data.status === "fail" || !response.ok){
                throw new Error(data.message || "Failed to sign up");
            }
                try {
                    const response = await fetch("http://localhost:8080/api/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password }),
                    });
                    const data = await response.json();
                    if(data.status === "fail" || !response.ok){
                        throw new Error(data.message);
                    } else {

                    }

                    const cookieStatus = await setTokenCookie(data.token);
                    if (!cookieStatus) {
                        throw new Error("Something went wrong while editing profile information.");
                    }
                    router.replace("/");
                }
                catch (error) {
                    if (error instanceof Error) {
                        setError(error.message); // Use the error message from the Error object
                    } else {
                        setError("An unexpected error occurred"); // Fallback in case the error is not an instance of Error
                    }
                    router.replace("/auth");
                }
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
                    Edit profile
                </CardTitle>
                <CardDescription>
                    Leave blank the information you do not want changed.
                </CardDescription>
            </CardHeader>
            {!!error && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                    <TriangleAlert className="size-4" />
                    <p>{error}</p>
                </div>
            )}
            <CardContent className="space-y-5 px-0 pb-0">
                <form onSubmit={onSubmit} className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2.5">
                        <Input disabled={pending} value={firstName} onChange={(e) => {setFirstName(e.target.value)}} placeholder="New first name" />
                        <Input disabled={pending} value={lastName} onChange={(e) => {setLastName(e.target.value)}} placeholder="New last name" />
                    </div>
                    <Input disabled={pending} value={email} onChange={(e) => {setEmail(e.target.value)}} placeholder="New email" type="email" />
                    <Input disabled={pending} value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="New password" type="password" />
                    <Input disabled={pending} value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}} placeholder="Confirm new password" type="password" />
                    <Button type="submit" className="w-full" size="lg" disabled={false}>
                        Submit
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}