"use client"
import { loginWithGitHubAction } from "~/lib/auth/actions"

export default function Login() {
  return (
    <div>
      Login
      <button onClick={() => loginWithGitHubAction()}>Login with GitHub</button>
    </div>
  )
}
