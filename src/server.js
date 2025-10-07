// src/server.js

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { getEnvVar } from './utils/getEnvVar.js';
import router from './routers/index.js';
// Імпортуємо middleware
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { UPLOAD_DIR } from './constants/index.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const startServer = () => {
  const app = express();

  // Парсинг JSON
  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );

  // CORS і cookies
  app.use(cors());
  app.use(cookieParser());

  // Логування
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Проста перевірка
  app.get('/', (req, res) => {
    res.json({
      message: 'Hello World!',
    });
  });

  // Підключення основного роутера
  app.use(router);

  // Middleware для 404
  app.use(notFoundHandler);

  // Middleware для обробки помилок
  app.use(errorHandler);

  // Запуск сервера
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  app.use('/uploads', express.static(UPLOAD_DIR));
};
