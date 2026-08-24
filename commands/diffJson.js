import diffJsonFiles from "../services/jsonDiffer.js";
import * as logger from "../utils/logger.js";

export default async function diffJson(file1, file2) {
    try {
        const differences = await diffJsonFiles(file1, file2);

    } catch (err) {
        logger.error(err.message);
    }
}