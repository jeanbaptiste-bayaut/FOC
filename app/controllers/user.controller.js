import { UserDataMapper } from '../datamappers/index.datamapper.js';
import CoreController from './core.controller.js';
import jwt from 'jsonwebtoken';

export default class UserController extends CoreController {
  static mainDatamapper = UserDataMapper;

  static async getUserByID(req, res) {
    const { id } = req.params;

    if (!id || id == null) {
      throw new Error('Missing id');
    }

    try {
      const user = await UserDataMapper.getUserById(id);

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getUserByEmail(req, res) {
    const { email } = req.body;

    if (!email) {
      throw new Error('Missing email');
    }

    try {
      const user = await UserDataMapper.findByEmail(email);

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserDataMapper.login(email, password);

      if (!user) {
        throw new Error('User not found');
      }

      const userId = user.user.id;
      const role = user.user.role;

      const token = jwt.sign(
        { email: email, userId: userId },
        process.env.TOKEN_SECRET,
        { expiresIn: '2h' }
      );

      res.cookie('token', token, {
        httpOnly: true,
      });

      return res.json({
        userId,
        token,
        facturationCodeList: user.facturationCodeList,
        role,
        email,
      });
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({ message: error.message });
      } else if (error.status === 400) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({ message: error.message });
    }
  }

  static async signin(req, res) {
    const { email, password, service, facturationCodeList, role } = req.body;

    if (!email || !password || !service || !facturationCodeList || !role) {
      throw new Error('Missing input data');
    }

    try {
      const user = await UserDataMapper.createUser(
        email,
        password,
        service,
        facturationCodeList,
        role
      );

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
