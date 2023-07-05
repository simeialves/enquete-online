/**
 * @swagger
 * components:
 *   schemas:
 *     PollItems:
 *       type: object
 *       properties:
 *         pollItemId:
 *           type: string
 *           description: ID do Voto
 *         surveyItemId:
 *           type: string
 *           description: ID da enquete
 */

/**
 * @swagger
 * /poll-items:
 *   post:
 *     summary: Cria um novo voto.
 *     tags: [PollItem]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PollItems'
 *     responses:
 *       200:
 *         description: Voto criado com sucesso.
 *   get:
 *     summary: Retorna todos os votos.
 *     tags: [PollItem]
 *     responses:
 *       200:
 *         description: Lista de votos.
 */

/**
 * @swagger
 * /poll-items/{pollItemId}:
 *   get:
 *     summary: Busca um voto pelo ID.
 *     tags: [PollItem]
 *     parameters:
 *       - in: path
 *         name: pollItemId
 *         required: true
 *         description: ID da voto a ser pesquisado.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Voto pequisado.
 *   put:
 *     summary: Atualiza um voto existente.
 *     tags: [PollItem]
 *     parameters:
 *       - in: path
 *         name: pollItemId
 *         required: true
 *         description: ID do voto a ser atualizado.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PollItems'
 *     responses:
 *       200:
 *         description: Voto atualizado com sucesso.
 *   delete:
 *     summary: Remove um voto existente.
 *     tags: [PollItem]
 *     parameters:
 *       - in: path
 *         name: pollItemId
 *         required: true
 *         description: ID do voto a ser removido.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Voto removido com sucesso.
 */

/**
 * @swagger
 * /poll-items/survey-items{surveyItemId}:
 *   get:
 *     summary: Busca os votos pelo ID do item.
 *     tags: [PollItem]
 *     parameters:
 *       - in: path
 *         name: surveyItemId
 *         required: true
 *         description: ID do item a ser pesquisado.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Votos pelo item pesquisado.
 */
