// src/db/models/student.js

import { Schema, model } from 'mongoose';

const studentsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other'],
    },
    avgMark: {
      type: Number,
      required: true,
    },
    onDuty: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Останнім кроком створюємо модель студента StudentsCollection за допомогою схеми.
export const StudentsCollection = model('students', studentsSchema);

// Першим аргументом у конструктор схеми ми передаємо об'єкт, де кожний ключ відповідає полю у документі, а їх значеннями є об'єкти, що описують ці поля:
// type — вказує тип даних, який ми очікуємо для цього поля. У нашому випадку це String, Number та Boolean.
// required — ця властивість вказує, чи є поле обов'язковим для заповнення. Якщо встановлено значення true, то поле повинно бути відправлене з кожним запитом.
// enum — це перелік допустимих значень для поля. У нашому випадку для поля gender можливі тільки значення "male", "female" або "other".
// default — вказує значення за замовчуванням, якщо поле не вказано при створенні документа.
// Другим аргументом передаємо додаткові параметри схеми:
// timestamps — встановлює значення true, щоб автоматично створювати поля createdAt та updatedAt, які вказують на час створення та оновлення документа.
// versionKey — вказує, чи має бути створене поле __v для відстеження версій документу. У нашому випадку ми встановлюємо false, щоб це поле не створювалося.
