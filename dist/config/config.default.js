"use strict";
module.exports = {
    // sequelize config
    sequelize: {
        pool: {
            max: 50,
            min: 0,
            idle: 10000,
            acquire: 30000,
        },
        timezone: '+08:00',
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
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmRlZmF1bHQuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL1F1bi9VbmNsdXR0ZXIv5Lmd5rOw6I2v5Lia6aG555uuL3NlcnZlci9zcmMvY29tcG9uZW50cy9taWR3YXktb3JtLXNxbC9zcmMvIiwic291cmNlcyI6WyJjb25maWcvY29uZmlnLmRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGlCQUFTO0lBQ0wsbUJBQW1CO0lBQ25CLFNBQVMsRUFBRTtRQUNQLElBQUksRUFBRTtZQUNGLEdBQUcsRUFBRSxFQUFFO1lBQ1AsR0FBRyxFQUFFLENBQUM7WUFDTixJQUFJLEVBQUUsS0FBSztZQUNYLE9BQU8sRUFBRSxLQUFLO1NBQ2pCO1FBQ0QsUUFBUSxFQUFFLFFBQVE7UUFDbEIsNENBQTRDO1FBQzVDLGNBQWMsRUFBRTtZQUNaLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixXQUFXLEVBQUUsSUFBSTtZQUNqQixRQUFRLEVBQUUsSUFBSTtTQUNqQjtRQUNELE1BQU0sRUFBRTtZQUNKLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLGNBQWMsRUFBRTtnQkFDWixPQUFPLEVBQUUsb0JBQW9CO2FBQ2hDO1lBQ0QsT0FBTyxFQUFFLElBQUk7WUFDYixRQUFRLEVBQUUsSUFBSTtZQUNkLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLFNBQVMsRUFBRSxZQUFZO1NBQzFCO0tBQ0o7SUFDRCxVQUFVO0lBQ1YsR0FBRyxFQUFFLEVBQUU7Q0FDVixDQUFBIn0=