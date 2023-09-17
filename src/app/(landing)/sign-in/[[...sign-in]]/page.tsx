import { SignIn } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="h-full grid place-content-center place-items-center">
      <SignIn signUpUrl="/sign-up" />
    </div>
  )
}
