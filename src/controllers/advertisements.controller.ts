import { Request, Response } from "express";
import { Advertisement } from "../entity/Advertisement";
import AppDataSource from "../utils/database";
import { IsNull, Like } from "typeorm";

const advertisementRepository = AppDataSource.getRepository(Advertisement);

export async function create(req: Request, res: Response) {
  try {
    const { title, redirectUrl } = req.body as Advertisement;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const advertisement = new Advertisement();
    advertisement.title = title;
    advertisement.redirectUrl = redirectUrl;
    advertisement.imageUrl = `/img/advertisements/${req.file.filename}`;

    const insertion = await advertisementRepository.save(advertisement);

    return res.status(201).json(insertion);

  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const advertisement = await advertisementRepository.findOne({ where: { id: Number(id) } });

    if (!advertisement) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }

    return res.json(advertisement);

  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const advertisements = await advertisementRepository.find({
      where: {
        deletedAt: IsNull()
      }
    });

    return res.json(advertisements);

  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

export async function delete_(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const advertisement = await advertisementRepository.findOne({ where: { id: Number(id) } });

    if (!advertisement) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }

    advertisement.deletedAt = new Date();

    await advertisementRepository.save(advertisement);

    return res.json(advertisement);

  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}