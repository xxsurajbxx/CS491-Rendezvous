import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SignInFlow } from "../types";
import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { setTokenCookie, getTokenPayload } from "../../../../utils/auth";
import { useRouter } from "next/navigation";
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from "@geoapify/react-geocoder-autocomplete"
//import { useAuthActions } from "@convex-dev/auth/react";

interface SignUpCardProps {
    setState: (state: SignInFlow) => void;
}

type SelectedPlace = {
    geometry?: {
      coordinates?: [number, number]; // [longitude, latitude]
    };
    properties: {
      formatted: string;
    };
  };

export const SignUpCard = ({setState}: SignUpCardProps) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);
    const router = useRouter();
    //const { signIn } = useAuthActions();

    // Handle location input
    const handleInputChange = (input: string) => {
        setAddress(input);
    }

    // Handle place selection from Geoapify
    const handlePlaceSelect = (selectedPlace: SelectedPlace) => {
        if (selectedPlace?.geometry?.coordinates) {
            setAddress(selectedPlace.properties.formatted)
        }
    }

    const sendVerificationCode = async () => {
        try {
            const token = await getTokenPayload();
            if (!token) throw new Error("Error occurred while getting token.");

            const response = await fetch("http://localhost:8080/api/verify/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: token.userId,
                    email: token.email,
                }),
            });
            
        } catch (error) {
            console.error(error);
        }
    }

    const onPasswordSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!firstName){
            setError("First name is required");
            return
        }
        if(!lastName){
            setError("Last name is required");
        }
        if(!username){
            setError("Username is required");
            return;
        }
        if(!address){
            setError("Address is required")
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

        try {
            const response = await fetch("http://localhost:8080/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, username, email, address, password }),
            });
            const data = await response.json();
            if(data.status === "fail" || !response.ok){
                throw new Error(data.message || "Failed to sign up");
            }
                try {
                    const response = await fetch("http://localhost:8080/api/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, username, address, password }),
                    });
                    const data = await response.json();
                    if(data.status === "fail" || !response.ok){
                        throw new Error(data.message || "Incorrect username or password");
                    }

                    const cookieStatus = await setTokenCookie(data.token);
                    if (!cookieStatus) {
                        throw new Error("Something went wrong with logging in");
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
                <GeoapifyContext apiKey={process.env.NEXT_PUBLIC_GEOAPIFY_KEY}>
                    <form onSubmit={onPasswordSignUp} className="space-y-2.5">
                        <div className="grid grid-cols-2 gap-2.5">
                            <Input disabled={pending} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
                            <Input disabled={pending} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
                        </div>
                        <Input disabled={pending} value={username} onChange={(e) => { setUsername(e.target.value)}} placeholder="Username" required/>
                        <Input disabled={pending} value={email} onChange={(e) => {setEmail(e.target.value)}} placeholder="Email" type="email" required/>
                        <div className="relative space-y-2">
                            <div className="geocoder-container w-full rel">
                                <GeoapifyGeocoderAutocomplete
                                    placeholder="Address"
                                    lang="en"
                                    value={address}
                                    limit={5}
                                    onUserInput={handleInputChange}
                                    placeSelect={handlePlaceSelect}
                                />
                            </div>
                        </div>
                        
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
                </GeoapifyContext>
            </CardContent>
        </Card>
    );
}