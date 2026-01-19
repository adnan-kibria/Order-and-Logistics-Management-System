import { z } from 'zod';

export const AddUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
  phone: z.string().min(11, 'Phone number must be at least 11 digits'),
  role: z.enum(['deliveryman', 'inventory_manager'], 
        'Role must be either deliveryman or inventory_manager'
    ),
});
