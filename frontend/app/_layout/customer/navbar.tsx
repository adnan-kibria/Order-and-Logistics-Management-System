'use client'
import Link from 'next/link'
import { useCart } from '../../_context/CartContext';

export default function CustomerNavbar() {
    const { cart } = useCart();

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <h1 className="btn btn-ghost text-xl">Shop-Online</h1>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-5">
                    <Link className='border-2 p-2 rounded-4xl' href='my-orders'>My Orders</Link>
                    <Link className='border-2 p-2 rounded-4xl' href='track-order'>Track Order</Link>
                </ul>
            </div>

            <div className="navbar-end gap-2">
                <Link className='btn btn-primary' href='check-out'>
                    Check-out ({cart.length})
                </Link>
                <button className="btn btn-error">Logout</button>
            </div>
        </div>
    );
}
