// src/controllers/students.js
import {
  getAllStudents,
  getStudentById,
  createStudent,
  deleteStudent,
  updateStudent,
} from '../services/students.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

// // GET /students (with pagination)
// export const getStudentsController = async (req, res) => {
//   const { page, perPage } = parsePaginationParams(req.query);

//   const { sortBy, sortOrder } = parseSortParams(req.query);

//   const students = await getAllStudents({
//     page,
//     perPage,
//     sortBy,
//     sortOrder,
//   });

//   res.json({
//     status: 200,
//     message: 'Successfully found students!',
//     data: students,
//   });
// };
// GET /students/:studentId
export const getStudentByIdController = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const student = await getStudentById(studentId);

    if (!student) {
      throw createHttpError(404, 'Student not found');
    }

    res.json({
      status: 200,
      message: `Successfully found student with id ${studentId}!`,
      data: student,
    });
  } catch (err) {
    next(err);
  }
};

// POST /students
export const createStudentController = async (req, res, next) => {
  try {
    const student = await createStudent(req.body);

    res.status(201).json({
      status: 201,
      message: `Successfully created a student!`,
      data: student,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /students/:studentId
export const deleteStudentController = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const student = await deleteStudent(studentId);

    if (!student) {
      return next(createHttpError(404, 'Student not found'));
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// PATCH /students/:studentId
export const patchStudentController = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const result = await updateStudent(studentId, req.body);

    if (!result) {
      return next(createHttpError(404, 'Student not found'));
    }

    res.json({
      status: 200,
      message: `Successfully patched a student!`,
      data: result.student,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /students/:studentId (upsert)
export const upsertStudentController = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const result = await updateStudent(studentId, req.body, {
      upsert: true, // створює нового, якщо не знайдено
    });

    if (!result) {
      return next(createHttpError(404, 'Student not found'));
    }

    // якщо створений — 201, якщо оновлений — 200
    const status = result.isNew ? 201 : 200;

    res.status(status).json({
      status,
      message: `Successfully upserted a student!`,
      data: result.student,
    });
  } catch (err) {
    next(err);
  }
};

export const getStudentsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const students = await getAllStudents({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found students!',
    data: students,
  });
};
