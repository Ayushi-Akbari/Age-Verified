const Sequelize = require("sequelize");
const dbName = "ageVerify";
const dbuser = "root";
const dbpassword = "root@1234567"; 

const sequelize = new Sequelize(dbName, dbuser, dbpassword, {
    host: "localhost",
    dialect: "mysql",
    logging: false,
});

sequelize
    .authenticate()
    .then(() => {
        console.log(`Database connected. Please wait for sync.... `);
    })
    .catch((err) => {
        console.log(err);
    });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../userModel.js")(sequelize, Sequelize);
// db.info = require("../infoModel.js")(sequelize, Sequelize);

// db.user.belongsTo(db.info, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = db;
