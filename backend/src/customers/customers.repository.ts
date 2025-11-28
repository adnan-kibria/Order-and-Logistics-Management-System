// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable prettier/prettier */
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Users } from 'src/users/entities/users.entity';
// import { Repository } from 'typeorm';

// @Injectable()
// export class CustomersRepository {
//     constructor(@InjectRepository(Users) private userRepo: Repository<Users>) { }
//     async register(obj): Promise<Users> {
//         const user = {
//             email: "obj?.email",
//             role: 'customer',
//             password: "obj?.password"

//         }
//         const u = this.userRepo.create(user);
//         return await this.userRepo.save(u);
//     }
// }