import { cmp, db, schema } from "../db"

export async function upsertProfile(userId: string) {
  await db
    .insert(schema.users)
    .values({
      id: userId,
    })
    .onConflictDoNothing()
}

export async function getUserProfile(userId: string) {
  const profile = await db.query.users.findFirst({
    where: cmp.eq(schema.users.id, userId),
  })

  return profile
}
