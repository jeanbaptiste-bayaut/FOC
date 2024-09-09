import { UserDataMapper } from '../datamappers/index.datamapper.js';
import CoreController from './core.controller.js';

export default class UserController extends CoreController {
  static mainDatamapper = UserDataMapper;

  static async getUserByID(req, res) {
    const { id } = req.params;
    const user = await UserDataMapper.getUserById(id);

    return res.json(user);
  }

  static async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserDataMapper.login(email, password);

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async signin(req, res) {
    const { email, password, brand, facturation_code } = req.body;
    try {
      const user = await UserDataMapper.createUser(
        email,
        password,
        brand,
        facturation_code
      );

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
