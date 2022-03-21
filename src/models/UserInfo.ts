import { Association, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { dbConfig } from '../config';
import sequelize from '../sequelize';
import User from './User';

class UserInfo extends Model<
  InferAttributes<UserInfo>, 
  InferCreationAttributes<UserInfo>
> {
  declare id          : CreationOptional<number>;
  declare name        : string;
  declare address     : string;
  declare telephone   : string;
  declare email       : string;

  declare static associations: {
    user: Association<UserInfo, User>
  }

  declare user?       : User;
  declare getUser     : BelongsToGetAssociationMixin<User>;
  declare setUser     : BelongsToSetAssociationMixin<User, number>;
  declare createUser  : BelongsToCreateAssociationMixin<User>;

  static associate(models: any) {
    this.belongsTo(models.User);
  }
};

UserInfo.init({
  id: {
    type            : DataTypes.INTEGER,
    autoIncrement   : true,
    primaryKey      : true
  },
  name: {
    type            : DataTypes.STRING,
    allowNull       : false
  },
  address: {
    type            : DataTypes.STRING,
    allowNull       : false
  },
  telephone: {
    type            : DataTypes.STRING,
    allowNull       : false
  },
  email: {
    type            : DataTypes.STRING,
    allowNull       : false
  }
}, {
  sequelize,
  modelName     : 'userInfo',
  tableName     : dbConfig.tablePrefix+'user_info',
  timestamps    : false
});

export default UserInfo;