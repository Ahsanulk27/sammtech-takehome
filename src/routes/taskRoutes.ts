import { Router } from "express";
import {getAllTasks, getTaskById, createTask, updateTask, deleteTask} from "../controllers/taskController.js";
import { createTaskSchema, updateTaskSchema } from "../middleware/taskValidation.js";
import { validate } from "../middleware/validator.js";
import { authenticate } from "../middleware/authMiddleware.js";

const taskRouter = Router();

taskRouter.use(authenticate);

taskRouter.get('/', getAllTasks);
taskRouter.get('/:id', getTaskById);
taskRouter.post('/', validate(createTaskSchema), createTask);
taskRouter.put('/:id', validate(updateTaskSchema), updateTask);
taskRouter.delete('/:id', deleteTask)

export default taskRouter;