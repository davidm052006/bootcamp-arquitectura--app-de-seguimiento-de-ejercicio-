import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yaml';

export function setupSwagger(app) {
  const specPath = new URL('../openapi.yaml', import.meta.url);
  const specRaw = fs.readFileSync(specPath, 'utf8');
  const openapiSpec = yaml.parse(specRaw);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
}

