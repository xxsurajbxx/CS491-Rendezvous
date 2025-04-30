import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"

interface PopupProps {
  setShowPopup(status: boolean): void
}

export const VerifyPopup = ({ setShowPopup }: PopupProps) => {
  const router = useRouter()

  const handleCodeVerificationRedirect = () => {
    setShowPopup(false)
    router.push("/verify")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card className="relative p-6 text-center space-y-4 max-w-sm w-full bg-white rounded-lg shadow-lg">
        <Button
          onClick={() => setShowPopup(false)}
          className="absolute top-2 right-2"
          variant="ghost"
        >
          <X className="h-4 w-4" />
        </Button>
        <p className="text-sm text-gray-700">
          A verification code has been sent to your email. Verify to unlock all features of the app.
        </p>
        <Button onClick={handleCodeVerificationRedirect} className="w-full bg-purple-900">
          Verify Now
        </Button>
      </Card>
    </div>
  )
}