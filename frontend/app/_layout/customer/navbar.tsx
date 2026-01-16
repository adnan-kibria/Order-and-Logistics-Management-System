'use client'

import Link from 'next/link'
import { useCart } from '../../_context/CartContext'
import { AuthService } from '@/app/_services/auth.service'
import { useRouter, usePathname } from 'next/navigation'

export default function CustomerNavbar() {
    const { cart } = useCart()
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = async () => {
        await AuthService.logout()
        router.push('/signin')
    }

    const navLinkClass = (path: string) => {
        const isActive = pathname === path

        return `
            px-4 py-2 rounded-full border border-red-900 font-medium
            transition-all duration-300 ease-in-out
            hover:bg-secondary hover:text-white hover:border-secondary
            ${isActive
                ? 'bg-primary text-white border-primary shadow-md'
                : 'border-base-300 text-base-content'
            }
        `
    }

    return (
        <div className="navbar bg-base-100 shadow-md px-4">
            {/* Left */}
            <div className="navbar-start">
                <Link
                    href="/customer/dashboard"
                    className="text-xl font-bold tracking-wide hover:text-primary transition-colors"
                >
                    Shop-Online
                </Link>
            </div>

            {/* Center */}
            <div className="navbar-center hidden lg:flex">
                <ul className="flex gap-4">
                    <li>
                        <Link
                            href="/customer/dashboard"
                            className={navLinkClass('/customer/dashboard')}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/customer/my-orders"
                            className={navLinkClass('/customer/my-orders')}
                        >
                            My Orders
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/customer/track-order"
                            className={navLinkClass('/customer/track-order')}
                        >
                            Track Order
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Right */}
            <div className="navbar-end gap-3">
                <Link
                    href="check-out"
                    className="btn btn-primary btn-sm md:btn-md"
                >
                    Check-out
                    <span className="ml-1 font-semibold">
                        ({cart.length})
                    </span>
                </Link>

                <button
                    onClick={handleLogout}
                    className="btn btn-error btn-sm md:btn-md"
                >
                    Logout
                </button>
            </div>
        </div>
    )
}
