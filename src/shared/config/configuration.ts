import * as Joi from 'joi';

export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT || '3000', 10),
  APP_NAME: process.env.APP_NAME || 'SmartMedical Point',
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3001',

  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.NODE_ENV === 'development',
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION || '7d',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '30d',
  },

  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.SMTP_FROM || 'noreply@smartmedical.com',
  },

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
    uploadPath: process.env.UPLOAD_PATH || './uploads',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },

  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
  },
});

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().default(3000),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306),  
  DB_USERNAME: Joi.string().required(),

  DB_PASSWORD: Joi.string().allow('').optional(), 

  DB_DATABASE: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('7d'),

  SMTP_HOST: Joi.string(),
  SMTP_PORT: Joi.number(),
  SMTP_USER: Joi.string(),
  SMTP_PASSWORD: Joi.string(),
});
