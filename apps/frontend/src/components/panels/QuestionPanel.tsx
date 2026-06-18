import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/8bit/card";
import { ScrollArea } from "@/components/ui/8bit/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/8bit/avatar";
import { Label } from "@/components/ui/8bit/label";
import { Textarea } from "@/components/ui/8bit/textarea";
import { Progress } from "@/components/ui/8bit/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/8bit/alert";
import { Separator } from "@/components/ui/8bit/separator";
import type { LeaderboardPlayer } from "@/components/ui/8bit/blocks/leaderboard";
import type { Question } from "@/types/Question";

export default function QuestionPanel({ question, player }: { question?: Question; player?: LeaderboardPlayer }) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-center">QUESTION</CardTitle>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 p-0">
                <ScrollArea className="h-full">
                    {question && (
                        <div className="flex flex-col px-6">
                            <div className="mb-8 flex flex-col gap-2">
                                <div className="flex justify-between text-sm">
                                    <span>Time left</span>
                                    <span>75%</span>
                                </div>
                                <Progress value={70} variant="retro" />
                            </div>
                            <Alert className="bg-secondary">
                                <AlertTitle>Question {question.position}/20</AlertTitle>
                                <AlertDescription>{question.title}</AlertDescription>
                            </Alert>
                            <Separator className="mt-6 mb-4" />
                            <div className="flex flex-col gap-4">
                                {question.answer && (
                                    <div className="bg-background flex h-12 items-center rounded-lg border-2 border-green-400 px-3 text-green-400">
                                        {question.answer}
                                    </div>
                                )}
                                {/* <div className="bg-background flex h-12 items-center rounded-lg border-2 border-red-400 px-3 text-red-400">
                                    Answer 1
                                </div>
                                <div className="bg-background flex h-12 items-center rounded-lg border-2 border-amber-400 px-3 text-amber-400">
                                    Answer 2
                                </div>
                                <div className="bg-background flex h-12 items-center rounded-lg border-2 border-green-400 px-3 text-green-400">
                                    Answer 3
                                </div> */}
                            </div>
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
            <CardFooter>
                {player && (
                    <Label className="flex w-full items-start gap-2.5">
                        <Avatar>
                            <AvatarImage src={player.avatar} alt="@8bitcn" />
                            <AvatarFallback>{player.avatarFallback}</AvatarFallback>
                        </Avatar>
                        <Textarea className="min-w-0 flex-1" placeholder="Type your answer here." />
                    </Label>
                )}
            </CardFooter>
        </Card>
    );
}
