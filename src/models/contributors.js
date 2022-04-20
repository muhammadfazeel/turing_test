import _sequelize from 'sequelize';
import crypto from 'crypto';

const { Model, Sequelize } = _sequelize;

export default class Contributor extends Model {
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
                allowNull: false
            },
            name: {
                type: DataTypes.STRING(500),
                allowNull: false
            },
            contributions: {
                type: DataTypes.INTEGER,
                defaultValue: 1
            },
            year: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            month: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            day: {
                type: DataTypes.STRING(40),
                allowNull: false
            }
        }, {
            sequelize,
            tableName: 'Contributor',
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
        return Contributor;
    }
}