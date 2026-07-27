import apiChecker from "../services/apiChecker.js";
import * as logger from "../utils/logger.js";

export default async function checkApi(url, options) {
    try {
        const result = await apiChecker({
            url,
            method: options.method,
            timeout: Number(options.timeout),
            headers: options.header
        });

        logger.success("✓ API is reachable");
        console.log();

        logger.info("URL", result.url);
        logger.info("Method", result.method);
        logger.info(
            "Status",
            `${result.status} ${result.statusText}`
        );
        logger.info("Timeout", `${result.timeout} ms`);
        logger.info(
            "Time",
            `${result.responseTime} ms`
        );
        logger.info(
            "Content-Type",
            result.contentType
        );
        logger.info(
            "Size",
            `${result.sizeInKB} KB`
        );

        if (Object.keys(result.requestHeaders).length > 0) {
            console.log("\nRequest Headers");

            for (const [key, value] of Object.entries(result.requestHeaders)) {
                logger.info(key, value);
            }
        }
    } catch (err) {
        logger.error("✗ Request failed");

        if (err.code === "ECONNABORTED") {
            logger.error("Request timed out.");
            return;
        }

        if (err.response) {
            logger.info(
                "Status",
                `${err.response.status} ${err.response.statusText}`
            );
        } else {
            logger.error(err.message);
        }
    }
}