// Створимо сервіс студентів у файлі src/services/students.js, в якому додамо функції:

// для отримання інформації про всіх студентів
// для отримання інформації про одного студента за _id.

// src/services/students.js
import { StudentsCollection } from '../db/models/student.js';

export const getAllStudents = async () => {
  const students = await StudentsCollection.find();
  return students;
};
// Метод find() моделі StudentsCollection — це вбудований метод Mongoose для пошуку документів у MongoDB. Викликаючи find() на моделі StudentsCollection, ми отримаємо масив документів, що відповідають моделі Student. У випадку, якщо колекція студентів порожня, метод повертає порожній масив

export const getStudentById = async (studentId) => {
  const student = await StudentsCollection.findById(studentId);
  return student;
};
// Метод findById() моделі StudentsCollection — це вбудований метод Mongoose для пошуку одного документа у MongoDB за його унікальним ідентифікатором. Викликаючи findById() на моделі StudentsCollection із вказаним ідентифікатором студента, ми отримаємо документ, що відповідає цьому ідентифікатору, як об'єкт Student. Якщо документ із заданим ідентифікатором не буде знайдено, метод поверне null

export const createStudent = async (payload) => {
  const student = await StudentsCollection.create(payload);
  return student;
};
// У параметрі payload будемо очікувати об’єкт даних студента з наступними властивостями:
// {
//   "name": "John Doe",
//   "email": "jojndoe@mail.com",
//   "age": 10,
//   "gender": "male",
//   "avgMark": 10.3,
//   "onDuty": true
// }

export const deleteStudent = async (studentId) => {
  const student = await StudentsCollection.findOneAndDelete({
    _id: studentId,
  });

  return student;
};
