import { UserDataMapper } from '../datamappers/index.datamapper.js';
import CoreController from './core.controller.js';
import jwt from 'jsonwebtoken';

export default class UserController extends CoreController {
  static mainDatamapper = UserDataMapper;

  static async getUserByID(req, res) {
    const { id } = req.params;

    try {
      const user = await UserDataMapper.getUserById(id);

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserDataMapper.login(email, password);

      const userId = user.id;

      const token = jwt.sign(
        { email: email, userId: userId },
        process.env.TOKEN_SECRET,
        { expiresIn: '2h' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        // secure: false,
        // sameSite: 'Lax',
      });

      return res.json({ userId, token });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async signin(req, res) {
    const { email, password, brand, facturation_code, role } = req.body;
    try {
      const user = await UserDataMapper.createUser(
        email,
        password,
        brand,
        facturation_code,
        role
      );

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
