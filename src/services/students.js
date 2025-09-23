// src/services/students.js
import { StudentsCollection } from '../db/models/student.js';
import createHttpError from 'http-errors';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

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

// export const getAllStudents = async ({
//   page = 1,
//   perPage = 10,
//   sortOrder = SORT_ORDER.ASC,
//   sortBy = '_id',
// }) => {
//   const limit = perPage;
//   const skip = (page - 1) * perPage;

//   const studentsQuery = StudentsCollection.find();
//   const studentsCount = await StudentsCollection.find()
//     .merge(studentsQuery)
//     .countDocuments();

//   const students = await studentsQuery
//     .skip(skip)
//     .limit(limit)
//     .sort({ [sortBy]: sortOrder })
//     .exec();

//   const paginationData = calculatePaginationData(studentsCount, perPage, page);

//   return {
//     data: students,
//     ...paginationData,
//   };
// };
// Тепер ми маємо можливість сортувати результати запиту до бази даних студентів. Параметри sortOrder та sortBy, визначені зі значеннями за замовчуванням, дозволяють визначити порядок сортування та поле, за яким потрібно виконати сортування (_id за замовчуванням).
// Під час виклику функції, studentsQuery — запит до бази даних, що ініціюється за допомогою StudentsCollection.find(), налаштовується так, що він тепер включає, окрім методів skip та limit (для реалізації пагінації), ще й метод sort. Цей метод дозволяє організувати записи за полем, вказаним у sortBy, у порядку, заданому
// у sortOrder. Таке сортування дозволяє користувачам отримувати дані в порядку, який найкраще відповідає їхнім потребам, забезпечуючи більшу гнучкість та зручність у взаємодії з даними.

// src/services/students.js

/* Решта коду файла */

export const getAllStudents = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const studentsQuery = StudentsCollection.find();

  if (filter.gender) {
    studentsQuery.where('gender').equals(filter.gender);
  }
  if (filter.maxAge) {
    studentsQuery.where('age').lte(filter.maxAge);
  }
  if (filter.minAge) {
    studentsQuery.where('age').gte(filter.minAge);
  }
  if (filter.maxAvgMark) {
    studentsQuery.where('avgMark').lte(filter.maxAvgMark);
  }
  if (filter.minAvgMark) {
    studentsQuery.where('avgMark').gte(filter.minAvgMark);
  }

  const studentsCount = await StudentsCollection.find()
    .merge(studentsQuery)
    .countDocuments();

  const students = await studentsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(studentsCount, perPage, page);

  return {
    data: students,
    ...paginationData,
  };
};
// У цьому оновленому коді функція getAllStudents приймає додатковий параметр filter, який є об'єктом, що містить умови фільтрації. Якщо в об'єкті filter присутні певні ключ
// const [studentsCount, students] = await Promise.all([
//   StudentsCollection.find().merge(studentsQuery).countDocuments(),
//   studentsQuery
//     .skip(skip)
//     .limit(limit)
//     .sort({ [sortBy]: sortOrder })
//     .exec(),
// ]);
