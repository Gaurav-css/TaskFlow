import express from 'express';
import { body } from 'express-validator';
import {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    getTrash,
    restoreTask,
    permanentDeleteTask,
} from '../controllers/task.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = express.Router();

router.route('/')
    .get(protect, getTasks)
    .post(
        protect,
        [
            body('title', 'Title is required').not().isEmpty(),
        ],
        validate,
        createTask
    );

router.route('/trash')
    .get(protect, getTrash);

router.route('/:id')
    .put(protect, updateTask)
    .delete(protect, deleteTask);

router.route('/:id/restore')
    .put(protect, restoreTask);

router.route('/:id/permanent')
    .delete(protect, permanentDeleteTask);

export default router;
