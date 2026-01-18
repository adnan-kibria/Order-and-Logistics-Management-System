'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { AuthService } from '@/app/_services/auth.service';
import { RegisterCustomer } from '@/app/_interfaces/customer/register-customer.interface';
import { RegisterCustomerSchema } from '@/app/_schemas/register-customer.schema';

export default function Registration() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted, isSubmitting }
    } = useForm<RegisterCustomer>({
        resolver: zodResolver(RegisterCustomerSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        shouldFocusError: true,
    });

    const onSubmit = async (data: RegisterCustomer) => {
        try {
            const res = await AuthService.register(data);
            if (!res) {
                alert('Something went wrong');
                return;
            }
            alert('Registration Successful');
            router.push('/signin');
        } catch (err) {
            console.error(err);
            alert('Registration failed');
        }
    };

    return (
        <div className="hero-content flex-col">
            <div className="card w-full text-black max-w-sm">
                <h1 className="text-center text-3xl">Register</h1>

                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>

                        {/* Name */}
                        <label className="label">Full Name</label>
                        <input
                            {...register('name')}
                            className="input bg-white border-2"
                            placeholder="Md Munna"
                        />
                        {isSubmitted && errors.name && (
                            <p className="text-red-500">{errors.name.message}</p>
                        )}

                        {/* Email */}
                        <label className="label">Email</label>
                        <input
                            type="email"
                            {...register('email')}
                            className="input bg-white border-2"
                            placeholder="name@example.com"
                        />
                        {isSubmitted && errors.email && (
                            <p className="text-red-500">{errors.email.message}</p>
                        )}

                        {/* Phone */}
                        <label className="label">Phone</label>
                        <input
                            type="tel"
                            {...register('phone')}
                            className="input bg-white border-2"
                            placeholder="01712345678"
                        />
                        {isSubmitted && errors.phone && (
                            <p className="text-red-500">{errors.phone.message}</p>
                        )}

                        {/* Address */}
                        <label className="label">Address</label>

                        <input
                            {...register('address.location')}
                            className="input bg-white border-2"
                            placeholder="Location"
                        />
                        {isSubmitted && errors.address?.location && (
                            <p className="text-red-500">
                                {errors.address.location.message}
                            </p>
                        )}

                        <input
                            {...register('address.city')}
                            className="input bg-white border-2"
                            placeholder="City"
                        />
                        {isSubmitted && errors.address?.city && (
                            <p className="text-red-500">
                                {errors.address.city.message}
                            </p>
                        )}

                        <input
                            {...register('address.details')}
                            className="input bg-white border-2"
                            placeholder="Details"
                        />
                        {isSubmitted && errors.address?.details && (
                            <p className="text-red-500">
                                {errors.address.details.message}
                            </p>
                        )}

                        {/* Password */}
                        <label className="label">Password</label>
                        <input
                            type="password"
                            {...register('password')}
                            className="input bg-white border-2"
                            placeholder="Password"
                        />
                        {isSubmitted && errors.password && (
                            <p className="text-red-500">{errors.password.message}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-neutral mt-4 w-full"
                        >
                            {isSubmitting ? 'Registering...' : 'Register'}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
