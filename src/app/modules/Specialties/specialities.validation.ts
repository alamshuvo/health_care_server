import { z } from "zod";

const createSpecialities = z.object({
    body: z.object({
        title: z.string({
            required_error:"title is required",
        })
    })
  })


 export const SpecialityValidation   ={
    createSpecialities
  }