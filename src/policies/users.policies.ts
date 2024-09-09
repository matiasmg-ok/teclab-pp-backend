import { Response, Request, NextFunction } from "express";
import AppDataSource from "../utils/database";
import { User } from "../entity/User";
import { JwtPayload, verify } from "jsonwebtoken";
import { config } from "dotenv";
config();

const userRepository = AppDataSource.getRepository(User);

export default {
  isLoggedIn: async (req: Request, res: Response, next: NextFunction) => {
    // Bearer token
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const payload: JwtPayload = verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
      const user = await userRepository.findOne({ where: { name: payload.user.name } }) as any;
      if(!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      delete user.password;

      req.body.user = user;

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  },
  isAdmin: async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user as User;
    if(!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if(user.profile !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
  }
}
