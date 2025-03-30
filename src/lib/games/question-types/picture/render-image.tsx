import "server-only"

export async function renderHtmlToImage(args: { html: string; size: number }): Promise<Blob> {
  const response = await fetch("https://server-render-image.vercel.app/api/render-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  })

  if (!response.ok) {
    console.error(await response.text())
    throw new Error("Failed to render image")
  }

  const imageBlob = await response.blob()

  return imageBlob
}

export function wrapUserHtmlForImage(html: string): string {
  return `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0;">
<style>body { margin: 0 }</style>
${html}
</body>
</html>
`.trim()
}
