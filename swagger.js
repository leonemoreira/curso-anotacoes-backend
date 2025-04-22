const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do Swagger JSDoc
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Exemplo',
    version: '1.0.0',
    description: 'Documentação da API de exemplo',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // Adapte para o local dos seus arquivos de rotas
};

const swaggerSpec = swaggerJSDoc(options);

// Usar o Swagger UI para servir a documentação
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Exemplo de rota
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
