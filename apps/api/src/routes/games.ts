import { Hono } from "hono";
import type { Context } from "hono";
import { createGameService } from "../lib/game_service";

export const games = new Hono();

/**
 * POST /games
 */
games.post("/", async (c: Context) => {
    const service = createGameService(c.env);
    const game = await service.createGame();

    return c.json(game);
});

/**
 * POST /games/:id/join
 */
games.post("/:id/join", async (c: Context) => {
    const gameId = c.req.param("id");
    const { name } = await c.req.json();

    const service = createGameService(c.env);
    const player = await service.joinGame(gameId, name);

    return c.json(player);
});

/**
 * GET /games/:id/players
 */
games.get("/:id/players", async (c: Context) => {
    const gameId = c.req.param("id");

    const service = createGameService(c.env);
    const players = await service.getPlayers(gameId);

    return c.json(players);
});

/**
 * POST /games/:id/start
 */
games.post("/:id/start", async (c: Context) => {
    const gameId = c.req.param("id");

    const service = createGameService(c.env);
    const game = await service.startGame(gameId);
    return c.json(game);
});

/**
 * POST /games/:id/start-question
 */
games.post("/:id/start-question", async (c: Context) => {
    const gameId = c.req.param("id");

    const service = createGameService(c.env);
    const game = await service.startQuestion(gameId);

    return c.json(game);
});

/**
 * POST /games/:id/answer
 */
games.post("/:id/answer", async (c: Context) => {
    const gameId = c.req.param("id");
    const { playerId, answer } = await c.req.json();

    const service = createGameService(c.env);
    const result = await service.answer(gameId, playerId, answer);

    return c.json(result);
});

/**
 * POST /games/:id/end-question
 */
games.post("/:id/end-question", async (c: Context) => {
    const gameId = c.req.param("id");

    const service = createGameService(c.env);
    const game = await service.endQuestion(gameId);

    return c.json(game);
});

/**
 * POST /games/:id/end
 */
games.post("/:id/end", async (c: Context) => {
    const gameId = c.req.param("id");

    const service = createGameService(c.env);
    const game = await service.endGame(gameId);

    return c.json(game);
});
