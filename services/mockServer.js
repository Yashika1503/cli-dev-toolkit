import express from "express";
import { readFile } from "node:fs/promises";

export default async function startMockServer(schemaFile, port) {
    const content = await readFile(schemaFile, "utf8");
    const schema = JSON.parse(content);

    const app = express();

    app.use(express.json());

    for (const [route, response] of Object.entries(schema)) {
        const [method, path] = route.split(" ");

        app[method.toLowerCase()](path, (req, res) => {
            res.json(response);
        });
    }

    console.log(schema);

    app.listen(port, () => {
        console.log(`Mock server running on http://localhost:${port}`);
    });
}
