/**
 * @swagger
 * components:
 *   schemas:
 *     Survey:
 *       type: object
 *       properties:
 *         surveyId:
 *           type: string
 *           description: ID da enquete
 *         name:
 *           type: string
 *           description: Nome da enquete
 *         status:
 *           type: string
 *           description: Status da enquete
 */

/**
 * @swagger
 * /survey:
 *   post:
 *     summary: Cria uma nova enquete.
 *     tags: [Survey]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Survey'
 *     responses:
 *       200:
 *         description: Enquete criada com sucesso.
 *   get:
 *     summary: Retorna todas as enquetes.
 *     tags: [Survey]
 *     responses:
 *       200:
 *         description: Lista de enquetes.
 */

/**
 * @swagger
 * /survey/{surveyId}:
 *   get:
 *     summary: Busca uma enquete pelo ID.
 *     tags: [Survey]
 *     parameters:
 *       - in: path
 *         name: surveyId
 *         required: true
 *         description: ID da enquete a ser pesquisada.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Enquete pesquisada.
 *   put:
 *     summary: Atualiza uma enquete existente.
 *     tags: [Survey]
 *     parameters:
 *       - in: path
 *         name: surveyId
 *         required: true
 *         description: ID da enquete a ser atualizada.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Survey'
 *     responses:
 *       200:
 *         description: Enquete atualizada com sucesso.
 *   delete:
 *     summary: Remove uma enquete existente.
 *     tags: [Survey]
 *     parameters:
 *       - in: path
 *         name: surveyId
 *         required: true
 *         description: ID do enquete a ser removida.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Enquete removida com sucesso.
 */
