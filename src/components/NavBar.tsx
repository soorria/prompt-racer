"use client"
import React from "react"
import { Button } from "./ui/button"
import { ModeToggle } from "./ModeToggle"
import { Fugaz_One } from "next/font/google"
import { SignInButton } from "@clerk/nextjs"
import AuthButton from "./AuthButton"
import { useAction, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"

const Fugaz = Fugaz_One({ weight: "400", subsets: ["latin"] })

type Props = {}

export default function NavBar({}: Props) {
  return (
    <div className="flex-row justify-between flex px-5 py-5 bg-card items-center rounded-xl h-20">
      <div className={"font-display"}>
        <div className="text-xl flex flex-row">
          PROMPT<div className="text-primary">RACER</div>
        </div>
      </div>
      {/* <ModeToggle /> */}
      <AuthButton />
    </div>
  )
}
