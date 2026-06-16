import { api } from "./api";
import { supabase } from "./supabase";

export function createGameClient(gameId?: string) {
    function subscribe(callback: (event: { type: string; payload: any }) => void) {
        if (!gameId) {
            throw new Error("gameId is required");
        }

        return supabase
            .channel(`game:${gameId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "game_events",
                    filter: `game_id=eq.${gameId}`,
                },
                (payload) => {
                    callback(payload.new as any);
                },
            )
            .subscribe();
    }

    async function createGame() {
        return api("/games", {
            method: "POST",
        });
    }

    async function joinGame(name: string) {
        if (!gameId) {
            throw new Error("gameId is required");
        }

        return api(`/games/${gameId}/join`, {
            method: "POST",
            body: JSON.stringify({ name }),
        });
    }

    async function getPlayers() {
        if (!gameId) {
            throw new Error("gameId is required");
        }

        return api(`/games/${gameId}/players`);
    }

    async function startGame() {
        if (!gameId) {
            throw new Error("gameId is required");
        }

        return api(`/games/${gameId}/start`, {
            method: "POST",
        });
    }

    async function next() {
        if (!gameId) {
            throw new Error("gameId is required");
        }

        return api(`/games/${gameId}/next`, {
            method: "POST",
        });
    }

    async function answer(playerId: string, answer: string) {
        if (!gameId) {
            throw new Error("gameId is required");
        }

        return api(`/games/${gameId}/answer`, {
            method: "POST",
            body: JSON.stringify({
                playerId,
                answer,
            }),
        });
    }

    async function endGame() {
        if (!gameId) {
            throw new Error("gameId is required");
        }

        return api(`/games/${gameId}/end`, {
            method: "POST",
        });
    }

    return {
        subscribe,
        createGame,
        joinGame,
        getPlayers,
        startGame,
        next,
        answer,
        endGame,
    };
}
