import {z} from "zod"

export const signupSchema = z.object({
    body: z.object({
        name: z.string().min(2,"Name must be at least 2 characters"),
        email: z.email("Invalid email format"),
        password: z.string().min(8,"Password must be at least 8 characters")
    })
});

export const loginSchema = z.object({
    body: z.object({
        email:z.email("Invalid email format"),
        password: z.string().min(8,"Password must be at least 8 characters"),
    })
});

export const AddressSchema = z.object({
    body: z.object({
        lineOne: z.string().min(1, "Line one is required"),
        lineTwo: z.string().optional(),
        pincode: z.string().length(6, "Pincode must be exactly 6 characters"),
        country: z.string().min(1, "Country is required"),
        city: z.string().min(1, "City is required")
    })
})


export const updateUserSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        defaultShippingAddress: z.number().optional(),
        defaultBillingAddress: z.number().optional()
    })
})

export const CreateCartSchema = z.object({
    productId: z.number(),
    quantity:z.number()
})

export const ChangeQuantitySchema = z.object({
    quantity: z.number()
})



export type SignupInput = z.infer<typeof signupSchema>["body"];
export type loginInput = z.infer<typeof loginSchema>["body"];
export type AddressInput = z.infer<typeof AddressSchema>["body"];
export type updateUserInput = z.infer<typeof updateUserSchema>["body"];
export type CreateCartSchema = z.infer<typeof CreateCartSchema>;
export type ChangeQuantitySchema = z.infer<typeof ChangeQuantitySchema>;