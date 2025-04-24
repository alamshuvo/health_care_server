import { userRole } from "@prisma/client";

export type IAuthUser = {
    email: string;
    role:userRole;

} | null