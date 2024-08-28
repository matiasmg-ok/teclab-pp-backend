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
      const user = await userRepository.findOne({ where: { name: payload.user.name } });
      if(!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      req.body.user = user;

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
