// src/routers/students.js

import { Router } from 'express';

import {
  getStudentsController,
  getStudentByIdController,
} from '../controllers/students';
import { ctrlWrapper } from '../utils/ctrlWrapper';

const router = Router();

router.get('/students', ctrlWrapper(getStudentsController));

router.get('/students/:studentId', ctrlWrapper(getStudentByIdController));

export default router;
// Завдяки цьому блок try...catch в самому контролері додавати немає потреби, що прибирає зайве дублювання шаблонного коду.
