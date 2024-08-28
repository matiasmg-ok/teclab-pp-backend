import { Request, Response } from "express";

export default interface IController {
  create?: (req: Request, res: Response) => any;
  update?: (req: Request, res: Response) => any;
  delete?: (req: Request, res: Response) => any;
  getMany?: (req: Request, res: Response) => any;
  getOne?: (req: Request, res: Response) => any;
}