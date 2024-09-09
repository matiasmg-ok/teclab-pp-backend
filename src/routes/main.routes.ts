import { Request, Response, Router } from "express";
const router = Router();

router.get('/', async (req: Request, res: Response) => {
  return res.send('API - Teclab - Matías Manuel Galeano | 45.901.623 | SportsXLife');
});

router.get('/usd-cotization', async (req: Request, res: Response) => {
  try {
    const cotization = await fetch("https://dolarapi.com/v1/dolares/bolsa");
    const data = await cotization.json();
    return res.send({
      price: data.compra,
      updatedAt: data.fechaActualizacion
    });
  } catch (error) {
    return res.status(500).send(error);
  }
})

export default router;