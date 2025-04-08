import { PrismaClient, userRole } from "@prisma/client"
const prisma = new PrismaClient()
const createAdmin = async (data:any)=>{
    const userPayload = {
        email:data.admin.email,
        password:data.password,
        role:userRole.ADMIN
    }
    const result = await prisma.$transaction(async(tx)=>{
        await tx.user.create({
            data:userPayload
        });
        const creataedAdminData = await tx.admin.create({
            data:data.admin
        });
        return creataedAdminData
    })
    return result;
}

export const userService = {
    createAdmin
}