/**
 * @swagger
 * components:
 *   schemas:
 *     SurveyItems:
 *       type: object
 *       properties:
 *         surveyItemId:
 *           type: string
 *           description: ID do item enquete
 *         surveyId:
 *           type: string
 *           description: ID da enquete
 *         description:
 *           type: string
 *           description: Descrição da enquete
 */

/**
 * @swagger
 * /survey-items:
 *   post:
 *     summary: Cria um novo item para a enquete.
 *     tags: [SurveyItems]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SurveyItems'
 *     responses:
 *       200:
 *         description: Item da enquete criada com sucesso.
 *   get:
 *     summary: Retorna todos os itens das enquetes.
 *     tags: [SurveyItems]
 *     responses:
 *       200:
 *         description: Lista de itens das enquetes.
 */

/**
 * @swagger
 * /survey-items/{surveyItemId}:
 *   get:
 *     summary: Busca um item pelo ID.
 *     tags: [SurveyItems]
 *     parameters:
 *       - in: path
 *         name: surveyItemId
 *         required: true
 *         description: ID do item a ser pesquisado.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item pesquisado.
 *   put:
 *     summary: Atualiza um item da enquete existente.
 *     tags: [SurveyItems]
 *     parameters:
 *       - in: path
 *         name: surveyItemId
 *         required: true
 *         description: ID do item enquete a ser atualizada.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SurveyItems'
 *     responses:
 *       200:
 *         description: Item da atualizado com sucesso.
 *   delete:
 *     summary: Remove um item da enquete existente.
 *     tags: [SurveyItems]
 *     parameters:
 *       - in: path
 *         name: surveyItemId
 *         required: true
 *         description: ID do item enquete a ser removido.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Item da removido com sucesso.
 */

/**
 * @swagger
 * /survey-items/survey/{surveyId}:
 *   get:
 *     summary: Busca os itens pelo ID da enquete.
 *     tags: [SurveyItems]
 *     parameters:
 *       - in: path
 *         name: surveyId
 *         required: true
 *         description: ID da enquete a ser pesquisado.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Itens da enquete pesquisada.
 */
