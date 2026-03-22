import { Group, Panel } from "react-resizable-panels";
import LeaderboardPanel from "@/components/panels/LeaderboardPanel";
import QuestionPanel from "@/components/panels/QuestionPanel";
import ChatPanel from "@/components/panels/ChatPanel";
import type { LeaderboardPlayer } from "@/components/ui/8bit/blocks/leaderboard";

const players: LeaderboardPlayer[] = [
    {
        id: "1",
        name: "Player 1",
        score: 125000,
        avatar: "https://8bitcn.com/images/goblin.png",
        avatarFallback: "P1",
    },
    {
        id: "2",
        name: "Player 2",
        score: 98500,
        avatar: "https://8bitcn.com/images/goblin.png",
        avatarFallback: "P2",
    },
    {
        id: "3",
        name: "Player 3",
        score: 87500,
        avatar: "https://8bitcn.com/images/goblin.png",
        avatarFallback: "P3",
    },
    {
        id: "4",
        name: "Player 4",
        score: 76500,
        avatar: "https://8bitcn.com/images/goblin.png",
        avatarFallback: "P4",
    },
    {
        id: "5",
        name: "Player 5",
        score: 68500,
        avatar: "https://8bitcn.com/images/pixelized-8bitcnorc.jpg",
        avatarFallback: "P5",
    },
];

export default function RoomPanels() {
    return (
        <Group orientation="horizontal" className="w-full">
            <Panel minSize="25%" className="h-screen p-2">
                <LeaderboardPanel players={players} />
            </Panel>
            <Panel minSize="25%" className="h-screen p-2">
                <QuestionPanel player={players[4]} />
            </Panel>
            <Panel minSize="25%" className="h-screen p-2">
                <ChatPanel players={players} />
            </Panel>
        </Group>
    );
}
