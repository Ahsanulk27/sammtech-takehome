import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import type { Response } from "express";
import type { AuthRequest } from "../middleware/authMiddleware.ts";
import dotenv from "dotenv";
dotenv.config();
import type {
  CreateTaskInput,
  UpdateTaskInput,
} from "../middleware/taskValidation.ts";
import { Status } from "../generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter });

export const getAllTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { status } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const whereClause = {
      userId: userId,
      ...(status ? { status: status as Status } : {}),
    };
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where: whereClause,
        skip,
        take: limit,
      }),
      prisma.task.count({ where: whereClause }),
    ]);
    return res
      .status(200)
      .json({
        tasks,
        // pagination: {
        //   total,
        //   page,
        //   limit,
        //   totalPages: Math.ceil(total / limit),
        // },
      });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch tasks", error });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const taskId = req.params.id as string;
    const task = await prisma.task.findFirst({
      where: {
        userId: userId,
        id: taskId,
      },
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ message: "Task fetched successfully", task });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch task", error });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { title, description, status, dueDate } = req.body as CreateTaskInput;

    const task = await prisma.task.create({
      data: {
        userId: userId,
        title,
        description: description ?? null,
        status,
        dueDate: new Date(dueDate),
      },
    });
    return res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    return res.status(500).json({ message: "Could not create task", error });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const taskId = req.params.id as string;
    const { title, description, status, dueDate } = req.body as UpdateTaskInput;

    const existingTask = await prisma.task.findFirst({
      where: {
        userId: userId,
        id: taskId,
      },
    });
    if (!existingTask) {
      return res.status(404).json({ message: "task not found" });
    }
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
        userId: userId,
      },
      data: {
        title: title ?? existingTask.title,
        description: description ?? existingTask.description,
        status: status ?? existingTask.status,
        dueDate: dueDate ? new Date(dueDate) : existingTask.dueDate,
      },
    });
    return res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    return res.status(500).json({ message: "Could not update task", error });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const taskId = req.params.id as string;
    const existingTask = await prisma.task.findFirst({
      where: {
        userId: userId,
        id: taskId,
      },
    });
    if (!existingTask) {
      return res.status(404).json({ message: "task not found" });
    }

    const deletedTask = await prisma.task.delete({
      where: {
        id: taskId,
        userId: userId,
      },
    });
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete task", error });
  }
};
