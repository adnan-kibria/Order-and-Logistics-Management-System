import { z } from 'zod';

export const createShippingAddressSchema = z.object({
    city: z.string().min(1, 'City is required'),
    location: z.string().min(1, 'Location is required'),
    details: z.string().min(1, 'Details is required'),
});

export const RegisterCustomerSchema = z.object({
    name: z.string().min(1, 'Name is required'),

    email: z.string().email('Invalid email address'),

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),

    phone: z
        .string()
        .min(11, 'Phone number must be at least 11 digits'),

    address: createShippingAddressSchema,
});

// export type RegisterCustomerSchema = z.infer<typeof RegisterCustomerSchema>;
