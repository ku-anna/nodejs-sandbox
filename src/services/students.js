// src/services/students.js
import { StudentsCollection } from '../db/models/student.js';
import createHttpError from 'http-errors';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getStudentById = async (studentId) => {
  return await StudentsCollection.findById(studentId);
};

export const createStudent = async (payload) => {
  return await StudentsCollection.create(payload);
};

export const deleteStudent = async (studentId) => {
  return await StudentsCollection.findOneAndDelete({ _id: studentId });
};

export const updateStudent = async (studentId, payload, options = {}) => {
  const rawResult = await StudentsCollection.findOneAndUpdate(
    { _id: studentId },
    payload,
    {
      new: true,
      upsert: options.upsert || false,
      ...options,
    },
  );

  if (!rawResult) return null;

  return {
    student: rawResult,
    isNew: options.upsert && rawResult.createdAt === rawResult.updatedAt,
  };
};

export const upsertStudentController = async (req, res, next) => {
  const { studentId } = req.params;

  const result = await updateStudent(studentId, req.body, { upsert: true });

  if (!result) {
    return next(createHttpError(404, 'Student not found'));
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Successfully upserted a student!',
    data: result.student,
  });
};

export const getAllStudents = async ({ page, perPage }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const studentsQuery = StudentsCollection.find();
  const studentsCount = await StudentsCollection.find()
    .merge(studentsQuery)
    .countDocuments();

  const students = await studentsQuery.skip(skip).limit(limit).exec();

  const paginationData = calculatePaginationData(studentsCount, perPage, page);

  return {
    data: students,
    ...paginationData,
  };
};
// Тепер сервісна функція getAllStudents приймає об'єкт з параметрами page та perPage, що вказують номер сторінки та кількість записів на сторінці відповідно.
// Функція getAllStudents спочатку розраховує зміщення (skip), що дорівнює кількості записів, що мають бути пропущені перед початком видачі на поточній сторінці. Вона також розраховує ліміт записів, які мають бути повернуті на одній сторінці.
// Далі, функція ініціює запит до бази даних для отримання списку студентів, використовуючи спеціальні методи skip та limit для застосування пагінації. Паралельно, вона робить запит для визначення загальної кількості студентів за допомогою методу countDocuments.
// Після отримання списку студентів і загальної кількості, функція викликає calculatePaginationData, яка обраховує і повертає дані для пагінації, зокрема інформацію про загальну кількість сторінок і чи є наступна чи попередня сторінка.
// Результатом виконання функції є об'єкт, що містить масив з даними про студентів і додаткову інформацію про пагінацію, що дозволяє клієнту легко навігувати між сторінками результатів.
