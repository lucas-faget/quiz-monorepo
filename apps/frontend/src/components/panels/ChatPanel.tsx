import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/8bit/card";
import { ScrollArea } from "@/components/ui/8bit/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/8bit/avatar";
import { Label } from "@/components/ui/8bit/label";
import { Textarea } from "@/components/ui/8bit/textarea";
import Dialogue from "@/components/ui/8bit/blocks/dialogue";
import type { LeaderboardPlayer } from "@/components/ui/8bit/blocks/leaderboard";
import type { Message } from "@/types/Message";

export default function ChatPanel({
    messages,
    players,
    player,
}: {
    messages: Message[];
    players: LeaderboardPlayer[];
    player?: LeaderboardPlayer;
}) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-center">CHAT</CardTitle>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 p-0">
                <ScrollArea className="h-full">
                    <div className="flex flex-col gap-8 px-6 py-2">
                        {messages.map((message, index) => {
                            const player = players.find((p) => p.id === message.playerId);

                            return message.type === "player" && player ? (
                                <Dialogue
                                    key={message.id}
                                    avatarSrc={player.avatar}
                                    avatarFallback={player.avatarFallback}
                                    title={player.name}
                                    description={message.content}
                                    player={player.isCurrentPlayer ?? false}
                                />
                            ) : (
                                <Dialogue
                                    key={message.id}
                                    avatarSrc="https://8bitcn.com/images/8-bit-skull.png"
                                    avatarFallback="SY"
                                    description={message.content}
                                />
                            );
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter>
                {player && (
                    <Label className="flex w-full items-start gap-2.5">
                        <Avatar>
                            <AvatarImage src={player.avatar} alt="@8bitcn" />
                            <AvatarFallback>{player.avatarFallback}</AvatarFallback>
                        </Avatar>
                        <Textarea className="min-w-0 flex-1" placeholder="Type your message here." />
                    </Label>
                )}
            </CardFooter>
        </Card>
    );
}
