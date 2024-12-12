import { FacturationCodeDatamapper } from '../datamappers/index.datamapper.js';
import CoreController from './core.controller.js';

export default class FacturationCodeController extends CoreController {
  static mainDatamapper = FacturationCodeDatamapper;
  static entityName = 'user_has_facturation_code';

  static async addFacturationCodeToUser(req, res) {
    const userId = req.params.id;
    const { facturationCode } = req.body;

    const facturationCodeList = await FacturationCodeDatamapper.findAll();

    const codeId = facturationCodeList.find(
      (code) => code.code === facturationCode
    );

    if (typeof codeId == 'number' && !null) {
      try {
        const result =
          await FacturationCodeDatamapper.addExisitingFacturationCodeToUser(
            userId,
            codeId
          );

        res.json(result);
      } catch (error) {
        console.error('Error during creation:', error);
      }
    } else {
      try {
        const result =
          await FacturationCodeDatamapper.addNewFacturationCodeToUser(
            userId,
            facturationCode
          );

        res.json(result);
      } catch (error) {
        console.error('Error during creation:', error);
      }
    }
  }

  static async deleteFacturationCodeFromUser(req, res) {
    const facturationCodeId = req.headers['x-facturation-codes'];

    const userId = req.params.id;

    if (!userId || !facturationCodeId) {
      throw new Error('Input data is missing');
    }

    try {
      const deletedFacturationCode =
        await FacturationCodeDatamapper.deleteFacturationCodeFromUser(
          userId,
          facturationCodeId
        );

      console.log(deletedFacturationCode.message);
      return res.json(deletedFacturationCode.message);
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({ message: error.message });
      }

      return res.status(500).json({ message: error });
    }
  }
}
