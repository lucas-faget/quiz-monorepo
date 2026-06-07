import { createSupabase } from "./supabase";
import { GameStatus } from "./types/game_status";
import { GameEvent } from "./types/game_event";
import { AppError } from "./errors/app_error";

export function createGameService(env: { SUPABASE_URL: string; SUPABASE_SECRET_KEY: string }) {
    const questionCount: number = 5;
    const maxAttempt: number = 3;
    const questionDuration: number = 30_000;

    const supabase = createSupabase(env);

    async function createGame() {
        const { data: questions, error: questionsError } = await supabase
            .from("questions")
            .select("id")
            .order("created_at", { ascending: true })
            .limit(questionCount);

        if (questionsError) {
            throw new AppError("Failed to fetch questions", 500, questionsError);
        }

        if (!questions || questions.length < questionCount) {
            throw new AppError("Not enough questions to create a game");
        }

        const { data: game, error: gameError } = await supabase.from("games").insert({}).select().single();

        if (gameError) {
            throw new AppError("Failed to create game", 500, gameError);
        }

        if (!game) {
            throw new AppError("Failed to create game", 500);
        }

        const gameQuestions = questions.map((q, index) => ({
            game_id: game.id,
            question_id: q.id,
            position: index,
        }));

        const { error: gameQuestionsError } = await supabase.from("game_questions").insert(gameQuestions);

        if (gameQuestionsError) {
            throw new AppError("Failed to add questions", 500, gameQuestionsError);
        }

        return game;
    }

    async function joinGame(gameId: string, name: string) {
        const { data: game, error: gameError } = await supabase.from("games").select("id").eq("id", gameId).single();

        if (gameError) {
            throw new AppError("Failed to fetch game", 500, gameError);
        }

        if (!game) {
            throw new AppError("Game not found", 404);
        }

        const { data: player, error: playerError } = await supabase
            .from("players")
            .insert({
                game_id: gameId,
                name,
                is_host: false,
            })
            .select()
            .single();

        if (playerError) {
            throw new AppError("Failed to join game", 500, playerError);
        }

        if (!player) {
            throw new AppError("Failed to join game", 500);
        }

        await supabase.from("game_events").insert({
            game_id: gameId,
            type: GameEvent.PlayerJoin,
            payload: player,
        });

        return player;
    }

    async function getPlayers(gameId: string) {
        const { data: players, error: playersError } = await supabase
            .from("players")
            .select("*")
            .eq("game_id", gameId)
            .order("score", { ascending: false });

        if (playersError) {
            throw new AppError("Failed to fetch players", 500, playersError);
        }

        return players ?? [];
    }

    async function startGame(gameId: string) {
        const { data: game, error: gameError } = await supabase
            .from("games")
            .update({
                status: GameStatus.Ongoing,
            })
            .eq("id", gameId)
            .select()
            .single();

        if (gameError) {
            throw new AppError("Failed to update game", 500, gameError);
        }

        if (!game) {
            throw new AppError("Game not found", 404);
        }

        await supabase.from("game_events").insert({
            game_id: gameId,
            type: GameEvent.Start,
            payload: game,
        });

        return game;
    }

    async function getQuestion(gameId: string, position: number) {
        const { data: gameQuestion, error: gameQuestionError } = await supabase
            .from("game_questions")
            .select("question_id")
            .eq("game_id", gameId)
            .eq("position", position)
            .single();

        if (gameQuestionError) {
            throw new AppError("Failed to fetch question", 500, gameQuestionError);
        }

        if (!gameQuestion) {
            throw new AppError("Question not found", 404);
        }

        const { data: question, error: questionError } = await supabase
            .from("questions")
            .select("id, title, accepted_answers")
            .eq("id", gameQuestion.question_id)
            .single();

        if (questionError) {
            throw new AppError("Failed to fetch question", 500, questionError);
        }

        if (!question) {
            throw new AppError("Question not found", 404);
        }

        return question;
    }

    async function startQuestion(gameId: string) {
        const { data: game, error: gameError } = await supabase.from("games").select("*").eq("id", gameId).single();

        if (gameError) {
            throw new AppError("Failed to fetch game", 500, gameError);
        }

        if (!game) {
            throw new AppError("Game not found", 404);
        }

        const position = game.current_question_position + 1;

        if (position >= questionCount) {
            throw new AppError("No more questions available", 409);
        }

        const { error: updateError } = await supabase
            .from("games")
            .update({
                current_question_position: position,
                current_question_start: new Date().toISOString(),
            })
            .eq("id", gameId);

        if (updateError) {
            throw new AppError("Failed to start question", 500, updateError);
        }

        const question = await getQuestion(gameId, position);

        await supabase.from("game_events").insert({
            game_id: gameId,
            type: GameEvent.QuestionStart,
            payload: question,
        });

        return question;
    }

    async function answer(gameId: string, playerId: string, answer: string) {
        const { data: game, error: gameError } = await supabase.from("games").select("*").eq("id", gameId).single();

        if (gameError) {
            throw new AppError("Failed to fetch game", 500, gameError);
        }

        if (!game) {
            throw new AppError("Game not found", 404);
        }

        if (game.status !== GameStatus.Ongoing) {
            throw new AppError("Game is not ongoing", 409);
        }

        // Ensure the player belongs to this game to prevent cross-game answer injection
        const { data: player, error: playerError } = await supabase
            .from("players")
            .select("id")
            .eq("id", playerId)
            .eq("game_id", gameId)
            .single();

        if (playerError) {
            throw new AppError("Failed to fetch player", 500, playerError);
        }

        if (!player) {
            throw new AppError("Player not found", 403);
        }

        if (!game.current_question_start) {
            throw new AppError("Question not started");
        }

        const start = new Date(game.current_question_start).getTime();
        const elapsed = Date.now() - start;

        if (elapsed > questionDuration) {
            throw new AppError("Time elapsed");
        }

        const question = await getQuestion(gameId, game.current_question_position);

        const isCorrect = question.accepted_answers.includes(answer);

        const { count, error: countError } = await supabase
            .from("answers")
            .select("*", { count: "exact", head: true })
            .eq("player_id", playerId)
            .eq("question_id", question.id);

        if (countError) {
            throw new AppError("Failed to count answers", 500, countError);
        }

        if ((count ?? 0) >= maxAttempt) {
            throw new AppError("Maximum number of attempts reached");
        }

        const { error: answerError } = await supabase.from("answers").insert({
            game_id: gameId,
            player_id: playerId,
            question_id: question.id,
            answer,
            is_correct: isCorrect,
        });

        if (answerError) {
            throw new AppError("Failed to save answer", 500, answerError);
        }

        return { isCorrect };
    }

    async function endQuestion(gameId: string) {
        const { data: game, error: gameError } = await supabase.from("games").select("*").eq("id", gameId).single();

        if (gameError) {
            throw new AppError("Failed to fetch game", 500, gameError);
        }

        if (!game) {
            throw new AppError("Game not found", 404);
        }

        const question = await getQuestion(gameId, game.current_question_position);

        await supabase.from("game_events").insert({
            game_id: gameId,
            type: GameEvent.QuestionEnd,
            payload: question,
        });

        return question;
    }

    async function endGame(gameId: string) {
        const { data: game, error: gameError } = await supabase
            .from("games")
            .update({
                status: GameStatus.Finished,
            })
            .eq("id", gameId)
            .select()
            .single();

        if (gameError) {
            throw new AppError("Failed to update game", 500, gameError);
        }

        if (!game) {
            throw new AppError("Game not found", 404);
        }

        await supabase.from("game_events").insert({
            game_id: gameId,
            type: GameEvent.End,
            payload: {},
        });

        return game;
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
