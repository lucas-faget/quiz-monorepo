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

export const ok = (schema: any, description = "Success") => response(200, schema, description);
