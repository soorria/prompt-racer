import type { SQL } from "drizzle-orm"
import { relations, sql } from "drizzle-orm"
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

import { GAME_MODES } from "../games/constants"
import { type ChatHistoryItemContent } from "../games/schemas"
import { type ModelId } from "../llm/constants"

const customTypes = {
  primaryKey: (name: string) => uuid(name).primaryKey().defaultRandom().notNull(),
  primaryKeyWithoutDefault: (name: string) => uuid(name).primaryKey().notNull(),
  primaryKeyReference: (name: string) => uuid(name),
}

export const users = pgTable(
  "users",
  {
    /**
     * Supabase auth user id
     */
    id: customTypes.primaryKeyWithoutDefault("id"),
    name: text("name").notNull(),
    profile_image_url: text("profile_image_url"),

    github_username: text("github_username"),

    wins: integer("wins").default(0).notNull(),
    gamesPlayed: integer("games_played").default(0).notNull(),
    winRate: real("win_rate").generatedAlwaysAs(
      (): SQL =>
        sql`case when ${users.gamesPlayed} = 0 then 0 else least((${users.wins}::real / ${users.gamesPlayed}), 1.0) end`,
    ),

    inserted_at: timestamp("inserted_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      wins_idx: index("user_wins_games_played_inserted_at_idx")
        .on(table.wins.desc(), table.gamesPlayed.asc(), table.inserted_at.desc())
        .concurrently(),
      games_played_idx: index("user_games_played_inserted_at_idx")
        .on(table.gamesPlayed.desc(), table.inserted_at.desc())
        .concurrently(),

      win_rate_idx: index("user_win_rate_wins_inserted_at_idx")
        .on(table.winRate.desc(), table.wins.desc(), table.inserted_at.desc())
        .concurrently(),
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
    question_id: customTypes
      .primaryKeyReference("question_id")
      .notNull()
      .references(() => questions.id),
    type: questionTestCaseTypeEnum("type").notNull(),
    args: jsonb("args").notNull().$type<unknown[]>(),
    expectedOutput: jsonb("expected_output"),
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
  source_id: customTypes
    .primaryKeyReference("source_id")
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
    gameStates: many(gameStates),
  }
})

export const playerGameSessionFinalResults = pgTable(
  "player_game_session_final_results",
  {
    id: customTypes.primaryKey("id"),
    player_game_session_id: customTypes
      .primaryKeyReference("player_game_session_id")
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
    player_game_submission_state_id: customTypes
      .primaryKeyReference("player_game_submission_state_id")
      .notNull()
      .references(() => playerGameSubmissionStates.id),
    question_test_case_id: customTypes
      .primaryKeyReference("question_test_case_id")
      .notNull()
      .references(() => questionTestCases.id),
    status: playerGameSubmissionStateResultStatusEnum("status").notNull(),
    result: jsonb("result"),
    reason: text("reason"),
    is_correct: boolean("is_correct").notNull(),
    run_duration_ms: integer("runDurationMs").notNull(),
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
    player_game_session_id: customTypes
      .primaryKeyReference("player_game_session_id")
      .references(() => playerGameSessions.id, {
        onDelete: "cascade",
      })
      .notNull(),
    submittion_type: playerGameSubmissionStateSubmissionTypeEnum("submission_type").notNull(),
    last_submitted_at: timestamp("last_submitted_at").notNull(),
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

export const playerGameSessionChatHistoryItems = pgTable(
  "player_game_session_chat_history_items",
  {
    id: customTypes.primaryKey("id"),
    player_game_session_id: customTypes
      .primaryKeyReference("player_game_session_id")
      .notNull()
      .references(() => playerGameSessions.id),
    content: jsonb("content").notNull().$type<ChatHistoryItemContent>(),
    inserted_at: timestamp("inserted_at").notNull().defaultNow(),
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
    user_id: customTypes
      .primaryKeyReference("user_id")
      .notNull()
      .references(() => users.id),
    game_id: customTypes
      .primaryKeyReference("game_id")
      .notNull()
      .references(() => gameStates.id),

    test_state_id: customTypes.primaryKeyReference("test_state_id"),
    submission_state_id: customTypes.primaryKeyReference("submission_state_id"),

    model: text("string").notNull().$type<ModelId>(),

    code: text("code").notNull(),
    last_prompted_at: timestamp("last_prompted_at"),

    final_result_id: customTypes.primaryKeyReference("final_result_id"),

    updated_at: timestamp("updated_at")
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => {
    return {
      user_id_game_id_idx: index("player_game_sessions_user_id_game_id_idx")
        .on(table.user_id, table.game_id)
        .concurrently(),
      game_id_idx: index("player_game_sessions_game_id_idx").on(table.game_id).concurrently(),
    }
  },
)

export const playerGameSessionsRelations = relations(playerGameSessions, ({ one, many }) => {
  return {
    chatHistory: many(playerGameSessionChatHistoryItems),
    testState: one(playerGameSubmissionStates, {
      fields: [playerGameSessions.test_state_id],
      references: [playerGameSubmissionStates.id],
    }),
    submissionState: one(playerGameSubmissionStates, {
      fields: [playerGameSessions.submission_state_id],
      references: [playerGameSubmissionStates.id],
    }),
    finalResult: one(playerGameSessionFinalResults),
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

export const gameStatusEnum = pgEnum("game_state", [
  "waitingForPlayers",
  "inProgress",
  "finalising",
  "finished",
  "cancelled",
])

export const gameModeEnum = pgEnum("game_mode", GAME_MODES)

export const gameStates = pgTable(
  "game_states",
  {
    id: customTypes.primaryKey("id"),
    question_id: customTypes
      .primaryKeyReference("question_id")
      .notNull()
      .references(() => questions.id),
    status: gameStatusEnum("status").notNull(),
    mode: gameModeEnum("mode").notNull(),

    waiting_for_players_duration_ms: integer("waiting_for_players_duration_ms").notNull(),
    in_progress_duration_ms: integer("in_progress_duration_ms").notNull(),

    inserted_at: timestamp("inserted_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
    start_time: timestamp("start_time"),
    end_time: timestamp("end_time"),
  },
  (table) => {
    return {
      status_idx: index("status_idx").on(table.status),
    }
  },
)

export const gameStatesRelations = relations(gameStates, ({ one, many }) => {
  return {
    question: one(questions, {
      fields: [gameStates.question_id],
      references: [questions.id],
    }),
    players: many(playerGameSessions),
  }
})
