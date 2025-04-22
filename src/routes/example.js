/**
 * @swagger
 * /hello:
 *   get:
 *     description: Retorna uma saudação
 *     responses:
 *       200:
 *         description: Saudação de exemplo
 */
const express = require('express');
const router = express.Router();

router.get('/hello', (req, res) => {
  res.send('Olá, Mundo!');
});

module.exports = router;
