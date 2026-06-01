import { Hono } from "hono";
import { cors } from "hono/cors";
import { openAPIRouteHandler } from "hono-openapi";
import { games } from "./routes/games";

const app = new Hono();

app.use(
    "*",
    cors({
        origin: "http://localhost:4321",
        allowHeaders: ["Content-Type"],
        allowMethods: ["POST", "GET"],
    }),
);

app.get(
    "/openapi",
    openAPIRouteHandler(app, {
        documentation: {
            info: {
                title: "Quiz API",
                version: "1.0.0",
                description: "Quiz API",
            },
        },
    }),
);

app.route("/games", games);

export default app;
