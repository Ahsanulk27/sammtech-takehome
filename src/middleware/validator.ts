import type { Request, Response, NextFunction } from "express";
import type { ZodTypeAny } from "zod";

export const validate = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (result.success === false) {
      return res
        .status(400)
        .json({ errors: result.error.flatten().fieldErrors });
    }
    req.body = result.data;
    next();
  };
};
