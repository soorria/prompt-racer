"use client"
import { useMutation } from "convex/react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { api } from "~convex/api"

type AdminStuffPageProps = {}

const AdminStuffPage = (props: AdminStuffPageProps) => {
  const seedQuestions = useMutation(api.questions.seedQuestions)

  return (
    <div className="max-w-md w-full mx-auto py-8">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const password = new FormData(e.currentTarget).get("password") as string
          seedQuestions({ password })
        }}
        className="space-y-2"
      >
        <Label htmlFor="seed-password">Seed questions</Label>
        <div className="flex items-center gap-4">
          <Input id="seed-password" name="password" type="password" required className="flex-1" />
          <Button variant="default">Seed</Button>
        </div>
      </form>
    </div>
  )
}

export default AdminStuffPage
