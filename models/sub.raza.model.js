export default (sequelize, DataTypes) => {
    const SubRaza = sequelize.define(
        'SubRaza', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            nombre: { 
                type: DataTypes.STRING, 
                allowNull: false,
                unique: true,
            },
        },
    {
        tableName: 'sub_raza',
        timestamps: false,
    })

    SubRaza.associate = (models) => {
        Raza.hasMany(models.Carta, {
            foreignKey: 'sub_raza_id',
            as: 'cartas'
        });
    };

    return SubRaza
}