import { createInterface } from "node:readline/promises"

import { db, schema } from "~/lib/db"
import { sleep } from "~/lib/utils/sleep"

async function ask(question: string) {
  const rl = createInterface(process.stdin)
  const answer = await rl.question(question)
  return answer
}

async function main() {
  const answer = await ask("Are you sure you want to reset the database? [yes] ")

  if (answer !== "yes") {
    return
  }

  const answer2 = await ask("Are you REALLY sure you want to reset the database? [YES] ")

  if (answer2 !== "YES") {
    return
  }

  console.log("Deleting game data in 10s...")

  await sleep(10_000)

  console.log("Deleting game data...")

  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await db.delete(schema.gameStates)
  // eslint-disable-next-line drizzle/enforce-update-with-where
  await db.update(schema.userProfiles).set({
    wins: 0,
    gamesPlayed: 0,
  })

  console.log("Done!")
}

main()
  .catch((e) => {
    console.error("FAILED", e)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
