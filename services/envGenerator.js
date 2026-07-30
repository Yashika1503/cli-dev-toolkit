import { glob } from "glob";
import { readFile } from "node:fs/promises";

const port = process.env.PORT;

export default async function generateEnv() {
    const files = await glob("**/*.js", {
        ignore: [
            "node_modules/**"
        ]
    });

    const envVars = new Set();

    for (const file of files) {
        const content = await readFile(file, "utf8");

        const regex = /process\.env\.([A-Za-z0-9_]+)/g;

        const matches = content.matchAll(regex);

        for (const match of matches) {
            envVars.add(match[1]);
        }
    }

    const variables = [...envVars].sort();

    console.log(variables);
}