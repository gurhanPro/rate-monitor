
require('dotenv').config();

export const AppConfigs = {
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,

    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: parseInt(process.env.REDIS_PORT),
    REDIS_DB: parseInt(process.env.REDIS_DB),

    ECO_TELEGRAM_BOT_TOKEN: process.env.ECO_TELEGRAM_BOT_TOKEN,
    ECO_CASH_CHAT_ID: process.env.ECO_CASH_CHAT_ID,
    ECO_CASH_WATCH_CHAT_ID: process.env.ECO_CASH_WATCH_CHAT_ID,
    
    APPLICATION_PORT: process.env.APPLICATION_PORT,
    
};