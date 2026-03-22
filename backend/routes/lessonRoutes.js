import express from 'express'
import { createLesson, deleteLesson, getLesson } from '../controller/lessonController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router()

router.post('/lessons', requireAuth, createLesson);
router.get('/lessons', requireAuth, getLesson);
router.delete('/lessons/:id', requireAuth, deleteLesson);

export default router