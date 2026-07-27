import { readFile } from "node:fs/promises";
import axios from "axios";
import { performance } from "node:perf_hooks";

function parseHeaders(headerArray) {
    const headers = {};

    for (const header of headerArray) {
        const [key, ...value] = header.split(":");

        headers[key.trim()] = value.join(":").trim();
    }

    return headers;
}

export default async function apiChecker({
    url,
    method = "GET",
    timeout = 5000,
    headers = [],
    bodyFile
}) {
    const requestHeaders = parseHeaders(headers);
    const start = performance.now();

    let requestBody;

    if (bodyFile) {
        try {
            const fileContents = await readFile(bodyFile, "utf8");
            requestBody = JSON.parse(fileContents);
        } catch (error) {
            throw new Error(`Failed to read or parse JSON file: ${bodyFile}`);
        }
    }

    const response = await axios({
        url,
        method,
        timeout,
        headers: requestHeaders,
        data: requestBody
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
        timeout,
        statusText: response.statusText,
        responseTime,
        contentType:
            response.headers["content-type"] ?? "Unknown",
        sizeInKB: (sizeInBytes / 1024).toFixed(2),
        requestHeaders,
        requestBody
    };
}