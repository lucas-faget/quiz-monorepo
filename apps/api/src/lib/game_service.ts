import { createSupabase } from "./supabase";
import { GameStatus } from "./game_status";
import { GameEvent } from "./game_event";

export function createGameService(env: { SUPABASE_URL: string; SUPABASE_SECRET_KEY: string }) {
    const supabase = createSupabase(env);

    async function createGame() {
        const { data: game } = await supabase.from("games").insert({}).select().single();

        const { data: questions } = await supabase
            .from("questions")
            .select("id")
            .order("created_at", { ascending: true })
            .limit(5);

        if (!questions || questions.length === 0) {
            throw new Error("Not enough questions");
        }

        const gameQuestions = questions.map((q, index) => ({
            game_id: game.id,
            question_id: q.id,
            position: index,
        }));

        await supabase.from("game_questions").insert(gameQuestions);

        return game;
    }

    async function joinGame(gameId: string, name: string) {
        const { data: player } = await supabase
            .from("players")
            .insert({
                game_id: gameId,
                name,
                is_host: false,
            })
            .select()
            .single();

        await supabase.from("game_events").insert({
            game_id: gameId,
            type: GameEvent.PlayerJoin,
            payload: player,
        });

        return player;
    }

    async function getPlayers(gameId: string) {
        const { data: players } = await supabase
            .from("players")
            .select("*")
            .eq("game_id", gameId)
            .order("score", { ascending: false });

        return players;
    }

    async function startGame(gameId: string) {
        const { data: game } = await supabase
            .from("games")
            .update({
                status: GameStatus.Ongoing,
            })
            .eq("id", gameId)
            .select()
            .single();

        await supabase.from("game_events").insert({
            game_id: gameId,
            type: GameEvent.Start,
            payload: game,
        });

        return game;
    }

    async function getQuestion(gameId: string, position: number) {
        const { data } = await supabase
            .from("game_questions")
            .select("question_id")
            .eq("game_id", gameId)
            .eq("position", position)
            .single();

        const { data: question } = await supabase
            .from("questions")
            .select("id, title")
            .eq("id", data.question_id)
            .single();

        return question;
    }

    async function startQuestion(gameId: string) {
        const { data: game } = await supabase.from("games").select("*").eq("id", gameId).single();

        const position = game.current_question_position + 1;

        await supabase
            .from("games")
            .update({
                current_question_position: position,
                current_question_start: new Date().toISOString(),
            })
            .eq("id", gameId)
            .select()
            .single();

        const question = await getQuestion(gameId, position);

        await supabase.from("game_events").insert({
            game_id: gameId,
            type: GameEvent.QuestionStart,
            payload: question,
        });

        return question;
    }

    async function answer(gameId: string, playerId: string, answer: string) {
        const { data: game } = await supabase.from("games").select("*").eq("id", gameId).single();

        const start = new Date(game.current_question_start).getTime();
        const elapsed = Date.now() - start;

        if (elapsed > 30_000) {
            throw new Error("Time elapsed");
        }

        const question = await getAnswer(gameId, game.current_question_position);

        const isCorrect = question.accepted_answers.includes(answer);

        const { count } = await supabase
            .from("answers")
            .select("*", { count: "exact", head: true })
            .eq("player_id", playerId)
            .eq("question_id", question.id);

        if ((count ?? 0) >= 3) {
            throw new Error("Maximum number of attemps reached");
        }

        await supabase.from("answers").insert({
            game_id: gameId,
            player_id: playerId,
            question_id: question.id,
            answer,
            is_correct: isCorrect,
        });

        return { isCorrect };
    }

    async function getAnswer(gameId: string, position: number) {
        const { data } = await supabase
            .from("game_questions")
            .select("question_id")
            .eq("game_id", gameId)
            .eq("position", position)
            .single();

        const { data: question } = await supabase.from("questions").select("*").eq("id", data.question_id).single();

        return question;
    }

    async function endQuestion(gameId: string) {
        const { data: game } = await supabase.from("games").select("*").eq("id", gameId).single();

        const position = game.current_question_position;

        const question = await getAnswer(gameId, position);

        await supabase.from("game_events").insert({
            game_id: gameId,
            type: GameEvent.QuestionEnd,
            payload: question,
        });

        return question;
    }

    async function endGame(gameId: string) {
        const { data } = await supabase
            .from("games")
            .update({
                status: GameStatus.Finished,
            })
            .eq("id", gameId)
            .select()
            .single();

        await supabase.from("game_events").insert({
            game_id: gameId,
            type: GameEvent.End,
            payload: {},
        });

        return data;
    }

    return {
        createGame,
        joinGame,
        getPlayers,
        startGame,
        startQuestion,
        answer,
        endQuestion,
        endGame,
    };
}
