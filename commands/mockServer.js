import startMockServer from "../services/mockServer.js";
import * as logger from "../utils/logger.js";

export default async function mockServer(schema, options) {
    try {
        await startMockServer(
            schema,
            Number(options.port)
        );
    } catch (err) {
        logger.error(err.message);
    }
}