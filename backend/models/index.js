const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306
  }
);

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull:false },
  email: { type: DataTypes.STRING, allowNull:false, unique:true },
  phone: DataTypes.STRING,
  address: DataTypes.TEXT,
  pincode: DataTypes.STRING,
  city: DataTypes.STRING,
  country: DataTypes.STRING,
  password_hash: { type: DataTypes.STRING, allowNull:false }
}, { tableName: 'users', underscored: true });

const Incident = sequelize.define('Incident', {
  incident_id: { type: DataTypes.STRING, unique:true, allowNull:false },
  reporter_name: { type: DataTypes.STRING, allowNull:false },
  details: { type: DataTypes.TEXT, allowNull:false },
  reported_at: { type: DataTypes.DATE, allowNull:false },
  priority: { type: DataTypes.ENUM('High','Medium','Low'), defaultValue: 'Low'},
  status: { type: DataTypes.ENUM('Open','In Progress','Closed'), defaultValue:'Open' }
}, { tableName: 'incidents', underscored: true });

User.hasMany(Incident, { foreignKey: 'reporter_id' });
Incident.belongsTo(User, { foreignKey: 'reporter_id' });

module.exports = { sequelize, User, Incident, Sequelize, DataTypes };
