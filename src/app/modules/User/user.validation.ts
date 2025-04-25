import { Gender, userStatus } from "@prisma/client";
import z from "zod";
const createAdmin = z.object({
  password: z.string({
    required_error: "password is require",
  }),
  admin: z.object({
    name: z.string({
      required_error: "name is require",
    }),
    email: z.string({
      required_error: "email is required",
    }),
    contactNumber: z.string({
      required_error: "contact number is required",
    }),
  }),
});

const createDoctor = z.object({
  password: z.string({
    required_error: "password is require",
  }),
  doctor: z.object({
    name: z.string({
      required_error: "name is require",
    }),
    email: z.string({
      required_error: "email is required",
    }),
    contactNumber: z.string({
      required_error: "contact number is required",
    }),
    adress: z.string().optional(),
    registrationNumber: z.string({
      required_error: "registration number is required",
    }),
    experience: z.number().optional(),
    gender: z.enum([Gender.FEMALE, Gender.MALE]),
    appointmentFee: z.number({
      required_error: "appointment fee is required",
    }),
    qualification: z.string({
      required_error: "qualification is required",
    }),
    currentWorkingPlace: z.string({
      required_error: "current working place is required",
    }),
    designation: z.string({
      required_error: "designation is required",
    }),
    isDeleted: z.boolean().optional(),
  }),
});


const createPatient = z.object({
  password: z.string(),
  patient: z.object({
      email: z.string({
          required_error: "Email is required!"
      }).email(),
      name: z.string({
          required_error: "Name is required!"
      }),
      contactNumber: z.string({
          required_error: "Contact number is required!"
      }),
      address: z.string({
          required_error: "Address is required"
      })
  })
});

const updateStatus = z.object({
  body: z.object({
      status: z.enum([userStatus.ACTIVE, userStatus.BLOCKED, userStatus.DELETED])
  })
})


export const userValidation = {
  createAdmin,
  createDoctor,
  createPatient,
  updateStatus
};
