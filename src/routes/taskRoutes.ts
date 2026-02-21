import { Router } from "express";
import {getAllTasks, getTaskById, createTask, updateTask, deleteTask} from "../controllers/taskController.ts";
import { createTaskSchema, updateTaskSchema } from "../middleware/taskValidation.ts";
import { validate } from "../middleware/validator.ts";
import { authenticate } from "../middleware/authMiddleware.ts";

const taskRouter = Router();

taskRouter.use(authenticate);

taskRouter.get('/', getAllTasks);
taskRouter.get('/:id', getTaskById);
taskRouter.post('/', validate(createTaskSchema), createTask);
taskRouter.put('/:id', validate(updateTaskSchema), updateTask);
taskRouter.delete('/:id', deleteTask)

export default taskRouter;