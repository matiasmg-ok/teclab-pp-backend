import { Request, Response } from "express";
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../utils/passwordManager";
import { config } from "dotenv";
import AppDataSource from "../utils/database";
config();

const userRepository = AppDataSource.getRepository(User);

export async function login(req: Request, res: Response) {
  try {
    const { password } = req.body;
    let user = await userRepository.findOne({ where: { name: 'admin' } })

    if (!user) {
      user = new User();
      user.name = 'admin'
      user.password = await hashPassword(password);
      await userRepository.save(user);
    }
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ user: { name: user.name } }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}