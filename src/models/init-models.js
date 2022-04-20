import _sequelize from "sequelize";
import _Repository from "./repository.js";
import _Contributor from "./contributors.js";

const DataTypes = _sequelize.DataTypes;

export default function initModels(sequelize) {

  var Repository = _Repository.init(sequelize, DataTypes);
  var Contributor = _Contributor.init(sequelize, DataTypes);

  Repository.hasMany(Contributor, { as: "contributors", foreignKey: "RepositoryId" })
  Contributor.belongsTo(Repository, { as: "repository", foreignKey: "RepositoryId" })

  return {
    Repository,
    Contributor
  };
}
