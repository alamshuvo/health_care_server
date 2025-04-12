import { Prisma, PrismaClient } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.const";
import { calculatePagination } from "../../../helpers/pagination.helper";
import { prisma } from "../../../shared/prisma";

const getAllAdminService = async (params: any, options: any) => {
  const { limit, page, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.AdminWhereInput[] = [];

  // some code added
  // [
  //   {
  //     name: {
  //       contains: params.searchTerm,
  //       mode: "insensitive",
  //     },
  //   },
  //   {
  //     email: {
  //       contains: params.searchTerm,
  //       mode: "insensitive",
  //     },
  //   },
  //   {
  //     contactNumber: {
  //       contains: params.searchTerm,
  //       mode: "insensitive",
  //     },
  //   },
  // ],

  if (params.searchTerm) {
    andConditions.push({
      OR: adminSearchAbleFields.map((field) => {
        return {
          [field]: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        };
      }),
    });
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.AdminWhereInput = {
    AND: andConditions,
  };
  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.admin.count({
    where:whereConditions
  });
  return {
    meta: {
      page,
      limit,
      total,

    },
    data:result,
  };
};
export const adminService = {
  getAllAdminService,
};

/**
 * data = 1 2 3 4 5 6 7 8
 * page = 2
 * limit = 3
 * skip = 3
 * formula = page-1*limit
 * * */
