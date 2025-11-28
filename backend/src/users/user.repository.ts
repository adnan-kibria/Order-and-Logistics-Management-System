// /* eslint-disable prettier/prettier */
// import { InjectRepository } from "@nestjs/typeorm";
// import { Users } from "./entities/users.entity";
// import { Injectable } from "@nestjs/common";
// import { Repository } from "typeorm";


// @Injectable()
// export class UsersRepository {
//     constructor(@InjectRepository(Users) private repo: Repository<Users>) { }
//     async registerCustomer(obj): Promise<Users> {
//         const user = {
//             email: "obj?.email",
//             role: 'customer',
//             password: "obj?.password"

//         }
//         const u = this.repo.create(user);
//         return await this.repo.save(u);
//     }
// }