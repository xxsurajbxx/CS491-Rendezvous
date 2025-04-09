import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type PopupProps = {
  isOpen: boolean
  setIsOpen(status :boolean): void
  message: string
}

export const Popup = ({message}: PopupProps) => {

  return(
    <Card>
      <Button onClick={}>X</Button>
      {message}
    </Card>
  )
}