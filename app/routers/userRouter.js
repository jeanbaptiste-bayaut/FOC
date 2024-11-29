import express from 'express';
import UserController from '../controllers/user.controller.js';
const router = express.Router();
import authMiddleware from '../middleware/auth.middleware.js';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API to manage users
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         service:
 *           type: string
 *         role:
 *           type: string
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     description: Retrieve a list of users from the database.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *         examples:
 *           application/json:
 *             value: [
 *               {
 *                 "id": 1,
 *                 "email": "admin@admin.com",
 *                 "password": "$2b$10$HKDG0sEddfZRcqT3AaQ98e6HzQERiWjl/eMKIJJCKSCFeSb50xTL.",
 *                 "service": "admin",
 *                 "role": "admin"
 *               },
 *               {
 *                 "id": 2,
 *                 "email": "editor@editor.com",
 *                 "password": "$2b$10$CAAa7ofhCfBg3EAwNP6ZA.j0wN2xykKI6rFByujuN2fDl4N/QtSMK",
 *                 "service": "editor",
 *                 "role": "editor"
 *               },
 *               {
 *                 "id": 3,
 *                 "email": "admin@admin.com",
 *                 "password": "$2b$10$dmHeH05P7gbeuGROG0esDeBlyja5asb40Tz9gBFWkgZY9ziFWDyn2",
 *                 "service": "saz",
 *                 "role": "zsa"
 *               }
 *             ]
 *       500:
 *         description: Server error
 */
router.route('/users').get(UserController.getAll.bind(UserController));

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         service:
 *           type: string
 *         role:
 *           type: string
 * /users/{id}:
 *   get:
 *     summary: Retrieve a single user
 *     tags: [Users]
 *     description: Retrieve a single user from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to retrieve.
 *     responses:
 *       200:
 *         description: A single user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *         examples:
 *           application/json:
 *             value:
 *               {
 *                 "id": 1,
 *                 "email": "admin@admin.com",
 *                 "password": "$2b$10$HKDG0sEddfZRcqT3AaQ98e6HzQERiWjl/eMKIJJCKSCFeSb50xTL.",
 *                 "service": "admin",
 *                 "role": "admin"
 *               }
 *       500:
 *         description: Server error
 */
router.route('/users/:id').get(UserController.getOne.bind(UserController));

/**
 * @swagger
 * components:
 *   schemas:
 *     UserLogin:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         email: "email@email.com"
 *         password: "password"
 * /login:
 *   post:
 *     summary: Login
 *     tags: [Users]
 *     description: Login to the application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: User logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 userId:
 *                   type: integer
 *                 role:
 *                   type: string
 *                 email:
 *                   type: string
 *                 facturationCodeList:
 *                   type: array
 *       500:
 *         description: Server error
 */

router.route('/login').post(UserController.login.bind(UserController));

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         service:
 *           type: string
 *         role:
 *           type: string
 *         facturation_code:
 *           type: string
 *       example:
 *         id: 1
 *         email: "example@example.com"
 *         password: "admin"
 *         service: "admin"
 *         role: "admin"
 *         facturation_code: "factucode"
 * /signin:
 *   post:
 *     summary: Create a user
 *     tags: [Users]
 *     description: Create a user in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           examples:
 *             value:
 *               email: "email@email.com"
 *               password: "password"
 *               service: "admin"
 *               facturation_code: "factucode"
 *               role: "admin"
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 */
router
  .route('/signin')
  .post(authMiddleware.verifyToken, UserController.signin.bind(UserController));

export default router;
