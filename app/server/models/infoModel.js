const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Info = sequelize.define('Info', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        agree: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        disagree: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },{timestamps: false});

    return Info;
};

