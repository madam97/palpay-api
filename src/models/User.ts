
import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';
import { auth, TAuthRole } from '../services/auth';

class User extends Model {
  declare id: number;
  declare username: string;
  declare password: string;
  declare role: TAuthRole;
  declare refreshToken: string | null
};

User.init({
  id: {
    type          : DataTypes.INTEGER,
    autoIncrement : true,
    primaryKey    : true
  },
  username: {
    type          : DataTypes.STRING,
    allowNull     : false,
    unique        : true
  },
  password: {
    type          : DataTypes.STRING,
    allowNull     : false,
    set(value: string) {
      this.setDataValue('password', auth.getHash(value));
    }
  },
  role: {
    type          : DataTypes.STRING,
    allowNull     : false,
    defaultValue  : 'user',
    validate: {
      isIn: [['user', 'admin']]
    }
  },
  refreshToken: {
    type          : DataTypes.STRING,
    field         : 'refresh_token',
    defaultValue  : null
  }
}, {
  sequelize,
  modelName     : 'User',
  tableName     : 'palpay__users',
  timestamps    : false
});

export default User;
