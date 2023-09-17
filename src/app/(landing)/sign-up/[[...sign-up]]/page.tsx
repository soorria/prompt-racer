import { SignUp } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="h-full grid place-content-center place-items-center">
      <div className="px-6 pb-12 pt-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">Join Our Community!</h2>
          <p className="mt-6 text-lg leading-8 text-gray-500">
            Sign up now to gain exclusive access to our platform. Experience the best, be a part of
            our community.
          </p>
        </div>
      </div>
      <SignUp signInUrl="/sign-in" />
    </div>
  )
}
