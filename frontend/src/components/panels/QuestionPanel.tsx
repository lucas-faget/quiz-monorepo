import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/8bit/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/8bit/avatar";
import { Label } from "@/components/ui/8bit/label";
import { Textarea } from "@/components/ui/8bit/textarea";
import { Progress } from "@/components/ui/8bit/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/8bit/alert";
import { Separator } from "@/components/ui/8bit/separator";
import type { LeaderboardPlayer } from "@/components/ui/8bit/blocks/leaderboard";

export default function QuestionPanel({ player }: { player: LeaderboardPlayer }) {
    return (
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
                    <AlertDescription>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</AlertDescription>
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
                        <AvatarImage src={player.avatar} alt="@8bitcn" />
                        <AvatarFallback>{player.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <Textarea className="min-w-0 flex-1" placeholder="Type your answer here." />
                </Label>
            </CardFooter>
        </Card>
    );
}
