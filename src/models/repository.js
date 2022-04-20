import _sequelize from 'sequelize';
import crypto from 'crypto';

const { Model, Sequelize } = _sequelize;

export default class Repository extends Model {
  static init(sequelize, DataTypes) {
    super.init({
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      node_id: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      org: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      repository: {
        type: DataTypes.STRING(500),
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'Repository',
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "id" },
          ]
        }
      ]
    });
    return Repository;
  }
}