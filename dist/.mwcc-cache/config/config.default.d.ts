declare const _default: {
    sequelize: {
        pool: {
            max: number;
            min: number;
            idle: number;
            acquire: number;
        };
        timezone: string;
        dialectOptions: {
            supportBigNumbers: boolean;
            bigNumberStrings: boolean;
            dateStrings: boolean;
            typeCast: boolean;
        };
        define: {
            charset: string;
            dialectOptions: {
                collate: string;
            };
            version: boolean;
            paranoid: boolean;
            freezeTableName: boolean;
            underscored: boolean;
            timestamps: boolean;
            createdAt: string;
            updatedAt: string;
            deletedAt: string;
        };
    };
    orm: {};
};
export = _default;
