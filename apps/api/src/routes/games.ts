import { Hono } from "hono";
import { describeRoute, validator } from "hono-openapi";
import { badRequest, conflict, internalServerError, notFound, ok } from "../lib/openapi";
import { createGameService } from "../lib/game_service";
import {
    AnswerBodySchema,
    AnswerParamsSchema,
    AnswerResponseSchema,
    CreateGameResponseSchema,
    EndGameParamsSchema,
    EndGameResponseSchema,
    ErrorResponseSchema,
    GetPlayersParamsSchema,
    GetPlayersResponseSchema,
    JoinGameBodySchema,
    JoinGameParamsSchema,
    JoinGameResponseSchema,
    NextParamsSchema,
    NextResponseSchema,
    StartGameParamsSchema,
    StartGameResponseSchema,
} from "../lib/schemas/games";
import { AppError } from "../lib/errors/app_error";
import { GameStatus } from "../lib/types/game_status";

export const games = new Hono();

/**
 * POST /games
 */
games.post(
    "/",
    describeRoute({
        summary: "Create a game",
        tags: ["Games"],
        responses: {
            ...ok(CreateGameResponseSchema, "Game created"),
            ...badRequest(ErrorResponseSchema),
            ...internalServerError(ErrorResponseSchema),
        },
    }),
    async (c) => {
        const service = createGameService(c.env);
        const game = await service.createGame();

        return c.json(game);
    },
);

/**
 * POST /games/:id/join
 */
games.post(
    "/:id/join",
    describeRoute({
        summary: "Join a game",
        tags: ["Games"],
        responses: {
            ...ok(JoinGameResponseSchema, "Player joined"),
            ...notFound(ErrorResponseSchema),
            ...internalServerError(ErrorResponseSchema),
        },
    }),
    validator("param", JoinGameParamsSchema),
    validator("json", JoinGameBodySchema),
    async (c) => {
        const { id } = c.req.valid("param");
        const { name } = c.req.valid("json");

        const service = createGameService(c.env);
        const player = await service.joinGame(id, name);

        return c.json(player);
    },
);

/**
 * GET /games/:id/players
 */
games.get(
    "/:id/players",
    describeRoute({
        summary: "Get players",
        tags: ["Games"],
        responses: {
            ...ok(GetPlayersResponseSchema, "Player list"),
            ...internalServerError(ErrorResponseSchema),
        },
    }),
    validator("param", GetPlayersParamsSchema),
    async (c) => {
        const { id } = c.req.valid("param");

        const service = createGameService(c.env);
        const players = await service.getPlayers(id);

        return c.json(players);
    },
);

/**
 * POST /games/:id/start
 */
games.post(
    "/:id/start",
    describeRoute({
        summary: "Start game",
        tags: ["Games"],
        responses: {
            ...ok(StartGameResponseSchema, "Game started"),
            ...notFound(ErrorResponseSchema),
            ...internalServerError(ErrorResponseSchema),
        },
    }),
    validator("param", StartGameParamsSchema),
    async (c) => {
        const { id } = c.req.valid("param");

        const service = createGameService(c.env);
        await service.startGame(id);
        const event = await service.startQuestion(id, 1);

        return c.json(event);
    },
);

/**
 * POST /games/:id/next
 */
games.post(
    "/:id/next",
    describeRoute({
        summary: "Go to the next step",
        tags: ["Games"],
        responses: {
            ...ok(NextResponseSchema, "Next step"),
            ...notFound(ErrorResponseSchema),
            ...internalServerError(ErrorResponseSchema),
        },
    }),
    validator("param", NextParamsSchema),
    async (c) => {
        const { id } = c.req.valid("param");

        const service = createGameService(c.env);
        const game = await service.getGame(id);

        if (game.status !== GameStatus.Ongoing) {
            throw new AppError("Game is not running", 409);
        }

        const position = game.current_question_position;

        if (game.current_question_start) {
            const event = await service.endQuestion(id, position);

            if (position === service.questionCount) {
                await service.endGame(id);
            }

            return c.json(event);
        }

        if (position === service.questionCount) {
            throw new AppError("Game is over", 409);
        }

        const event = await service.startQuestion(id, position + 1);

        return c.json(event);
    },
);

/**
 * POST /games/:id/answer
 */
games.post(
    "/:id/answer",
    describeRoute({
        summary: "Answer question",
        tags: ["Games"],
        responses: {
            ...ok(AnswerResponseSchema, "Answer result"),
            ...badRequest(ErrorResponseSchema),
            ...notFound(ErrorResponseSchema),
            ...conflict(ErrorResponseSchema),
            ...internalServerError(ErrorResponseSchema),
        },
    }),
    validator("param", AnswerParamsSchema),
    validator("json", AnswerBodySchema),
    async (c) => {
        const { id } = c.req.valid("param");
        const { playerId, answer } = c.req.valid("json");

        const service = createGameService(c.env);
        const result = await service.answer(id, playerId, answer);

        return c.json(result);
    },
);

/**
 * POST /games/:id/end
 */
games.post(
    "/:id/end",
    describeRoute({
        summary: "End game",
        tags: ["Games"],
        responses: {
            ...ok(EndGameResponseSchema, "Game ended"),
            ...notFound(ErrorResponseSchema),
            ...internalServerError(ErrorResponseSchema),
        },
    }),
    validator("param", EndGameParamsSchema),
    async (c) => {
        const { id } = c.req.valid("param");

        const service = createGameService(c.env);
        const game = await service.endGame(id);

        return c.json(game);
    },
);
