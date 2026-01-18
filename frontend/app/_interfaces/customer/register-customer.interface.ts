export interface RegisterCustomer {
    name: string;
    email: string;
    phone: string;
    password: string;
    address: {
        location: string;
        city: string;
        details: string;
    }
}