import { PrismaClient, userRole } from "@prisma/client"
import bcrypt from "bcrypt"
const prisma = new PrismaClient()
const createAdmin = async (data:any)=>{
    const hashedPassword:string =await bcrypt.hash(data.password, 15)
    const userPayload = {
        email:data.admin.email,
        password:hashedPassword,
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