/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.8.0.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as codeExecution from "../codeExecution.js";
import type * as games from "../games.js";
import type * as openai from "../openai.js";
import type * as questions from "../questions.js";
import type * as users from "../users.js";
import type * as utils_auth from "../utils/auth.js";
import type * as utils_elo from "../utils/elo.js";
import type * as utils_game_settings from "../utils/game_settings.js";
import type * as utils_games from "../utils/games.js";
import type * as utils_types from "../utils/types.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  codeExecution: typeof codeExecution;
  games: typeof games;
  openai: typeof openai;
  questions: typeof questions;
  users: typeof users;
  "utils/auth": typeof utils_auth;
  "utils/elo": typeof utils_elo;
  "utils/game_settings": typeof utils_game_settings;
  "utils/games": typeof utils_games;
  "utils/types": typeof utils_types;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
