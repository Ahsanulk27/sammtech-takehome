import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  status: z.enum(["pending", "in_progress", "completed"]).default("pending"),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
    .refine((val) => new Date(val) > new Date(), "Due date must be in the future"),
});

export const updateTaskSchema = createTaskSchema
  .partial()
  .refine(
    (data) => {
      if (data.dueDate) {
        return new Date(data.dueDate) > new Date();
      }
      return true;
    },
    { message: "Due date must be in the future" }
  );

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;