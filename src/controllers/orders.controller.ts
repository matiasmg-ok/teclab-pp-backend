import { Request, Response } from "express";
import AppDataSource from "../utils/database";
import { Product } from "../entity/Product";
import { Between, In, IsNull, LessThanOrEqual, Like, MoreThanOrEqual } from "typeorm";
import path from 'path';
import { Order } from "../entity/Order";
import { User } from "../entity/User";
import { getUsdCotization } from "../services/currencies.service";
import { OrderProduct } from "../entity/OrderProduct";

const orderRepository = AppDataSource.getRepository(Order);
const productRepository = AppDataSource.getRepository(Product);
const orderProductRepository = AppDataSource.getRepository(OrderProduct)

export async function getByTrackingCode(req: Request, res: Response) {
  try {
    const { trackingCode } = req.query as { trackingCode: string };

    const order = await orderRepository.findOne({
      where: {
        trackingCode: trackingCode.toLowerCase()
      }
    })

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json(order);

  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

export async function getMyOrders(req: Request, res: Response) {
  try {
    const user = req.body.user as User;

    const orders = await orderRepository.find({
      where: {
        user: {
          id: user.id
        },
        deletedAt: IsNull()
      },
      relations: {
        products: {
          product: true
        }
      }
    });

    return res.json(orders);

  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const { name, search, minPrice, maxPrice, dateRange, date, userEmail, currency, status }: {
      name?: string,
      search?: string,
      minPrice?: string,
      maxPrice?: string,
      dateRange?: { startAt: Date, endAt: Date },
      date?: Date,
      userEmail?: string,
      status?: 'payment-pending' | 'payment-completed' | 'in-progress' | 'shipping' | 'finished' | 'cancelled' | null,
      currency?: 'usd' | 'ars' | null
    } = req.query;

    const orders = await orderRepository.find({
      where: [
        {
          deletedAt: IsNull(),
          ...(name && { name: Like(`%${name}%`) }),
          ...(search && { name: Like(`%${search}%`) }),
          ...(minPrice && { price: MoreThanOrEqual(Number(minPrice)) }),
          ...(maxPrice && { price: LessThanOrEqual(Number(maxPrice)) }),
          ...(currency && { currency }),
          ...(status && { status }),
          ...(dateRange && { createdAt: Between(dateRange.startAt, dateRange.endAt) }),
          ...(date && { createdAt: date }),
          ...(userEmail && { user: { email: userEmail } })
        }
      ],
      relations: {
        user: true,
        products: {
          product: true
        }
      }
    });

    return res.json(orders);

  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

export async function createOrder(req: Request, res: Response) {
  try {
    const { user, city, province, zip, shippingAddress, additionalNotes, productsIds, currency }: {
      user: User,
      city: string,
      province: string,
      zip: string,
      shippingAddress: string,
      additionalNotes: string
      productsIds: number[],
      currency: 'usd' | 'ars',

    } = req.body;

    if (!user || !city || !province || !zip || !shippingAddress || !productsIds || !currency) {
      console.log({ user, city, province, zip, shippingAddress, productsIds, currency });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (user.profile === 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const products = await productRepository.find({
      where: { id: In(productsIds) }
    });

    const totalUsdPrice = products.reduce((total, product) => total + product.price, 0);
    const cotization = await getUsdCotization()

    const finalPrice = currency === 'usd' ? totalUsdPrice : totalUsdPrice * cotization.price;

    const order = new Order();
    order.user = user;
    order.city = city;
    order.province = province;
    order.zip = zip;
    order.shippingAddress = shippingAddress;
    order.additionalNotes = additionalNotes;
    order.currency = currency;
    order.price = finalPrice;
    order.trackingCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const insertion = await orderRepository.save(order);

    for (const product of products) {
      const orderProduct = new OrderProduct();
      orderProduct.order = insertion;
      orderProduct.product = product;
      await orderProductRepository.save(orderProduct);
    }

    return res.status(201).json(insertion);

  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

export async function updateOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await orderRepository.findOne({
      where: {
        id: Number(id),
        deletedAt: IsNull()
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;

    await orderRepository.save(order);

    return res.json(order);

  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}