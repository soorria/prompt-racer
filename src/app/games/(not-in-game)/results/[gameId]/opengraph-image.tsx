import { ImageResponse } from "next/og"

export const runtime = "server"

export const alt = "Game Statistics"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default async function Image({ params }: { params: { gameId: string } }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#120F0E",
          padding: "40px",
          gap: "32px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            fontSize: "48px",
            color: "white",
            fontWeight: 500,
          }}
        >
          PROMPT
          <span style={{ color: "#0EA5E9" }}>RACER </span> - Results
        </div>

        {/* Cards Container */}
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            height: "380px", // Reduced height
          }}
        >
          {/* Card 3 (rightmost) - render first, lowest z-index */}
          <div
            style={{
              position: "absolute",
              width: "280px", // Reduced width
              height: "320px", // Reduced height
              backgroundColor: "#1f2937",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              color: "white",
              left: "50%",
              marginLeft: "140px", // Adjusted position
              zIndex: 1,
            }}
          >
            3
          </div>

          {/* Card 2 (leftmost) - render second, middle z-index */}
          <div
            style={{
              position: "absolute",
              width: "280px", // Reduced width
              height: "320px", // Reduced height
              backgroundColor: "#1f2937",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              color: "white",
              left: "50%",
              marginLeft: "-420px", // Adjusted position
              zIndex: 2,
            }}
          >
            2
          </div>

          {/* Card 1 (Center, larger) - render last, highest z-index */}
          <div
            style={{
              position: "absolute",
              width: "320px", // Reduced width
              height: "380px", // Reduced height
              backgroundColor: "#374151",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              color: "white",
              left: "50%",
              marginLeft: "-160px", // Adjusted position
              zIndex: 3,
            }}
          >
            1
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
