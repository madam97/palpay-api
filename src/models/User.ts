
import { Association, CreationOptional, DataTypes, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';
import sequelize from '../sequelize';
import { dbConfig } from '../config';
import { auth, TAuthRole } from '../services/auth';
import UserInfo from './UserInfo';

class User extends Model<
  InferAttributes<User>, 
  InferCreationAttributes<User>
> {
  declare id            : CreationOptional<number>;
  declare username      : string;
  declare password      : string;
  declare role          : TAuthRole;
  declare refreshToken  : string | null;

  declare static associations: {
    userInfo: Association<User, UserInfo>;
  };

  declare userInfo?     : NonAttribute<UserInfo>;
  declare getUserInfo   : HasOneGetAssociationMixin<UserInfo>;
  declare setBar        : HasOneSetAssociationMixin<UserInfo, number>;
  declare createBar     : HasOneCreateAssociationMixin<UserInfo>;

  static associate(models: any) {
    this.hasOne(models.UserInfo, {
      foreignKey: 'user_id'
    });
  }
};

User.init({
  id: {
    type            : DataTypes.INTEGER,
    autoIncrement   : true,
    primaryKey      : true
  },
  username: {
    type            : DataTypes.STRING,
    allowNull       : false,
    unique          : true
  },
  password: {
    type            : DataTypes.STRING,
    allowNull       : false,
    async set(value: string) {
      this.setDataValue('password', await auth.getHash(value));
    }
  },
  role: {
    type            : DataTypes.STRING,
    allowNull       : false,
    defaultValue    : 'user',
    validate: {
      isIn          : [['user', 'admin']]
    }
  },
  refreshToken: {
    type          : DataTypes.STRING,
    field         : 'refresh_token',
    defaultValue  : null
  }
}, {
  sequelize,
  modelName     : 'user',
  tableName     : dbConfig.tablePrefix+'users',
  timestamps    : false
});

User.associate({ UserInfo });

export default User;
