import { FacturationCodeDatamapper } from '../datamappers/index.datamapper.js';

export default class FacturationCodeController {
  static mainDatamapper = FacturationCodeDatamapper;
  static entityName = 'user_has_facturation_code';

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
