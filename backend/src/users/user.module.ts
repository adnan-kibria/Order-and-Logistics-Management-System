/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "./entities/users.entity";
import { DeliveryMen } from "./entities/deliverymen.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [TypeOrmModule.forFeature([ Users, DeliveryMen])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
    
})
export class UserModule { }