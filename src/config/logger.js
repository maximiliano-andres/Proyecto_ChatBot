import pino from "pino";

const isProd = process.env.NODE_ENV === "production";
export const logger = pino(
    isProd
        ? undefined
        : {
            transport: {
                target: "pino-pretty",
                options: {
                    colorize: true,
                    translateTime: "yyyy-mm-dd HH:MM:ss",
                    ignore: "pid,hostname",
                },
            },
        }
);
