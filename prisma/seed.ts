import { userRole } from "@prisma/client";
import { prisma } from "../src/shared/prisma";
import bcrypt from 'bcrypt'

const seedSuperAdmin = async()=>{
    try {
        const isExistSuperAdmin = await prisma.user.findFirst({
            where:{
                role:userRole.SUPER_ADMIN
            }
        })
        if (isExistSuperAdmin) {
            console.log("Super Admin already exists!");
            return;
        }
        const hashedPassword = await bcrypt.hash("0@Alamshuvo", 15)
        const superAdminData = await prisma.user.create({
            data:{
                email:"super@email.com",
                password:hashedPassword,
                role:userRole.SUPER_ADMIN,
                admin:{
                    create:{
                        name:"Super Admin",
                        contactNumber:"01980640702",

                    }
                }
            }
        })
        console.log(superAdminData,"supe Admin created sucessfully");
    } catch (error) {
        console.error(error);
    }
    finally{
        await prisma.$disconnect();
    }
}

seedSuperAdmin()