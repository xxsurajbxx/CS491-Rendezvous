import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { setTokenCookie } from "../../../../utils/auth";
import { getTokenPayload } from "../../../../utils/auth";
//import { useAuthActions } from "@convex-dev/auth/react";
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from "@geoapify/react-geocoder-autocomplete";
import { toast } from "sonner";

type SelectedPlace = {
    geometry?: {
      coordinates?: [number, number]; // [longitude, latitude]
    };
    properties: {
      formatted: string;
    };
  };

interface CurrentUserData {
    firstName?: string,
    lastName?: string,
    Address?: string,
    Description?: string,
    Email?: string,
    UserID?: number,
    Username?: string
}


export const EditProfileForm = () => {
    const [currentUserData, setCurrentUserData] = useState<CurrentUserData>();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const router = useRouter();

    // Handle location input
    const handleInputChange = (input: string) => {
        setAddress(input)
        // setIsLocationValid(false)
        // setLocationTouched(true)
    }

    // Handle place selection from Geoapify
    const handlePlaceSelect = (selectedPlace: SelectedPlace) => {
        if (selectedPlace?.geometry?.coordinates) {
            setAddress(selectedPlace.properties.formatted)
            // setIsLocationValid(true)
        } else {
            // setIsLocationValid(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(password !== confirmPassword){
            toast.error("Passwords do not match");
            return;
        }
        if(password !== "" && password.length < 8){
            toast.error("Password must have at least 8 characters");
            return;
        }

        try {
            // retrieve token from cookies to get userId
            const token = await getTokenPayload();
            if (!token) throw new Error('Failed to retrieve token from cookies.');
            // console.log(`${firstName} ${lastName}`);

            const response = await fetch(`http://localhost:8080/api/update-profile/${token?.userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    address: address,
                    description: description,
                    currentPassword: password,
                    newPassword: confirmPassword
                }),
            });
            const data = await response.json();
            if(data.status === "fail" || !response.ok){
                throw new Error(data.message);
            }
            // console.log(data)
            toast.success("Profile information updated.")
            router.push(`/users/${token.userId}`)
        }
        catch (error) {
            console.log('Error occurred while editing profile information.', error)
        }
    }

    useEffect(() => {
        const getUserData = async () => {
            try {
                // retrieve token from cookies to get userId
                const token = await getTokenPayload();
                if (!token) throw new Error('Failed to retrieve token from cookies.');

                const response = await fetch(`http://localhost:8080/api/user/${token?.userId}/data`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
                const result = await response.json();
                if(result.status === "fail" || !response.ok){
                    throw new Error(result.message);
                }
                // console.log(result.data.user);
                const fullName = result.data.user.Name;
                const [firstName, lastName] = fullName.split(" ");
                // console.log(firstName, lastName);

                if (result.data.user) setCurrentUserData({...result.data.user, firstName: firstName, lastName: lastName});
            } catch (error) {
                console.error(error);
            }
        }

        getUserData();
        // console.log(currentUserData);
    }, [])
    
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
            <CardContent className="space-y-5 px-0 pb-0">
                <GeoapifyContext apiKey={process.env.NEXT_PUBLIC_GEOAPIFY_KEY}>
                    <form onSubmit={handleSubmit} className="space-y-2.5">
                        <div className="grid grid-cols-2 gap-2.5">
                            <Input value={firstName} onChange={(e) => {setFirstName(e.target.value)}} placeholder={currentUserData?.firstName} />
                            <Input value={lastName} onChange={(e) => {setLastName(e.target.value)}} placeholder={currentUserData?.lastName} />
                        </div>
                        <Input value={username} onChange={(e) => {setUsername(e.target.value)}} placeholder={currentUserData?.Username} type="text" />
                        <Input value={email} onChange={(e) => {setEmail(e.target.value)}} placeholder={currentUserData?.Email} type="email" />
                        <Input value={currentPassword} onChange={(e) => {setCurrentPassword(e.target.value)}} placeholder="Current password" type="password" />
                        <Input value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="New password" type="password" />
                        <Input value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}} placeholder="Confirm new password" type="password" />
                        <Separator className="my-5" />
                        <div className="space-y-2 relative">
                            <div className="geocoder-container w-full relative">
                                <GeoapifyGeocoderAutocomplete
                                    placeholder={currentUserData?.Address}
                                    lang="en"
                                    value={address}
                                    limit={5}
                                    onUserInput={handleInputChange}
                                    placeSelect={handlePlaceSelect}
                                />
                            </div>
                        </div>
                        <Textarea value={description} onChange={(e) => {setDescription(e.target.value)}} placeholder={currentUserData?.Description} className="min-h-[120px]" />
                        <Button type="submit" className="w-full" size="lg" disabled={false}>
                            Submit
                        </Button>
                    </form>
                </GeoapifyContext>
            </CardContent>
        </Card>
    );
}