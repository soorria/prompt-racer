"use client"

import { useState } from "react"

import type { LoginOAuthProvider } from "~/lib/auth/oauth-providers"
import Logo from "~/components/nav-bar/Logo"
import { Button } from "~/components/ui/button"
import { loginWithOAuthAction } from "~/lib/auth/actions"
import { LOGIN_OAUTH_PROVIDERS } from "~/lib/auth/oauth-providers"
import { entries } from "~/lib/utils/object"

export default function LoginPage() {
  const [selectedProvider, setSelectedProvider] = useState<LoginOAuthProvider | null>(null)
  return (
    <>
      <div className="mt-20 py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Logo className="justify-center text-3xl" />
          <p className="mt-6 text-center text-lg leading-8 text-gray-400">
            Please sign up to create a new account or log in if you already have one to put your
            prompts to the test!
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-card p-6 shadow sm:rounded-lg">
            <div className="grid gap-4">
              {entries(LOGIN_OAUTH_PROVIDERS).map(([provider, { label, icon: Icon }]) => {
                return (
                  <Button
                    key={provider}
                    variant="tertiary"
                    isLoading={selectedProvider === provider}
                    disabled={Boolean(selectedProvider && selectedProvider !== provider)}
                    onClick={() => {
                      setSelectedProvider(provider)
                      void loginWithOAuthAction(provider)
                    }}
                  >
                    <Icon className="sq-5" />
                    Sign in with {label}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
