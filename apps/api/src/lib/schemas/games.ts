import * as v from "valibot";
import { GameStatus } from "../types/game_status";

export const GameSchema = v.object({
    id: v.string(),
    status: v.picklist([GameStatus.Waiting, GameStatus.Ongoing, GameStatus.Finished]),
    current_question_position: v.number(),
    current_question_start: v.nullable(v.string()),
});

export const PlayerSchema = v.object({
    id: v.string(),
    game_id: v.string(),
    name: v.string(),
    score: v.number(),
    is_host: v.boolean(),
});

export const QuestionSchema = v.object({
    id: v.string(),
    title: v.string(),
    answer: v.optional(v.string()),
    accepted_answers: v.optional(v.array(v.string())),
});

export const GameEventSchema = v.object({
    id: v.optional(v.string()),
    game_id: v.string(),
    type: v.string(),
    payload: GameSchema,
});

export const QuestionEventSchema = v.object({
    id: v.optional(v.string()),
    game_id: v.string(),
    type: v.string(),
    payload: QuestionSchema,
});

export const ErrorResponseSchema = v.object({
    error: v.string(),
});

/**
 * POST /games
 */

export const CreateGameResponseSchema = GameSchema;

/**
 * POST /games/:id/join
 */

export const JoinGameParamsSchema = v.object({
    id: v.string(),
});

export const JoinGameBodySchema = v.object({
    name: v.string(),
});

export const JoinGameResponseSchema = PlayerSchema;

/**
 * GET /games/:id/players
 */

export const GetPlayersParamsSchema = v.object({
    id: v.string(),
});

export const GetPlayersResponseSchema = v.array(PlayerSchema);

/**
 * POST /games/:id/start
 */

export const StartGameParamsSchema = v.object({
    id: v.string(),
});

export const StartGameResponseSchema = GameEventSchema;

/**
 * POST /games/:id/next
 */

export const NextParamsSchema = v.object({
    id: v.string(),
});

export const NextResponseSchema = QuestionEventSchema;

/**
 * POST /games/:id/answer
 */

export const AnswerParamsSchema = v.object({
    id: v.string(),
});

export const AnswerBodySchema = v.object({
    playerId: v.string(),
    answer: v.string(),
});

export const AnswerResponseSchema = v.object({
    isCorrect: v.boolean(),
});

/**
 * POST /games/:id/end
 */

export const EndGameParamsSchema = v.object({
    id: v.string(),
});

export const EndGameResponseSchema = GameEventSchema;
