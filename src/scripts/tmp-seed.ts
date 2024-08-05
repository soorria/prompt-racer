import { invariant } from "@epic-web/invariant"

import { db, schema } from "~/lib/db"

async function main() {
  const [testSource] = await db
    .insert(schema.questionSources)
    .values({
      type: "ai",
    })
    .returning()
  invariant(testSource, "test source should have been created")

  const [question] = await db
    .insert(schema.questions)
    .values({
      source_id: testSource.id,
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
}

main().finally(() => process.exit(0))
