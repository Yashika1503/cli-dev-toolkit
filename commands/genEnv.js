import generateEnv from "../services/envGenerator.js";
import * as logger from "../utils/logger.js";

export default async function genEnv() {
    try {
        await generateEnv();

        logger.success(
            "✓ .env.example generated successfully"
        )
    } catch (err) {
        logger.error(err.message);
    }
}