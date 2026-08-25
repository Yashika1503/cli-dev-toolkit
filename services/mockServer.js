import express from "express";
import { readFile } from "node:fs/promises";

export default async function startMockServer(schemaFile, port) {
    let content;

    try {
        content = await readFile(schemaFile, "utf8");
    } catch {
        throw new Error(`Schema file not found: ${schemaFile}`);
    }

    let schema;

    try {
        schema = JSON.parse(content);
    } catch {
        throw new Error(`Invalid JSON in schema file: ${schemaFile}`);
    }

    const app = express();

    app.use(express.json());

    for (const [route, response] of Object.entries(schema)) {
        const [method, path] = route.split(" ");
        const allowedMethods = [
            "get",
            "post",
            "put",
            "patch",
            "delete"
        ];

        app[method.toLowerCase()](path, (req, res) => {
            res.json(response);
        });

        if (!allowedMethods.includes(method.toLowerCase())) {
            throw new Error(`Unsupported HTTP method: ${method}`);
        }

        if (!method || !path) {
            throw new Error(`Invalid route definition: ${route}`);
        }
    }

    app.listen(port, () => {
        console.log(`Mock server running on http://localhost:${port}`);
        console.log("\nRoutes:");

        for (const route of Object.keys(schema)) {
            console.log(`  ${route}`);
        }
    });
}