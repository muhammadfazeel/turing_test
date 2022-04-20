'use strict'
import Sequelize from 'sequelize';
import sequelize from '../models/index.js';
import initModels from "../models/init-models.js";

const model = initModels(sequelize);
const Op = Sequelize.Op;

const dbseed = async (sequelize) => {
    let roles = [
        'SUPERADMIN',
        'ADMIN',
        'DBS'
    ]

    let SUPER_ADMIN = [
        'MATERIAL',
        'ADMIN',
        'CUSTOMER',
        'DBS',
        'SALESPERSON',
        'ARCHIVING',
        'ORDER'
    ];

    let BUSINESS_CONTROL = [
        'MATERIAL',
        'CUSTOMER',
        'DBS',
        'SALESPERSON',
        'ARCHIVING'
    ];

    let DBS = [
        'ORDER',
        'SALESPERSON',
    ];

    for (let i = 0; i < roles.length; i++) {
        let roleCheck = await model.Role.findOne({ where: { name: roles[i] }, raw: true });
        if (!roleCheck) {
            let role = await model.Role.create({ name: roles[i] });
            if (roles[i] === 'SUPERADMIN') {
                for (let j = 0; j < SUPER_ADMIN.length; j++) {
                    await model.Module.create({ identifier: SUPER_ADMIN[j], RoleId: role.id });
                }
            }
            if (roles[i] === 'ADMIN') {
                for (let j = 0; j < BUSINESS_CONTROL.length; j++) {
                    await model.Module.create({ identifier: BUSINESS_CONTROL[j], RoleId: role.id });
                }
            }
            if (roles[i] === 'DBS') {
                for (let j = 0; j < DBS.length; j++) {
                    await model.Module.create({ identifier: DBS[j], RoleId: role.id });
                }
            }
        }
    }
}

export default dbseed;
