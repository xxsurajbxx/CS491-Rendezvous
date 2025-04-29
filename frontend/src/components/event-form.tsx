"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import dayjs from "dayjs"
import "@geoapify/geocoder-autocomplete/styles/minimal.css"
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from "@geoapify/react-geocoder-autocomplete"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, LinkIcon, MapPin, Info, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { getTokenPayload } from "../../utils/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
// import Image from 'next/image';

// Replace the form schema definition with this updated version that includes all fields
const formSchema = z.object({
  name: z.string().min(1, { message: "Event name is required" }),
  startDateTime: z.string().min(1, { message: "Start date and time are required" }),
  endDateTime: z
    .string()
    .min(1, { message: "End date and time are required" })
    .refine((date) => date !== "", { message: "End date and time are required" }),
  isPublic: z.enum(["true", "false"]).transform((val) => val === "true").default("true"),
  ticketmasterLink: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  description: z.string().optional(),
  // Add these fields to the schema even though we'll validate them separately
  location: z.string().optional(),
  // image: z.any().optional(), // Using z.any() for the file input
})


// And use this instead
type FormValues = z.infer<typeof formSchema>

type SelectedPlace = {
  geometry?: {
    coordinates?: [number, number]; // [longitude, latitude]
  };
  properties: {
    formatted: string;
  };
};

export const EventForm = () => {
  const [hostId, setHostId] = useState<number | null>(null)
  const [location, setLocation] = useState("")
  const [coordinates, setCoordinates] = useState<{ lat: number | null; lon: number | null }>({ lat: null, lon: null })
  const [isLocationValid, setIsLocationValid] = useState(true)
  const [locationTouched, setLocationTouched] = useState(false)
  const router = useRouter();
  // const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startDateTime: "",
      endDateTime: "",
      isPublic: undefined,
      ticketmasterLink: "",
      description: "",
      location: "",
      // image: null,
    },
  })

  // Handle location input
  const handleInputChange = (input: string) => {
    setLocation(input)
    setIsLocationValid(false)
    setLocationTouched(true)
    setCoordinates({lat: null, lon: null});
  }

  // Handle place selection from Geoapify
  const handlePlaceSelect = (selectedPlace: SelectedPlace) => {
    if (selectedPlace?.geometry?.coordinates) {
      const [longitude, latitude] = selectedPlace.geometry.coordinates
      setCoordinates({ lat: latitude, lon: longitude })
      setLocation(selectedPlace.properties.formatted)
      setIsLocationValid(true)
    } else {
      setIsLocationValid(false)
    }
  }

  // Handle image preview
  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0] || null

  //   if (file) {
  //     const reader = new FileReader()
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result as string)
  //     }
  //     reader.readAsDataURL(file)
  //   } else {
  //     setImagePreview(null)
  //   }
  // }

  const getUserId = async () => {
    try {
      const result = await getTokenPayload()
      console.log('token payload:', result)
      if (result) {
        setHostId(Number(result.userId))
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    // Check if location is valid
    if (!isLocationValid || !location) {
      setLocationTouched(true)
      return
    }

    // Check if end date is after start date
    if (dayjs(data.startDateTime).isAfter(dayjs(data.endDateTime))) {
      form.setError("endDateTime", {
        type: "manual",
        message: "End date must be after start date",
      })
      return
    }

    // Form submission logic
    console.log({
      ...data,
      location,
      latitude: coordinates.lat,
      longitude: coordinates.lon,
      hostUserID: hostId,
      startDateTime: dayjs(data.startDateTime).format('YYYY-MM-DD HH:mm:ss'),
      endDateTime: dayjs(data.endDateTime).format('YYYY-MM-DD HH:mm:ss')
    })

    // Prepare form data
    const formData = {
      ...data,
      location,
      latitude: coordinates.lat,
      longitude: coordinates.lon,
      hostUserID: hostId,
      startDateTime: dayjs(data.startDateTime).format('YYYY-MM-DD HH:mm:ss'),
      endDateTime: dayjs(data.endDateTime).format('YYYY-MM-DD HH:mm:ss')
    }

    try {
      const token = await getTokenPayload();
      if (!token) throw new Error("Error occured while fetching the jwt token");
      if (!token.isVerified) throw new Error("User cannot create event becuase they are not verified")

      const response = await fetch('http://localhost:8080/api/events/', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      if(!response.ok){
        throw new Error("Failed to create event.");
      }
      const json = await response.json();

      //alert("Form submitted successfully!");
      toast.success("Successfully created event.");
      router.push(`/events/${json.eventID}`);
      /*
      form.reset();
      setLocation("");
      setCoordinates({ lat: null, lon: null });
      setIsLocationValid(true);
      setLocationTouched(false);
      */
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create event.");
    }

    // For demo purposes, just show a success message
    // alert("Form submitted successfully!")
  }

  useEffect(() => {

    if (!hostId) {
      getUserId()
    }
  })

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Event</CardTitle>
          <CardDescription>Fill in the details below to create a new event.</CardDescription>
        </CardHeader>
        <CardContent>
          <GeoapifyContext apiKey={process.env.NEXT_PUBLIC_GEOAPIFY_KEY}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Event Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location Field */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location <span className="text-destructive">*</span>
                  </Label>
                  <div className="geocoder-container w-full">
                    <GeoapifyGeocoderAutocomplete
                      placeholder="Enter address here"
                      lang="en"
                      value={location}
                      limit={5}
                      onUserInput={handleInputChange}
                      placeSelect={handlePlaceSelect}
                    />
                  </div>
                  {!isLocationValid && locationTouched && (
                    <p className="text-sm font-medium text-destructive mt-2">
                      Please select a valid location from the suggestions.
                    </p>
                  )}
                </div>

                {/* Date & Time Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Date & Time */}
                  <FormField
                    control={form.control}
                    name="startDateTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          Start Date & Time <span className="text-destructive">*</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  dayjs(field.value).format("MMM D, YYYY h:mm A")
                                ) : (
                                  <span>Pick a date and time</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  const currentTime = field.value
                                    ? dayjs(field.value).format("HH:mm")
                                    : dayjs().format("HH:mm")

                                  const [hours, minutes] = currentTime.split(":")
                                  const newDate = dayjs(date)
                                    .hour(Number.parseInt(hours, 10))
                                    .minute(Number.parseInt(minutes, 10))

                                  field.onChange(newDate.toISOString())
                                }
                              }}
                              initialFocus
                            />
                            <div className="p-3 border-t border-border">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="time"
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      const [hours, minutes] = e.target.value.split(":")
                                      const date = field.value ? dayjs(field.value) : dayjs()

                                      const newDate = date
                                        .hour(Number.parseInt(hours, 10))
                                        .minute(Number.parseInt(minutes, 10))

                                      field.onChange(newDate.toISOString())
                                    }
                                  }}
                                  value={field.value ? dayjs(field.value).format("HH:mm") : ""}
                                  className="w-full"
                                />
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* End Date & Time */}
                  <FormField
                    control={form.control}
                    name="endDateTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          End Date & Time <span className="text-destructive">*</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  dayjs(field.value).format("MMM D, YYYY h:mm A")
                                ) : (
                                  <span>Pick a date and time</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  const currentTime = field.value
                                    ? dayjs(field.value).format("HH:mm")
                                    : dayjs().format("HH:mm")

                                  const [hours, minutes] = currentTime.split(":")
                                  const newDate = dayjs(date)
                                    .hour(Number.parseInt(hours, 10))
                                    .minute(Number.parseInt(minutes, 10))

                                  field.onChange(newDate.toISOString())
                                }
                              }}
                              initialFocus
                            />
                            <div className="p-3 border-t border-border">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="time"
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      const [hours, minutes] = e.target.value.split(":")
                                      const date = field.value ? dayjs(field.value) : dayjs()

                                      const newDate = date
                                        .hour(Number.parseInt(hours, 10))
                                        .minute(Number.parseInt(minutes, 10))

                                      field.onChange(newDate.toISOString())
                                    }
                                  }}
                                  value={field.value ? dayjs(field.value).format("HH:mm") : ""}
                                  className="w-full"
                                />
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Event Privacy radio buttons */}
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Privacy
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          className="flex flex-row space-x-1"
                          onValueChange={field.onChange}
                          defaultValue="true"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="public" />
                            <Label htmlFor="public">Public</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="private" />
                            <Label htmlFor="private">Private</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Ticketmaster Link (Optional) */}
                <FormField
                  control={form.control}
                  name="ticketmasterLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
                        Ticketmaster Link (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="Enter Ticketmaster link" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description (Optional) */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Description (Optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter event description" className="min-h-[120px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload (Optional) */}
                {/* <div className="space-y-2">
                  <Label htmlFor="image" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Image (Optional)
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <Input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={(e) => {
                        form.setValue("image", e.target.files)
                        handleImageChange(e)
                      }}
                      className="w-full"
                    />
                    {imagePreview && (
                      <div className="border rounded-md overflow-hidden h-32 w-full">
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div> */}
                {/* Submit Button */}
                <Button type="submit" className="w-full bg-purple-900">
                  Create Event
                </Button>
              </form>
            </Form>
          </GeoapifyContext>
        </CardContent>
      </Card>
    </div>
  )
}



