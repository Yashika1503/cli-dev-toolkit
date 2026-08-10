import diffJsonFiles from "../services/jsonDiffer.js";
import * as logger from "../utils/logger.js";

export default async function diffJson(file1, file2) {
    try {
        const differences = await diffJsonFiles(file1, file2);

        console.log(differences);

    } catch (err) {
        logger.error(err.message);
    }
}