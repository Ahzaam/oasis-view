const { Sequelize } = require("sequelize");

const sequelizeConnection = new Sequelize(
  "sqldb-vst-dev-eastus-001",
  "dbadmin@sqldb-vst-dev-eastus-001-sqlsvr",
  "%Y&]7H3%0>9eTji8Fk%<",
  {
    host: "sqldb-vst-dev-eastus-001-sqlsvr.database.windows.net",
    dialect: "mssql", // Ensure this matches your actual database
    port: 1433,
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: false,
      },
    },
  }
);

sequelizeConnection
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelizeConnection;
