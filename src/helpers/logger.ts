import pino from "pino";
import dotenv from "dotenv";
dotenv.config();

const isProd = process.env.NODE_ENV === "production";

const logger = pino({
  level: isProd ? "info" : "debug",
  transport: !isProd
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
});

function logError(context: string, error: unknown) {
  if (error instanceof Error) {
    logger.error(`${context}: ${error.message}`);
    logger.error(error.stack);
  } else {
    logger.error(`${context}: Unknown error`);
    logger.error(JSON.stringify(error));
  }
}

export { logger, logError };
