/* eslint-disable prettier/prettier */
export class UserProfile {
    userId: string;
    email: string;
    password: string;
    role: string;
}

export class ShippingAddressProfile {
    id: number;
    city: string;
    location: string;
    details: string;
}

export class CustomerProfile {
    id: number;
    name: string;
    phone: string;
    user: UserProfile;
    shippingAddress: ShippingAddressProfile;
}

export class ViewProfile {
    name: string;
    phone: string;
    email: string;
    userId: string;
    city: string;
    location: string;
    details: string;
}