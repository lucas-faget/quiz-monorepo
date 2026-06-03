import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import { ok } from "../lib/openapi";
import { createGameService } from "../lib/game_service";
import {
    AnswerBodySchema,
    AnswerParamsSchema,
    AnswerResponseSchema,
    CreateGameResponseSchema,
    EndGameParamsSchema,
    EndGameResponseSchema,
    EndQuestionParamsSchema,
    EndQuestionResponseSchema,
    GetPlayersParamsSchema,
    GetPlayersResponseSchema,
    JoinGameBodySchema,
    JoinGameParamsSchema,
    JoinGameResponseSchema,
    StartGameParamsSchema,
    StartGameResponseSchema,
    StartQuestionParamsSchema,
    StartQuestionResponseSchema,
} from "../schemas/games";

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
            ...ok(GetPlayersResponseSchema, "Game started"),
        },
    }),
    validator("param", StartGameParamsSchema),
    async (c) => {
        const { id } = c.req.valid("param");

        const service = createGameService(c.env);
        const game = await service.startGame(id);

        return c.json(game);
    },
);

/**
 * POST /games/:id/start-question
 */
games.post(
    "/:id/start-question",
    describeRoute({
        summary: "Start question",
        tags: ["Games"],
        responses: {
            ...ok(StartQuestionResponseSchema, "Question started"),
        },
    }),
    validator("param", StartQuestionParamsSchema),
    async (c) => {
        const { id } = c.req.valid("param");

        const service = createGameService(c.env);
        const question = await service.startQuestion(id);

        return c.json(question);
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
 * POST /games/:id/end-question
 */
games.post(
    "/:id/end-question",
    describeRoute({
        summary: "End question",
        tags: ["Games"],
        responses: {
            ...ok(EndQuestionResponseSchema, "Answer Question ended"),
        },
    }),
    validator("param", EndQuestionParamsSchema),
    async (c) => {
        const { id } = c.req.valid("param");

        const service = createGameService(c.env);
        const question = await service.endQuestion(id);

        return c.json(question);
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
