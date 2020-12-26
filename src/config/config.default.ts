export = {
    // sequelize config
    sequelize: {
        pool: {
            max: 50, // 连接池中最大连接数量
            min: 0, // 连接池中最小连接数量
            idle: 10000, // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
            acquire: 30000, // 如果10秒后出错，30秒内连接成功了，则不报错
        },
        timezone: '+08:00', // 东八时区
        // operatorsAliases: false, // v5版本console警告
        dialectOptions: {
            supportBigNumbers: true,
            bigNumberStrings: true,
            dateStrings: true,
            typeCast: true
        },
        define: {
            charset: 'utf8mb4',
            dialectOptions: {
                collate: 'utf8mb4_general_ci',
            },
            version: true,
            paranoid: true,
            freezeTableName: true,
            underscored: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at'
        }
    },
    // TypeORM
    orm: {},
}