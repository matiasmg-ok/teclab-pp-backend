import { Request, Response } from "express";
import IController from "../interfaces/IController";
import AppDataSource from "../utils/database";
import { Product } from "../entity/Product";
import { Between, IsNull, LessThanOrEqual, Like, MoreThanOrEqual } from "typeorm";

const productRepository = AppDataSource.getRepository(Product);

export const create = async (req: Request, res: Response) => {
  try {
    const { name, description, group, price } = req.body as Product;

    const product = new Product();
    product.name = name;
    product.description = description;
    product.group = group;
    product.price = price;

    const insertion = await productRepository.save(product);

    return res.json(insertion)

  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { name, description, group, price } = req.body as Product;

    const product = await productRepository.findOne({ where: { id: Number(id), deletedAt: IsNull() } });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name;
    product.description = description;
    product.group = group;
    product.price = price;

    await productRepository.save(product);

    return res.json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

export const delete_ = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await productRepository.findOne({ where: { id: Number(id) } });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.deletedAt = new Date();

    await productRepository.save(product);

    return res.json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

export const getOne = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await productRepository.findOne({ where: { id: Number(id), deletedAt: IsNull() } });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);

  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

export const getAll = async (req: Request, res: Response) => {
  try {
    const { search, group, minPrice, maxPrice } = req.query;

    const products = await productRepository.find({
      where: {
        deletedAt: IsNull(),
        ...(search && { name: Like(`%${search}%`) }),
        ...(group && { group: Like(`%${group}%`) }),
        ...(minPrice && { price: MoreThanOrEqual(Number(minPrice)) }),
        ...(maxPrice && { price: LessThanOrEqual(Number(maxPrice)) })
      }
    });

    return res.json(products);

  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}