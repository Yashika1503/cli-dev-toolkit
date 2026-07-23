import apiChecker from "../services/apiChecker.js";
import * as logger from "../utils/logger.js";

export default async function checkApi(url, options) {
    try {
        const result = await apiChecker(
            url,
            options.method
        );

        logger.success("✓ API is reachable\n");

        logger.info("URL", result.url);
        logger.info("Method", result.method);
        logger.info(
            "Status",
            `${result.status} ${result.statusText}`
        );
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
    } catch (err) {
        logger.error("✗ Request failed");

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