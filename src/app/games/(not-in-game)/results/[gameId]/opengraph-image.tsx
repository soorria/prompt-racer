/* eslint-disable @next/next/no-img-element -- Cannot use <Image /> becuase we are in a ImageResponse context*/
import { ImageResponse } from "next/og"

import { db } from "~/lib/db"
import { type Doc } from "~/lib/db/types"
import { getTop3Players } from "~/lib/games/queries"

export const alt = "Game Statistics"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

type PlayerCardProps = {
  player: Pick<Doc<"userProfiles">, "name" | "profile_image_url"> | undefined
  position: 1 | 2 | 3
}

const PlayerAvatar = ({
  imageUrl,
  name,
  size,
}: {
  imageUrl: string | null
  name: string
  size?: number
}) => (
  <div
    style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "9999px",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#4B5563",
      boxShadow: "0 0 10px 0px grey",
    }}
  >
    <img
      src={imageUrl ?? undefined}
      alt={name}
      width={size}
      height={size}
      style={{
        objectFit: "cover",
      }}
    />
  </div>
)

const PlayerName = ({
  name,
  fontSize = "28px",
  isBold = false,
}: {
  name: string
  fontSize?: string
  isBold?: boolean
}) => (
  <div
    style={{
      fontSize,
      fontWeight: isBold ? "bolder" : 500,
      maxWidth: "90%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontFamily: "Inter",
    }}
  >
    {name}
  </div>
)

const PlayerCard = ({ player, position }: PlayerCardProps) => {
  const cardStyles = {
    1: {
      width: "320px",
      height: "280px",
      backgroundColor: "#EAB308",
      marginLeft: "-160px",
      zIndex: 3,
      avatarSize: 100,
      fontSize: "32px",
      isBold: true,
    },
    2: {
      width: "280px",
      height: "240px",
      backgroundColor: "#9CA3AF",
      marginLeft: "-420px",
      zIndex: 2,
      avatarSize: 90,
      fontSize: "28px",
      isBold: false,
    },
    3: {
      width: "280px",
      height: "240px",
      backgroundColor: "#D07343",
      marginLeft: "140px",
      zIndex: 1,
      avatarSize: 90,
      fontSize: "28px",
      isBold: false,
    },
  }[position]

  return (
    <div
      style={{
        position: "absolute",
        width: cardStyles.width,
        height: cardStyles.height,
        backgroundColor: cardStyles.backgroundColor,
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        color: "white",
        left: "50%",
        marginLeft: cardStyles.marginLeft,
        zIndex: cardStyles.zIndex,
      }}
    >
      {player ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <PlayerAvatar
            imageUrl={player.profile_image_url}
            name={player.name}
            size={cardStyles.avatarSize}
          />
          <PlayerName
            name={player.name}
            fontSize={cardStyles.fontSize}
            isBold={cardStyles.isBold}
          />
        </div>
      ) : (
        <span style={{ fontSize: "44px" }}>-</span>
      )}
    </div>
  )
}

async function loadFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}&display=swap&text=${encodeURIComponent(text)}`
  const css = await (await fetch(url)).text()
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)

  if (resource) {
    const response = await fetch(resource[1]!)
    if (response.status == 200) {
      return await response.arrayBuffer()
    }
  }

  throw new Error("failed to load font data")
}

export default async function Image({ params }: { params: { gameId: string } }) {
  const { players, gameMode } = await getTop3Players(db, params.gameId)

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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              fontSize: "48px",
              color: "white",
              fontWeight: 500,
              fontFamily: "Fugaz One",
            }}
          >
            PROMPT
            <span style={{ color: "#22c55e" }}>RACER</span>
            <span style={{ marginLeft: "10px" }}>- Leaderboard</span>
          </div>
          <div
            style={{
              padding: "6px 16px",
              borderRadius: "9999px",
              fontSize: "16px",
              fontWeight: "500",
              backgroundColor:
                gameMode === "easy" ? "#22c55e" : gameMode === "medium" ? "#eab308" : "#ef4444",
              color: gameMode === "hard" ? "white" : "black",
              textTransform: "capitalize",
            }}
          >
            {gameMode + " Question"}
          </div>{" "}
        </div>

        {/* Cards Container */}
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            height: "320px",
          }}
        >
          <PlayerCard position={2} player={players[1]?.user} />
          <PlayerCard position={3} player={players[2]?.user} />
          <PlayerCard position={1} player={players[0]?.user} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: await loadFont(
            "Inter",
            players.reduce((acc, cur) => acc + cur.user.name, ""),
          ),
          weight: 400,
          style: "normal",
        },
        {
          name: "Fugaz One",
          data: await loadFont(
            "Fugaz One",
            "PROMPTRACER - Leaderboard" + "Easy Medium Hard Question",
          ),
          style: "normal",
          weight: 400,
        },
      ],
    },
  )
}
