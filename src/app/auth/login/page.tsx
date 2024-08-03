"use client"

import { loginWithGitHubAction } from "~/lib/auth/actions"

export default function LoginPage() {
  return (
    <button
      onClick={async () => {
        await loginWithGitHubAction()
      }}
    >
      sick login button
    </button>
  )
}
