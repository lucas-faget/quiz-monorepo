import { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/8bit/card";
import { ScrollArea } from "@/components/ui/8bit/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/8bit/avatar";
import { Label } from "@/components/ui/8bit/label";
import { Textarea } from "@/components/ui/8bit/textarea";
import { Progress } from "@/components/ui/8bit/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/8bit/alert";
import { Separator } from "@/components/ui/8bit/separator";
import AnswerCard from "@/components/AnswerCard";
import type { LeaderboardPlayer } from "@/components/ui/8bit/blocks/leaderboard";
import type { Question } from "@/types/Question";
import type { Answer } from "@/types/Answer";

export default function QuestionPanel({
    question,
    player,
    answers,
    onSubmitAnswer,
}: {
    question?: Question;
    player?: LeaderboardPlayer;
    answers: Answer[];
    onSubmitAnswer: (answer: string) => void;
}) {
    const [answer, setAnswer] = useState<string>("");

    function handleSubmit(): void {
        if (!answer.trim()) return;

        onSubmitAnswer(answer);
        setAnswer("");
    }

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
                                    <AnswerCard answer={question.answer} isCorrect={true} isPlayerAnswer={false} />
                                )}
                                {answers.map((answer, index) => (
                                    <AnswerCard key={index} answer={answer.answer} isCorrect={answer.isCorrect} />
                                ))}
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
                        <Textarea
                            className="min-w-0 flex-1"
                            placeholder="Type your answer here."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                        />
                    </Label>
                )}
            </CardFooter>
        </Card>
    );
}
