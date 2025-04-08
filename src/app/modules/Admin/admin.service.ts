import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const getAllAdminService = async () => {
    const result = await prisma.admin.findMany();
    return result
};
export const adminService = {
  getAllAdminService,
};
