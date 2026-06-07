import { resolver } from "hono-openapi";

function response(status: number, schema: any, description = "Success") {
    return {
        [status]: {
            description,
            content: {
                "application/json": {
                    schema: resolver(schema),
                },
            },
        },
    };
}

export const ok = (schema: any, description = "OK") => response(200, schema, description);
export const created = (schema: any, description = "Created") => response(201, schema, description);
export const badRequest = (schema: any, description = "Bad Request") => response(400, schema, description);
export const forbidden = (schema: any, description = "Forbidden") => response(403, schema, description);
export const notFound = (schema: any, description = "Not Found") => response(404, schema, description);
export const conflict = (schema: any, description = "Conflict") => response(409, schema, description);
export const internalServerError = (schema: any, description = "Internal Server Error") =>
    response(500, schema, description);
