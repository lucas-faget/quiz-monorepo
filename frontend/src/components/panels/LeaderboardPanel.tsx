import Leaderboard, { type LeaderboardPlayer } from "@/components/ui/8bit/blocks/leaderboard";

export default function LeaderboardPanel({ players }: { players: LeaderboardPlayer[] }) {
    return (
        <Leaderboard
            className="h-full"
            players={players}
            maxPlayers={10}
            showRank
            showAvatar
            currentPlayerId="5"
            title="LEADERBOARD"
        />
    );
}
