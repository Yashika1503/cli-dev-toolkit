import { glob } from "glob";
import { readFile, writeFile } from "node:fs/promises";

const port = process.env.PORT;

export default async function generateEnv() {
    const files = await glob("**/*.{js,jsx,ts,tsx,mjs,cjs}", {ignore: ["node_modules/**"]});

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

    const envContent = variables.map(variable => `${variable}=`);

    const output = envContent.join("\n") + "\n";

    if (variables.length === 0) {
        throw new Error(
            "No environment variables found."
        );
    }

    await writeFile(".env.example", output);
}