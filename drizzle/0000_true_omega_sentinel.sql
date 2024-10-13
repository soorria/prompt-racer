DO $$ BEGIN
 CREATE TYPE "public"."game_mode" AS ENUM('fastest-player', 'fastest-code', 'shortest-code', 'fewest-characters-to-llm');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."game_state" AS ENUM('waitingForPlayers', 'inProgress', 'finalising', 'finished', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."player_game_submission_state_result_status" AS ENUM('success', 'error');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."player_game_submission_state_status" AS ENUM('running', 'complete');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."player_game_submission_state_submission_type" AS ENUM('test-run', 'submission');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."question_difficulty" AS ENUM('easy', 'medium', 'hard');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."question_source_type" AS ENUM('ai');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."question_test_case_type" AS ENUM('hidden', 'public');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('admin', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "game_states" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"status" "game_state" NOT NULL,
	"mode" "game_mode" NOT NULL,
	"waiting_for_players_duration_ms" integer NOT NULL,
	"in_progress_duration_ms" integer NOT NULL,
	"inserted_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"start_time" timestamp,
	"end_time" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player_game_session_chat_history_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_game_session_id" uuid NOT NULL,
	"submitted" boolean DEFAULT false NOT NULL,
	"content" jsonb NOT NULL,
	"inserted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player_game_session_final_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_game_session_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"score" integer NOT NULL,
	CONSTRAINT "player_game_session_final_results_player_game_session_id_unique" UNIQUE("player_game_session_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player_game_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"game_id" uuid NOT NULL,
	"test_state_id" uuid,
	"submission_state_id" uuid,
	"string" text NOT NULL,
	"code" text NOT NULL,
	"last_prompted_at" timestamp,
	"final_result_id" uuid,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player_game_submission_state_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_game_submission_state_id" uuid NOT NULL,
	"question_test_case_id" uuid,
	"status" "player_game_submission_state_result_status" NOT NULL,
	"result" jsonb,
	"reason" text,
	"is_correct" boolean NOT NULL,
	"runDurationMs" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player_game_submission_states" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_game_session_id" uuid NOT NULL,
	"submission_type" "player_game_submission_state_submission_type" NOT NULL,
	"last_submitted_at" timestamp NOT NULL,
	"status" "player_game_submission_state_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "question_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "question_source_type" NOT NULL,
	"link" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "question_test_cases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"type" "question_test_case_type" NOT NULL,
	"args" jsonb NOT NULL,
	"expected_output" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"difficulty" "question_difficulty" NOT NULL,
	"starter_code" text NOT NULL,
	"source_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"profile_image_url" text,
	"role" "role" DEFAULT 'user' NOT NULL,
	"github_username" text,
	"wins" integer DEFAULT 0 NOT NULL,
	"games_played" integer DEFAULT 0 NOT NULL,
	"win_rate" real GENERATED ALWAYS AS (case when "users"."games_played" = 0 then 0 else least(("users"."wins"::real / "users"."games_played"), 1.0) end) STORED,
	"inserted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_states" ADD CONSTRAINT "game_states_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_game_session_chat_history_items" ADD CONSTRAINT "player_game_session_chat_history_items_player_game_session_id_player_game_sessions_id_fk" FOREIGN KEY ("player_game_session_id") REFERENCES "public"."player_game_sessions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_game_session_final_results" ADD CONSTRAINT "player_game_session_final_results_player_game_session_id_player_game_sessions_id_fk" FOREIGN KEY ("player_game_session_id") REFERENCES "public"."player_game_sessions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_game_sessions" ADD CONSTRAINT "player_game_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_game_sessions" ADD CONSTRAINT "player_game_sessions_game_id_game_states_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game_states"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_game_submission_state_results" ADD CONSTRAINT "player_game_submission_state_results_player_game_submission_state_id_player_game_submission_states_id_fk" FOREIGN KEY ("player_game_submission_state_id") REFERENCES "public"."player_game_submission_states"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_game_submission_state_results" ADD CONSTRAINT "player_game_submission_state_results_question_test_case_id_question_test_cases_id_fk" FOREIGN KEY ("question_test_case_id") REFERENCES "public"."question_test_cases"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_game_submission_states" ADD CONSTRAINT "player_game_submission_states_player_game_session_id_player_game_sessions_id_fk" FOREIGN KEY ("player_game_session_id") REFERENCES "public"."player_game_sessions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question_test_cases" ADD CONSTRAINT "question_test_cases_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions" ADD CONSTRAINT "questions_source_id_question_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."question_sources"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "status_idx" ON "game_states" USING btree ("status");--> statement-breakpoint
CREATE INDEX CONCURRENTLY IF NOT EXISTS "player_game_session_chat_history_items_player_game_session_id_idx" ON "player_game_session_chat_history_items" USING btree ("player_game_session_id");--> statement-breakpoint
CREATE INDEX CONCURRENTLY IF NOT EXISTS "player_game_session_chat_history_items_inserted_at_idx" ON "player_game_session_chat_history_items" USING btree ("inserted_at");--> statement-breakpoint
CREATE INDEX CONCURRENTLY IF NOT EXISTS "player_game_session_final_results_player_game_session_id_idx" ON "player_game_session_final_results" USING btree ("player_game_session_id");--> statement-breakpoint
CREATE INDEX CONCURRENTLY IF NOT EXISTS "player_game_sessions_user_id_game_id_idx" ON "player_game_sessions" USING btree ("user_id","game_id");--> statement-breakpoint
CREATE INDEX CONCURRENTLY IF NOT EXISTS "player_game_sessions_game_id_idx" ON "player_game_sessions" USING btree ("game_id");--> statement-breakpoint
CREATE INDEX CONCURRENTLY IF NOT EXISTS "player_game_submission_state_results_player_game_submission_state_id_idx" ON "player_game_submission_state_results" USING btree ("player_game_submission_state_id");--> statement-breakpoint
CREATE INDEX CONCURRENTLY IF NOT EXISTS "player_game_submission_states_player_game_session_id_idx" ON "player_game_submission_states" USING btree ("player_game_session_id");--> statement-breakpoint
CREATE INDEX CONCURRENTLY IF NOT EXISTS "question_test_cases_question_id_idx" ON "question_test_cases" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX CONCURRENTLY IF NOT EXISTS "user_wins_games_played_inserted_at_idx" ON "users" USING btree ("wins" DESC NULLS LAST,"games_played","inserted_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX CONCURRENTLY IF NOT EXISTS "user_games_played_inserted_at_idx" ON "users" USING btree ("games_played" DESC NULLS LAST,"inserted_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX CONCURRENTLY IF NOT EXISTS "user_win_rate_wins_inserted_at_idx" ON "users" USING btree ("win_rate" DESC NULLS LAST,"wins" DESC NULLS LAST,"inserted_at" DESC NULLS LAST);