import axios from "axios";
import chalk from "chalk";
import { performance } from "node:perf_hooks";

export default async function checkApi(url) {
    try {
        const start = performance.now();

        const response = await axios.get(url);

        const end = performance.now();

        const duration = (end - start).toFixed(2);

        const contentType = response.headers["content-type"] ?? "Unknown";

        const sizeInBytes = Buffer.byteLength(
            JSON.stringify(response.data),
            "utf8"
        );

        const sizeInKB = (sizeInBytes / 1024).toFixed(2);

        console.log(chalk.green("✓ API is reachable\n"));

        console.log(`URL           ${url}`);
        console.log(`Status        ${response.status} ${response.statusText}`);
        console.log(`Time          ${duration} ms`);
        console.log(`Content-Type  ${contentType}`);
        console.log(`Size          ${sizeInKB} KB`);

    } catch (error) {
        console.log(chalk.red("✗ Request failed"));

        console.log(error.message);
    }
}