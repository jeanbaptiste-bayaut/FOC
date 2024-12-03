class ControllerError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default class CoreController {
  static entityName = null;
  static mainDatamapper = null;

  static async getAll(req, res) {
    try {
      const rows = await this.mainDatamapper.findAll();
      if (rows.length === 0) {
        throw new ControllerError(`No data found for ${this.entityName}`);
      }
      return res.status(200).json(rows);
    } catch (error) {
      console.error(`Error retrieving all ${this.entityName}:`, error);
      throw error instanceof ControllerError
        ? error
        : new ControllerError(`Failed to recover all ${this.entityName}`);
    }
  }

  static async getOne(req, res) {
    const { id } = req.params;
    try {
      const row = await this.mainDatamapper.findByPk(id);
      if (!row) {
        throw new ControllerError(
          `${this.entityName} with id ${id} not found`,
          404
        );
      }
      return res.json(row);
    } catch (error) {
      console.error(
        `Error retrieving ${this.entityName} with id ${id}:`,
        error
      );
      throw error instanceof ControllerError
        ? error
        : new ControllerError(`Failed to recover one ${this.entityName}`);
    }
  }

  static async create(req, res) {
    const input = req.body;
    try {
      if (!input) {
        throw new ControllerError('Input data is missing', 400);
      }

      const row = await this.mainDatamapper.create(input);
      return res.status(201).json(row);
    } catch (error) {
      console.error('Error during creation:', error);
      throw error instanceof ControllerError
        ? error
        : new ControllerError(`Failed to create ${this.entityName}`);
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const input = req.body;
    try {
      if (!input) {
        throw new ControllerError('Input data is missing', 400);
      }

      const row = await this.mainDatamapper.update(id, input);
      if (!row) {
        throw new ControllerError(`${this.entityName} not found`, 404);
      }
      return res.json(row);
    } catch (error) {
      console.error('Error during update:', error);
      throw error instanceof ControllerError
        ? error
        : new ControllerError(`Failed to update ${this.entityName}`);
    }
  }

  static async delete(req, res, next) {
    const { id } = req.params;
    try {
      const eltToDelete = await this.mainDatamapper.delete(id);
      if (!eltToDelete) {
        return next(new ControllerError(`${this.entityName} not found`, 404));
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error during deletion:', error);
      throw error instanceof ControllerError
        ? error
        : new ControllerError(`Failed to delete ${this.entityName}`);
    }
  }
}
