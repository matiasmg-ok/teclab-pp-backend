import { Request, Response } from "express";
import AppDataSource from "../utils/database";
import { Product } from "../entity/Product";
import { Between, IsNull, LessThanOrEqual, Like, MoreThanOrEqual } from "typeorm";
import path from 'path';

const productRepository = AppDataSource.getRepository(Product);

const deleteFile = async (filename: string) => {
  try {
    const path_ = path.join(__dirname, '../../public/img/products', filename);
    return await new Promise((resolve, reject) => {
      import('fs').then((fs) => {
        fs.default.unlink(path_, (err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    });
  } catch (error) {
    console.error(error);
  }
}

export const create = async (req: Request, res: Response) => {
  try {
    const { name, description, group, price } = req.body as Product;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const product = new Product();
    product.name = name;
    product.description = description;
    product.group = group;
    product.price = price;
    product.imageUrl = `/img/products/${req.file.filename}`;

    const insertion = await productRepository.save(product);

    return res.status(201).json(insertion)

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

    if (req.file && product.imageUrl) {
      await deleteFile(product.imageUrl.split('/img/products/')[1]);
      product.imageUrl = `/img/products/${req.file.filename}`;
    }

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
    const { name, search, group, minPrice, maxPrice } = req.query;

    const products = await productRepository.find({
      where: [
        {
          deletedAt: IsNull(),
          ...(search && { name: Like(`%${search}%`) }),
          ...(minPrice && !maxPrice && { price: MoreThanOrEqual(Number(minPrice)) }),
          ...(maxPrice && !minPrice && { price: LessThanOrEqual(Number(maxPrice)) }),
          ...(minPrice && maxPrice && { price: Between(Number(minPrice), Number(maxPrice)) })
        },
        {
          deletedAt: IsNull(),
          ...(search && { group: Like(`%${search}%`) }),
          ...(minPrice && !maxPrice && { price: MoreThanOrEqual(Number(minPrice)) }),
          ...(maxPrice && !minPrice && { price: LessThanOrEqual(Number(maxPrice)) }),
          ...(minPrice && maxPrice && { price: Between(Number(minPrice), Number(maxPrice)) })
        }
      ]
    });

    return res.json(products);

  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}