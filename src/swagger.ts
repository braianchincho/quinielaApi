import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export function setupSwagger(app: Express) {
  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Quiniela API",
        version: "1.0.0",
        description: "API REST para consultar sorteos de la quiniela",
      },
    },
    apis: ["./src/routes/*.ts"], // Rutas donde estarán las anotaciones Swagger
  };

  const specs = swaggerJsdoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}
