import { glob } from "glob";
import { readFile } from "node:fs/promises";

export default async function generateEnv() {
    const files = await glob("**/*.js", {
        ignore: [
            "node_modules/**"
        ]
    });

    for (const file of files) {
        const content = await readFile(file, "utf8");

        console.log(`${file} (${content.length} characters)`);
    }
}