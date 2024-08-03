import { relations, sql } from "drizzle-orm"
import { index, integer, jsonb, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

const customTypes = {
  primaryKey: (name: string) => text(name).primaryKey(),
}

export const users = pgTable(
  "users",
  {
    /**
     * Supabase auth user id
     */
    id: customTypes.primaryKey("id").notNull(),
    wins: integer("wins").default(0).notNull(),
  },
  (table) => {
    return {
      wins_idx: index("user_wins_idx").on(table.wins.desc()).concurrently(),
    }
  },
)

export const usersRelations = relations(users, ({ many }) => {
  return {
    gameSessions: many(playerGameSessions),
  }
})

export const questionSourceEnum = pgEnum("question_source_type", ["ai"])

export const questionSources = pgTable("question_sources", {
  id: customTypes.primaryKey("id"),
  type: questionSourceEnum("type").notNull(),
  link: text("link"),
})

export const questionSourcesRelations = relations(questionSources, ({ many }) => {
  return {
    questions: many(questions),
  }
})

export const questionTestCaseTypeEnum = pgEnum("question_test_case_type", ["hidden", "public"])

export const questionTestCases = pgTable(
  "question_test_cases",
  {
    id: customTypes.primaryKey("id"),
    question_id: text("question_id")
      .notNull()
      .references(() => questions.id),
    type: questionTestCaseTypeEnum("type").notNull(),
    args: jsonb("args").notNull(),
    expectedOutput: jsonb("expected_output").notNull(),
  },
  (table) => {
    return {
      question_id_idx: index("question_test_cases_question_id_idx")
        .on(table.question_id)
        .concurrently(),
    }
  },
)

export const questionTestCasesRelations = relations(questionTestCases, ({ one }) => {
  return {
    question: one(questions, {
      fields: [questionTestCases.question_id],
      references: [questions.id],
    }),
  }
})

export const questionDifficultyEnum = pgEnum("question_difficulty", ["easy", "medium", "hard"])

export const questions = pgTable("questions", {
  id: customTypes.primaryKey("id"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: questionDifficultyEnum("difficulty").notNull(),
  starterCode: text("starter_code").notNull(),
  source_id: text("source_id")
    .notNull()
    .references(() => questionSources.id),
})

export const questionsRelations = relations(questions, ({ one, many }) => {
  return {
    source: one(questionSources, {
      fields: [questions.source_id],
      references: [questionSources.id],
    }),
    testCases: many(questionTestCases),
    gameSessions: many(playerGameSessions),
  }
})

export const playerGameSessionFinalResults = pgTable(
  "player_game_session_final_results",
  {
    id: customTypes.primaryKey("id"),
    player_game_session_id: text("player_game_session_id")
      .notNull()
      .references(() => playerGameSessions.id),
    position: integer("position").notNull(),
    score: integer("score").notNull(),
  },
  (table) => {
    return {
      player_game_session_id_idx: index(
        "player_game_session_final_results_player_game_session_id_idx",
      )
        .on(table.player_game_session_id)
        .concurrently(),
    }
  },
)

export const playerGameSessionFinalResultsRelations = relations(
  playerGameSessionFinalResults,
  ({ one }) => {
    return {
      playerGameSession: one(playerGameSessions, {
        fields: [playerGameSessionFinalResults.player_game_session_id],
        references: [playerGameSessions.id],
      }),
    }
  },
)

export const playerGameSubmissionStateResultStatusEnum = pgEnum(
  "player_game_submission_state_result_status",
  ["success", "error"],
)

export const playerGameSubmissionStateResults = pgTable(
  "player_game_submission_state_results",
  {
    id: customTypes.primaryKey("id"),
    player_game_submission_state_id: text("player_game_submission_state_id")
      .notNull()
      .references(() => playerGameSubmissionStates.id),
    question_test_case_id: text("question_test_case_id")
      .notNull()
      .references(() => questionTestCases.id),
    status: playerGameSubmissionStateResultStatusEnum("status").notNull(),
    result: jsonb("result"),
    reason: text("reason"),
    runDurationMs: integer("runDurationMs").notNull(),
  },
  (table) => {
    return {
      player_game_submission_state_id_idx: index(
        "player_game_submission_state_results_player_game_submission_state_id_idx",
      )
        .on(table.player_game_submission_state_id)
        .concurrently(),
    }
  },
)

export const playerGameSubmissionStateResultsRelations = relations(
  playerGameSubmissionStateResults,
  ({ one }) => {
    return {
      playerGameSubmissionState: one(playerGameSubmissionStates, {
        fields: [playerGameSubmissionStateResults.player_game_submission_state_id],
        references: [playerGameSubmissionStates.id],
      }),
    }
  },
)

export const playerGameSubmissionStateSubmissionTypeEnum = pgEnum(
  "player_game_submission_state_submission_type",
  ["test-run", "submission"],
)

export const playerGameSubmissionStateStatusEnum = pgEnum("player_game_submission_state_status", [
  "running",
  "complete",
])

export const playerGameSubmissionStates = pgTable(
  "player_game_submission_states",
  {
    id: customTypes.primaryKey("id"),
    player_game_session_id: text("player_game_session_id")
      .references(() => playerGameSessions.id, {
        onDelete: "cascade",
      })
      .notNull(),
    submissionType: playerGameSubmissionStateSubmissionTypeEnum("submission_type").notNull(),
    lastSubmittedAt: integer("last_submitted_at").notNull(),
    status: playerGameSubmissionStateStatusEnum("status").notNull(),
  },
  (table) => {
    return {
      player_game_session_id_idx: index("player_game_submission_states_player_game_session_id_idx")
        .on(table.player_game_session_id)
        .concurrently(),
    }
  },
)

export const playerGameSubmissionStatesRelations = relations(
  playerGameSubmissionStates,
  ({ one, many }) => {
    return {
      playerGameSession: one(playerGameSessions, {
        fields: [playerGameSubmissionStates.player_game_session_id],
        references: [playerGameSessions.id],
      }),
      results: many(playerGameSubmissionStateResults),
    }
  },
)

export const playerGameSessionChatHistoryItemTypeEnum = pgEnum(
  "player_game_session_chat_history_item_type",
  ["user", "ai", "reset"],
)

export const playerGameSessionChatHistoryItems = pgTable(
  "player_game_session_chat_history_items",
  {
    id: customTypes.primaryKey("id"),
    player_game_session_id: text("player_game_session_id")
      .notNull()
      .references(() => playerGameSessions.id),
    type: playerGameSessionChatHistoryItemTypeEnum("type").notNull(),
    content: jsonb("content").notNull(),
    inserted_at: timestamp("inserted_at")
      .notNull()
      .default(sql`now()`),
  },
  (table) => {
    return {
      player_game_session_id_idx: index(
        "player_game_session_chat_history_items_player_game_session_id_idx",
      )
        .on(table.player_game_session_id)
        .concurrently(),
      inserted_at_idx: index("player_game_session_chat_history_items_inserted_at_idx")
        .on(table.inserted_at.asc())
        .concurrently(),
    }
  },
)

export const playerGameSessionChatHistoryItemsRelations = relations(
  playerGameSessionChatHistoryItems,
  ({ one }) => {
    return {
      playerGameSession: one(playerGameSessions, {
        fields: [playerGameSessionChatHistoryItems.player_game_session_id],
        references: [playerGameSessions.id],
      }),
    }
  },
)

export const playerGameSessions = pgTable(
  "player_game_sessions",
  {
    id: customTypes.primaryKey("id"),
    user_id: text("user_id")
      .notNull()
      .references(() => users.id),
    game_id: text("game_id")
      .notNull()
      .references(() => gameStates.id),

    question_id: text("question_id")
      .notNull()
      .references(() => questions.id),

    test_state_id: text("test_state_id"),
    submission_state_id: text("submission_state_id"),

    model: text("string").notNull(),

    code: text("code").notNull(),
    last_prompted_at: integer("last_prompted_at"),
  },
  (table) => {
    return {
      user_id_game_id_idx: index("player_game_sessions_user_id_game_id_idx")
        .on(table.user_id, table.game_id)
        .concurrently(),
    }
  },
)

export const playerGameSessionsRelations = relations(playerGameSessions, ({ one, many }) => {
  return {
    question: one(questions, {
      fields: [playerGameSessions.question_id],
      references: [questions.id],
    }),
    chatHistory: many(playerGameSessionChatHistoryItems),
    testState: one(playerGameSubmissionStateResults, {
      fields: [playerGameSessions.test_state_id],
      references: [playerGameSubmissionStateResults.id],
    }),
    submissionState: one(playerGameSubmissionStateResults, {
      fields: [playerGameSessions.submission_state_id],
      references: [playerGameSubmissionStateResults.id],
    }),
    finalResult: many(playerGameSessionFinalResults),
    user: one(users, {
      fields: [playerGameSessions.user_id],
      references: [users.id],
    }),
    game: one(gameStates, {
      fields: [playerGameSessions.game_id],
      references: [gameStates.id],
    }),
  }
})

export const gameStateEnum = pgEnum("game_state", [
  "waitingForPlayers",
  "inProgress",
  "finalising",
  "finished",
  "cancelled",
])

export const gameModeEnum = pgEnum("game_mode", [
  "fastest-player",
  "fastest-code",
  "shortest-code",
  "shortest-messages-word-length",
])

export const gameStates = pgTable("game_states", {
  id: customTypes.primaryKey("id"),
  question_id: text("question_id")
    .notNull()
    .references(() => questions.id),
  game_state: gameStateEnum("game_state").notNull(),
  mode: gameModeEnum("mode").notNull(),
  start_time: timestamp("start_time").notNull(),
  end_time: timestamp("end_time"),
})

export const gameStatesRelations = relations(gameStates, ({ one, many }) => {
  return {
    question: one(questions, {
      fields: [gameStates.question_id],
      references: [questions.id],
    }),
    players: many(playerGameSessions),
  }
})
