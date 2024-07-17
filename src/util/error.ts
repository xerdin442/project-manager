import { Request, Response } from "express"
import { validationResult } from "express-validator"

export const validateRequest = (req: Request, res: Response) => {
  // Extract all validation errors, if any, and return the first error message
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    const message = errors.array()[0]
    return res.status(400).json({ message })
  }
}