export default function Answer({
    answer,
    isCorrect,
    isPlayerAnswer = true,
}: {
    answer: string;
    isCorrect: boolean;
    isPlayerAnswer?: boolean;
}) {
    const colorClass: string = isCorrect
        ? `border-green-400 text-green-400 ${isPlayerAnswer ? "bg-background" : "bg-green-400/20"}`
        : `border-red-400 text-red-400 ${isPlayerAnswer ? "bg-background" : "bg-red-400/20"}`;
    const sign: string = isPlayerAnswer ? (isCorrect ? "+" : "-") : ">";

    return <div className={`flex h-12 items-center rounded-lg border-2 px-3 ${colorClass}`}>{`${sign} ` + answer}</div>;
}
