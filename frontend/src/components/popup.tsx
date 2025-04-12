import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface PopupProps {
  isOpen: boolean
  setIsOpen(status: boolean): void
  message: string
}

export const Popup = ({message}: PopupProps) => {

  return(
    <Card>
      <Button>X</Button>
      {message}
    </Card>
  )
}