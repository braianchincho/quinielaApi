import { Router, Request, Response } from "express";
import DrawController from "../controllers/draw.controller";

const router = Router();
const controller = new DrawController();

/**
 * @swagger
 * /api/draws:
 *   get:
 *     summary: Obtener sorteos por fecha
 *     description: Devuelve los sorteos para una fecha específica o, si no se pasa, los de hoy.
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha en formato yyyy-mm-dd
 *     responses:
 *       200:
 *         description: Lista de sorteos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Draw'
 *
 * components:
 *   schemas:
 *     Draw:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *         type:
 *           type: string
 *           enum: [previa, primera, matutina, vespertina, nocturna]
 *         province:
 *           type: string
 *         updated:
 *           type: string
 *           format: date-time
 *         drawNumbers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               position:
 *                 type: number
 *               drawNumber:
 *                 type: number
 */
router.get("/", controller.getDraws.bind(controller));

export default router;
