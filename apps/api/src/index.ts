import { Hono } from "hono";
import { cors } from "hono/cors";
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

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.route("/games", games);

export default app;
