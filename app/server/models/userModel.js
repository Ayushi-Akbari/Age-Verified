module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        store_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        settings: {
            type: DataTypes.TEXT,
            allowNull: false,
            get() {
                const settingsString = this.getDataValue('settings');
                return settingsString ? JSON.parse(settingsString) : null;
            },
            set(value) {
                this.setDataValue('settings', JSON.stringify(value));
            }
        },
    },{timestamps: false});

    return User;
};
