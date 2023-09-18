import { v } from "convex/values"
import { internalQuery, mutation, query } from "./_generated/server"
import { questionsFromRelevance } from "./utils/questions.data"

export const seedQuestions = mutation({
  args: {
    password: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.password !== process.env.SEED_PASSWORD) {
      return
    }

    await Promise.all(
      questionsFromRelevance.map((question) => {
        const { document_id, insert_date_, ...rest } = question

        ctx.db.insert("question", {
          ...rest,
          source: {
            type: "ai",
            link: {
              title: "Relevance AI",
              url: "https://relevanceai.com",
            },
          },
        })
      })
    )
  },
})

export const getQuestionIds = internalQuery({
  handler: async (ctx) => {
    return (await ctx.db.query("question").collect()).map((d) => d._id)
  },
})
