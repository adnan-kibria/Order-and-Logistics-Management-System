import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDeliverymanDto } from './dto/create-deliveryman.dto';
import { UpdateDeliverymanDto } from './dto/update-deliveryman.dto';
import { Deliveryman } from './entities/deliveryman.entity';
import { Orders } from '../orders/entities/orders.entity'; 
import { OrderStatuses } from '../orders/entities/order-statuses.entity'; 

@Injectable()
export class DeliverymanService {
  constructor(
    @InjectRepository(Deliveryman)
    private deliverymanRepo: Repository<Deliveryman>,

    @InjectRepository(Orders)
    private orderRepo: Repository<Orders>,

    @InjectRepository(OrderStatuses)
    private orderStatusRepo: Repository<OrderStatuses>,
  ) {}

  // --- CRUD Logic (Standard Deliveryman Management) ---

  async create(createDeliverymanDto: CreateDeliverymanDto) {
    const deliveryman = this.deliverymanRepo.create(createDeliverymanDto);
    return await this.deliverymanRepo.save(deliveryman);
  }

  async findAll() {
    return await this.deliverymanRepo.find();
  }

  async findOne(id: number) {
    const deliveryman = await this.deliverymanRepo.findOne({ where: { id } });
    if (!deliveryman) throw new NotFoundException(`Deliveryman #${id} not found`);
    return deliveryman;
  }

  async update(id: number, updateDeliverymanDto: UpdateDeliverymanDto) {
    const deliveryman = await this.deliverymanRepo.preload({
      id: id,
      ...updateDeliverymanDto,
    });
    if (!deliveryman) throw new NotFoundException(`Deliveryman #${id} not found`);
    return await this.deliverymanRepo.save(deliveryman);
  }

  async remove(id: number) {
    const deliveryman = await this.findOne(id);
    return await this.deliverymanRepo.remove(deliveryman);
  }

  // --- Order Management Logic (Updated for TypeORM Relations) ---

  /**
   * Helper to find a status entity by its name.
   * UPDATED: Using 'status' property instead of 'name'
   */
  private async getStatusEntity(statusName: string): Promise<OrderStatuses> {
    const status = await this.orderStatusRepo.findOne({ where: { status: statusName } }); 
    if (!status) throw new NotFoundException(`Status '${statusName}' not found in database.`);
    return status;
  }

  // 1. View Assigned Orders
  async findAssignedOrders(id: number) {
    return await this.orderRepo.find({
      where: {
        deliveryman: { id: id },       
        orderStatus: { status: 'assigned' } // UPDATED: .status instead of .name
      },
      relations: ['orderStatus', 'customer', 'orderDetails'] 
    });
  }

  // 2. Accept Order
  async acceptOrder(deliverymanId: number, orderId: number) {
    // Fetch order with its current status relation
    const order = await this.orderRepo.findOne({
      where: { id: orderId, deliveryman: { id: deliverymanId } },
      relations: ['orderStatus']
    });

    if (!order) throw new NotFoundException('Order not found or not assigned to you');
    
    // Check if current status is 'assigned'
    // UPDATED: .status instead of .name
    if (order.orderStatus?.status !== 'assigned') {
      throw new BadRequestException('Order cannot be accepted (it is not in "assigned" state)');
    }

    // Fetch the target status entity
    const onTheWayStatus = await this.getStatusEntity('on_the_way');

    // Update the relation
    order.orderStatus = onTheWayStatus;
    
    return await this.orderRepo.save(order);
  }

  // 3. View On The Way Orders
  async findOnTheWayOrders(id: number) {
    return await this.orderRepo.find({
      where: {
        deliveryman: { id: id },
        orderStatus: { status: 'on_the_way' } // UPDATED: .status instead of .name
      },
      relations: ['orderStatus', 'customer', 'orderDetails']
    });
  }

  // 4. Mark as Delivered
  async markOrderDelivered(deliverymanId: number, orderId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, deliveryman: { id: deliverymanId } },
      relations: ['orderStatus']
    });

    if (!order) throw new NotFoundException('Order not found');
    
    // UPDATED: .status instead of .name
    if (order.orderStatus?.status === 'delivered') {
      throw new BadRequestException('Order is already delivered');
    }

    // Fetch the target status entity
    const deliveredStatus = await this.getStatusEntity('delivered');

    // Update Relation and Timestamp
    order.orderStatus = deliveredStatus;
    order.deliveredAt = new Date();
    
    return await this.orderRepo.save(order);
  }

  // 5. View History (All Completed)
  async findCompletedOrders(id: number) {
    return await this.orderRepo.find({
      where: {
        deliveryman: { id: id },
        orderStatus: { status: 'delivered' } // UPDATED: .status instead of .name
      },
      relations: ['orderStatus', 'customer']
    });
  }

  // 6. View Today's Completed Orders
  async findTodayCompletedOrders(id: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Using QueryBuilder to handle Date ranges and Relations efficiently
    return await this.orderRepo.createQueryBuilder('order')
      .leftJoinAndSelect('order.orderStatus', 'orderStatus')
      .leftJoinAndSelect('order.customer', 'customer')
      .where('order.deliverymanId = :id', { id }) 
      .andWhere('orderStatus.status = :statusName', { statusName: 'delivered' }) // UPDATED: .status column
      .andWhere('order.deliveredAt >= :today', { today })
      .andWhere('order.deliveredAt < :tomorrow', { tomorrow })
      .getMany();
  }
}