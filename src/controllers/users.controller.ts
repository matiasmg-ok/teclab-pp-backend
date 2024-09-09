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
    const { email, password } = req.body;
    let user = await userRepository.findOne({ where: { email } })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

    return res.status(200).json({ token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = new User;
    user.name = name;
    user.email = email;
    user.password = await hashPassword(password);

    const insertion = await userRepository.save(user);

    const token = jwt.sign({ user: { id: insertion.id } }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

    return res.status(201).json({ token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });    
  }
}