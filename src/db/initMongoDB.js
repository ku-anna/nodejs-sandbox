// src/db/initMongoDB.js

import mongoose from 'mongoose';

import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoDB = async () => {
  try {
    const user = getEnvVar('MONGODB_USER');
    const pwd = getEnvVar('MONGODB_PASSWORD');
    const url = getEnvVar('MONGODB_URL');
    const db = getEnvVar('MONGODB_DB');

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
    );
    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.log('Error while setting up mongo connection', e);
    throw e;
  }
};

// Щоб приєднатися до бази даних, всередині блоку try виконаємо виклик методу connect з бібліотеки mongoose за допомогою mongoose.connect, до якого як аргумент передамо рядок з посиланням для підключення (connection string). Для формування цього посилання ми використаємо утилітарну функцію env, яка забезпечує доступ до змінних оточення.
