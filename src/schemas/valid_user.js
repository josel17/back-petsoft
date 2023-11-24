const z = require('zod');

const schemaValidUser = z.object({

    id:z.number({}).nullable(),
    fullName:z.string({}).z.require(),
    lastName1:z.string({}).z.require(),
    lastName2:z.string({}),
    documentTypeId:z.string({}).z.require(),
    documentNumber:z.string({}).z.require(),
    genderId:z.string({}).z.require(),
    email:z.string({}).z.require().z.email(),
    companyId:z.string({}).z.require(),
    status:z.string({}).z.require()
});

function valid(params) {
   
    return schemaValidUser.safeParse(params);
   
}
module.exports= {valid}