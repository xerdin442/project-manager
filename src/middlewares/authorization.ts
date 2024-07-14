import { Request, Response, NextFunction } from 'express'

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/auth/login')
  }
  next()
}