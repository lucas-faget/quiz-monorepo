import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/8bit/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/8bit/avatar";
import { Label } from "@/components/ui/8bit/label";
import { Textarea } from "@/components/ui/8bit/textarea";
import Dialogue from "@/components/ui/8bit/blocks/dialogue";
import type { LeaderboardPlayer } from "@/components/ui/8bit/blocks/leaderboard";

export default function ChatPanel({ players }: { players: LeaderboardPlayer[] }) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-center">CHAT</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-8">
                    {players.map((player, index) => (
                        <Dialogue
                            avatarSrc={player.avatar}
                            avatarFallback={player.avatarFallback}
                            title={player.name}
                            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                            player={index % 2 === 0}
                        />
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Label className="flex w-full items-start gap-2.5">
                    <Avatar>
                        <AvatarImage src={players[4].avatar} alt="@8bitcn" />
                        <AvatarFallback>{players[4].avatarFallback}</AvatarFallback>
                    </Avatar>
                    <Textarea className="min-w-0 flex-1" placeholder="Type your message here." />
                </Label>
            </CardFooter>
        </Card>
    );
}
