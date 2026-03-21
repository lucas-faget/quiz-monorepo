import { Group, Panel } from "react-resizable-panels";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/8bit/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/8bit/avatar";
import { Label } from "@/components/ui/8bit/label";
import { Textarea } from "@/components/ui/8bit/textarea";
import { Progress } from "@/components/ui/8bit/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/8bit/alert";
import { Separator } from "@/components/ui/8bit/separator";
import Leaderboard from "@/components/ui/8bit/blocks/leaderboard";
import Dialogue from "@/components/ui/8bit/blocks/dialogue";

const players = [
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
            <Panel minSize="25%" className="p-4">
                <Leaderboard
                    className="h-full"
                    players={players}
                    maxPlayers={10}
                    showRank={true}
                    showAvatar={true}
                    currentPlayerId="5"
                    title="LEADERBOARD"
                />
            </Panel>
            <Panel minSize="25%" className="p-4">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="text-center">QUESTION</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-2 flex justify-between text-sm">
                            <span>Time left</span>
                            <span>75%</span>
                        </div>
                        <Progress value={70} variant="retro" className="mb-8" />
                        <Alert className="bg-secondary">
                            <AlertTitle>Question 1/20</AlertTitle>
                            <AlertDescription>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            </AlertDescription>
                        </Alert>
                        <Separator className="mt-6 mb-4" />
                        <div className="flex flex-col gap-4">
                            <div className="bg-background flex h-12 items-center rounded-lg border-2 border-red-400 px-3 text-red-400">
                                Answer 1
                            </div>
                            <div className="bg-background flex h-12 items-center rounded-lg border-2 border-amber-400 px-3 text-amber-400">
                                Answer 2
                            </div>
                            <div className="bg-background flex h-12 items-center rounded-lg border-2 border-green-400 px-3 text-green-400">
                                Answer 3
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Label className="flex w-full items-start gap-2.5">
                            <Avatar>
                                <AvatarImage src="https://8bitcn.com/images/pixelized-8bitcnorc.jpg" alt="@8bitcn" />
                                <AvatarFallback>P1</AvatarFallback>
                            </Avatar>
                            <Textarea className="min-w-0 flex-1" placeholder="Type your answer here." />
                        </Label>
                    </CardFooter>
                </Card>
            </Panel>
            <Panel minSize="25%" className="p-4">
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
            </Panel>
        </Group>
    );
}
