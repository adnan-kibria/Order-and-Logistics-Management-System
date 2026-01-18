'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { AuthService } from '@/app/_services/auth.service';
import { RegisterCustomer } from '@/app/_interfaces/customer/register-customer.interface';
import { RegisterCustomerSchema } from '@/app/_schemas/register-customer.schema';
import Link from 'next/dist/client/link';

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
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200">

                {/* Header */}
                <div className="px-8 pt-8 pb-4 text-center border-b">
                    <h1 className="text-3xl font-semibold text-gray-800">
                        Create Account
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Sign up to get started
                    </p>
                </div>

                {/* Form */}
                <div className="px-8 py-6">
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                {...register('name')}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-neutral focus:outline-none focus:ring-2 focus:ring-neutral/20"
                                placeholder="Md Munna"
                            />
                            {isSubmitted && errors.name && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                {...register('email')}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-neutral focus:outline-none focus:ring-2 focus:ring-neutral/20"
                                placeholder="name@example.com"
                            />
                            {isSubmitted && errors.email && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                {...register('phone')}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-neutral focus:outline-none focus:ring-2 focus:ring-neutral/20"
                                placeholder="01712345678"
                            />
                            {isSubmitted && errors.phone && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    {...register('address.location')}
                                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-neutral focus:outline-none focus:ring-2 focus:ring-neutral/20"
                                    placeholder="Location"
                                />
                                <input
                                    {...register('address.city')}
                                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-neutral focus:outline-none focus:ring-2 focus:ring-neutral/20"
                                    placeholder="City"
                                />
                            </div>

                            {isSubmitted && (errors.address?.location || errors.address?.city) && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.address?.location?.message || errors.address?.city?.message}
                                </p>
                            )}

                            <input
                                {...register('address.details')}
                                className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-neutral focus:outline-none focus:ring-2 focus:ring-neutral/20"
                                placeholder="Address details"
                            />
                            {isSubmitted && errors.address?.details && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.address.details.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                {...register('password')}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-neutral focus:outline-none focus:ring-2 focus:ring-neutral/20"
                                placeholder="••••••••"
                            />
                            {isSubmitted && errors.password && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-4 w-full rounded-lg bg-neutral px-4 py-2.5 text-white font-medium hover:bg-neutral-focus transition disabled:opacity-60"
                        >
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 text-center text-sm text-gray-500 border-t">
                    Already have an account?
                    <Link href="/signin" className="ml-1 text-neutral font-medium cursor-pointer hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>

    );
}
