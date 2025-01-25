// app/api/og/route.ts
import { createHash } from "crypto"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import chrome from "@sparticuz/chromium"
import puppeteer from "puppeteer-core"

const getChromePath = async () => {
  if (process.env.NODE_ENV === "production") {
    return await chrome.executablePath()
  }
  if (process.platform === "darwin") {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  }
  return "/usr/bin/google-chrome"
}

const isValidHtml = (html: string): boolean => {
  const dangerous = /<script|javascript:|onerror=|onload=|onclick=|data:/i
  return !dangerous.test(html)
}

export async function POST(request: NextRequest) {
  let browser = null
  let page = null

  try {
    const body = await request.json()
    const html = body.html

    if (!html || typeof html !== "string") {
      return new NextResponse("Missing or invalid html in request body", { status: 400 })
    }

    if (!isValidHtml(html)) {
      return new NextResponse("Invalid HTML content", { status: 400 })
    }

    const cacheKey = createHash("sha256").update(html).digest("hex")
    const headers = {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: `"${cacheKey}"`,
    }

    browser = await puppeteer.launch({
      executablePath: await getChromePath(),
      args: [
        ...chrome.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
      defaultViewport: {
        width: 255,
        height: 255,
      },
      headless: "new",
    })

    page = await browser.newPage()

    // Wait for page to be ready before setting CSP
    await page.setJavaScriptEnabled(false)

    // Set content first
    await page.setContent(html, {
      waitUntil: ["networkidle0", "load"],
      timeout: 30000,
    })

    // Take screenshot before closing anything
    const screenshot = await page.screenshot({
      type: "png",
      fullPage: false,
    })

    // Return the image
    return new NextResponse(screenshot, { headers })
  } catch (error) {
    console.error("Error generating image:", error)
    return new NextResponse(`Error generating image: ${error.message}`, { status: 500 })
  } finally {
    // Clean up resources in reverse order
    if (page) {
      try {
        await page.close()
      } catch (e) {
        console.error("Error closing page:", e)
      }
    }
    if (browser) {
      try {
        await browser.close()
      } catch (e) {
        console.error("Error closing browser:", e)
      }
    }
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "2mb",
    },
  },
}

export const maxDuration = 60
