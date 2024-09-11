export default class CoreController {
  static entityName = null;
  static mainDatamapper = null;

  static async getAll(req, res) {
    try {
      const rows = await this.mainDatamapper.findAll();

      if (!rows) {
        throw new Error();
      }
      return res.json(rows);
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }

  static async getOne(req, res) {
    const { id } = req.params;

    try {
      const row = await this.mainDatamapper.findByPk(id);

      if (!row) {
        throw new Error();
      }

      return res.json(row);
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }

  static async create(req, res) {
    const input = req.body;

    try {
      if (!input) {
        throw new Error();
      }

      const row = await this.mainDatamapper.create(input);
      return res.status(201).json(row);
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }

  static async update(req, res, next) {
    const { id } = req.params;
    const input = req.body;
    try {
      if (!input) {
        return next(new Error());
      }

      // to do vérifier si l'élément existe avant de l'update
      const row = await this.mainDatamapper.update(id, input);
      if (!row) {
        return next(new Error(`${this.entityName} not found`, { status: 404 }));
      }
      return res.json(row);
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }

  static async delete(req, res, next) {
    const { id } = req.params;
    try {
      const eltToDelete = await this.mainDatamapper.delete(id);

      if (!eltToDelete) {
        return next(new Error(`${this.entityName} not found`, { status: 404 }));
      }

      res.status(204).json();
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }
}
