import axios from "axios";
import { performance } from "node:perf_hooks";

export default async function apiChecker(url, method = "GET") {
    const start = performance.now();

    const response = await axios({
        url,
        method
    });

    const end = performance.now();

    const responseTime = (end - start).toFixed(2);

    const sizeInBytes = Buffer.byteLength(
        JSON.stringify(response.data),
        "utf8"
    );

    return {
        url,
        method,
        status: response.status,
        statusText: response.statusText,
        responseTime,
        contentType:
            response.headers["content-type"] ?? "Unknown",
        sizeInKB: (sizeInBytes / 1024).toFixed(2)
    };
}