export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number = 400, cause?: unknown) {
        super(message, { cause });
        this.statusCode = statusCode;
    }
}
