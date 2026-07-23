import axios from "axios";
import chalk from "chalk";
import { performance } from "node:perf_hooks";

export default async function checkApi(url, options) {
    try {
        const start = performance.now();

        const response = await axios({
            method: options.method,
            url
        });

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
        console.log(`Method        ${options.method}`);
        console.log(`Status        ${response.status} ${response.statusText}`);
        console.log(`Time          ${duration} ms`);
        console.log(`Content-Type  ${contentType}`);
        console.log(`Size          ${sizeInKB} KB`);

    } catch (error) {
    console.log(chalk.red("✗ Request failed"));

        if (error.response) {
            console.log(`Status: ${error.response.status}`);
            console.log(`Message: ${error.response.statusText}`);
        } else if (error.request) {
            console.log("No response received from the server.");
        } else {
            console.log(error.message);
        }
    }
}
