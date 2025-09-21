// src/services/students.js
import { StudentsCollection } from '../db/models/student.js';
import createHttpError from 'http-errors';

export const getAllStudents = async () => {
  return await StudentsCollection.find();
};

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
