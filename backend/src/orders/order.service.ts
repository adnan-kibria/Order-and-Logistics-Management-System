/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { Orders } from "./entities/orders.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Customers } from "src/customers/entities/customers.entity";

@Injectable()
export class OrderService {
    constructor(@InjectRepository(Orders) private readonly orderRepo: Repository<Orders>,
        @InjectRepository(Customers) private readonly customerRepo: Repository<Customers>) { }

    // async placeOrder(obj: any): Promise<Orders> {
    //     // const {customerId} = obj;
    //     // const customer = this.findCustomer(customerId);
    //     // {

    //     //     "productTotal": 2500.0,
    //     //         "total": 2600.0,
    //     //             "shippingCharge": 100.0,
    //     //                 "customer": {
    //     //         "id": 3,
    //     //             "name": "John Doe",
    //     //                 "phone": "01712345678"
    //     //     },
    //     //     "orderStatus": {
    //     //         "id": 2,
    //     //             "status": "Delivered"
    //     //     },
    //     // }
    // }
    async findCustomer(id: number): Promise<Customers | null> {
        return await this.customerRepo.findOne({
            where: { id },
            relations: ['user', 'shippingAddress'], 
        });
    }

}

// {
//   "customerId": 3,
//   "shippingCharge": 100,
//   "products": [
//     {
//       "product": {
//         "id": 1,
//         "name": "Smartphone",
//         "stockQty": 100,
//         "price": 699.99,
//         "discount": 50,
//         "category": {
//           "id": 1,
//           "name": "Electronics"
//         }
//       },
//       "orderPrice": 350
//     },
//     {
//       "product": {
//         "id": 3,
//         "name": "Laptop",
//         "stockQty": 50,
//         "price": 999.99,
//         "discount": 50,
//         "category": {
//           "id": 1,
//           "name": "Electronics"
//         }
//       },
//       "orderPrice": 500
//     }
//   ]
// }