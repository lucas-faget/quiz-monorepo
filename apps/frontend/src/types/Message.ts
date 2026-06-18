export interface Message {
    id: string;
    content: string;
    type: "player" | "system";
    playerId?: string;
}
