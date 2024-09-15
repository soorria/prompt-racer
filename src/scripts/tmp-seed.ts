import { invariant } from "@epic-web/invariant"
import { faker } from "@faker-js/faker"

import type { Doc } from "~/lib/db/types"
import { cmp, db, schema } from "~/lib/db"

async function getAISourceId() {
  const source = await db.query.questionSources.findFirst({
    where: cmp.eq(schema.questionSources.type, "ai"),
  })

  if (source) {
    return source.id
  }

  const [testSource] = await db
    .insert(schema.questionSources)
    .values({
      type: "ai",
    })
    .returning()
  invariant(testSource, "test source should have been created")

  return testSource.id
}

async function main() {
  const sourceId = await getAISourceId()

  const [question] = await db
    .insert(schema.questions)
    .values({
      source_id: sourceId,
      title: "TEST QUESTION",
      description: "identity function",
      difficulty: "easy",
      starterCode: `def solution(x):\n  pass`,
    })
    .returning()
  invariant(question, "question should have been created")

  await db.insert(schema.questionTestCases).values([
    {
      question_id: question.id,
      type: "public",
      args: [1],
      expectedOutput: 1,
    },
    {
      question_id: question.id,
      type: "hidden",
      args: [2],
      expectedOutput: 2,
    },
  ])

  const fakeUsers: Doc<"users">[] = []
  for (let i = 0; i < 100; i++) {
    const name = faker.person.firstName()
    fakeUsers.push({
      id: faker.string.uuid(),
      wins: Math.round(Math.random() * 100),
      gamesPlayed: Math.round(Math.random() * 200),
      name: name,
      profile_image_url: faker.image.avatar(),
      created_at: faker.date.past(),
    })
  }

  await db.insert(schema.users).values(fakeUsers)
}

void main()
  .then(() => {
    console.log("✅ Finished seeding!")
  })
  .catch((e) => {
    console.log("❌ Failed to seed users")
    console.error(e)
    process.exit(1)
  })
  .finally(() => process.exit(0))
