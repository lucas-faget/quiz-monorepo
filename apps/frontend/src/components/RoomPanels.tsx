import { useEffect, useState } from "react";
import { Group, Panel } from "react-resizable-panels";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/8bit/menubar";
import LeaderboardPanel from "@/components/panels/LeaderboardPanel";
import QuestionPanel from "@/components/panels/QuestionPanel";
import ChatPanel from "@/components/panels/ChatPanel";
import type { LeaderboardPlayer } from "@/components/ui/8bit/blocks/leaderboard";
import { createGameClient } from "@/lib/game_client";
import { supabase } from "@/lib/supabase";
import type { Message } from "@/types/Message";
import type { Question } from "@/types/Question";

export default function RoomPanels({ roomId }: { roomId: string }) {
    const game = createGameClient(roomId);

    const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
    const [question, setQuestion] = useState<Question | undefined>(undefined);
    const [messages, setMessages] = useState<Message[]>([]);

    function toLeaderboardPlayer(p: any): LeaderboardPlayer {
        return {
            id: p.id,
            name: p.name ?? "Unknown",
            score: p.score ?? 0,
            avatar: "https://8bitcn.com/images/goblin.png",
            avatarFallback: p.name.slice(0, 2).toUpperCase(),
        };
    }

    async function loadPlayers() {
        const players = await game.getPlayers();
        setPlayers(players.map((p: any) => toLeaderboardPlayer(p)));
    }

    function addMessage(content: string, type: "player" | "system" = "system", playerId?: string) {
        setMessages((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                type,
                content,
                ...(type === "player" && playerId ? { playerId } : {}),
            },
        ]);
    }

    useEffect(() => {
        async function join() {
            const player = await game.joinGame("Lucas");
            await loadPlayers();
        }

        join();
    }, [roomId]);

    useEffect(() => {
        loadPlayers();
    }, [roomId]);

    useEffect(() => {
        const channel = game.subscribe(async (event) => {
            const payload = event.payload;

            switch (event.type) {
                case "player_join":
                    await loadPlayers();
                    addMessage(`${payload.name} joined the game`);
                    break;
                case "player_left":
                    await loadPlayers();
                    addMessage(`${payload.name} left the game`);
                    break;
                case "game_start":
                    addMessage("The game has started");
                    break;
                case "game_end":
                    addMessage("The game is over");
                    break;
                case "question_start":
                    setQuestion(payload);
                    break;
                case "question_end":
                    setQuestion(payload);
                    break;
            }
        });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId]);

    return (
        <Group orientation="horizontal" className="w-full">
            <Panel minSize="25%" className="h-screen p-2">
                <LeaderboardPanel players={players} />
            </Panel>
            <Panel minSize="25%" className="h-screen p-2">
                <div className="flex h-full flex-col gap-1">
                    <Menubar>
                        <MenubarMenu>
                            <MenubarTrigger>Action</MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem onClick={game.startGame}>Start</MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem onClick={game.next}>Next</MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem onClick={game.endGame}>End</MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                    <QuestionPanel question={question} player={players[0] ?? null} />
                </div>
            </Panel>
            <Panel minSize="25%" className="h-screen p-2">
                <ChatPanel players={players} messages={messages} />
            </Panel>
        </Group>
    );
}
