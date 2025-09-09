// src/index.js

import { startServer } from './server.js';
import { initMongoDB } from './db/initMongoDB.js';

const bootstrap = async () => {
  await initMongoDB();
  startServer();
};

bootstrap();

//  створимо функцію bootstrap, яка буде ініціалізувати підключення до бази даних, після чого запускати сервер.
