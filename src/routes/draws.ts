import { Router } from "express";
import DrawController from "../controllers/draw.controller";
import validateDrawQuery from "../validators/draw.validator";

const router = Router();
const controller = new DrawController();

/**
 * @swagger
 * /api/draws:
 *   get:
 *     summary: Obtener sorteos por fecha, provincia y tipo
 *     description: Devuelve los sorteos filtrados por fecha, provincia y/o tipo. Si no se pasa la fecha, se asume la del día actual.
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha en formato yyyy-mm-dd. Si no se especifica, se usa la fecha actual.
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *           enum: [cordoba, nacional, entrerios, buenosaires, santafe, montevideo]
 *         description: Provincia a filtrar. Si no se especifica, devuelve todas las provincias.
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [previa, primera, matutina, vespertina, nocturna]
 *         description: Tipo de sorteo a filtrar. Si no se especifica, devuelve todos los tipos.
 *     responses:
 *       200:
 *         description: Lista de sorteos encontrados
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
 *           enum: [cordoba, nacional, entrerios, buenosaires, santafe]
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

router.get("/", [validateDrawQuery] ,controller.getDraws.bind(controller));

export default router;
