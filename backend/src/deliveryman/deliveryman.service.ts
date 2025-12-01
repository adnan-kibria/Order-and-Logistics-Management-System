import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateDeliverymanDto } from './dto/create-deliveryman.dto';
import { UpdateDeliverymanDto } from './dto/update-deliveryman.dto';
import { Deliveryman } from './entities/deliveryman.entity';
import { IOrder } from './interface/deliveryman.interface';
import { DeliverymanInterface } from './interface/deliveryman.interface';

@Injectable()
export class DeliverymanService {
  // Mock Database: Deliverymen
  private deliverymen: Deliveryman[] = [
    { id: 1, name: 'Pranto', email: 'pranto@mail.com', phone: '123456', vehicleType: 'Bike', isActive: true, joinedAt: new Date() }
  ];

  // Mock Database: Orders
  private orders: IOrder[] = [
    { id: 101, deliverymanId: 1, status: 'assigned', items: 'Pizza' },
    { id: 102, deliverymanId: 1, status: 'on_the_way', items: 'Burger' },
    { id: 103, deliverymanId: 1, status: 'delivered', items: 'Sushi', deliveredAt: new Date() },
    { id: 104, deliverymanId: 1, status: 'delivered', items: 'Pasta', deliveredAt: new Date('2023-01-01') },
  ];

  // --- CRUD & Profile Logic ---

  create(createDeliverymanDto: CreateDeliverymanDto) {
    const newId = this.deliverymen.length + 1;
    const newDeliveryman: Deliveryman = {
      id: newId,
      ...createDeliverymanDto,
      isActive: true,
      joinedAt: new Date(),
    };
    this.deliverymen.push(newDeliveryman);
    return newDeliveryman;
  }

  findAll() {
    return this.deliverymen;
  }

  findOne(id: number) {
    const deliveryman = this.deliverymen.find((d) => d.id === id);
    if (!deliveryman) throw new NotFoundException(`Deliveryman #${id} not found`);
    return deliveryman;
  }

  update(id: number, updateDeliverymanDto: UpdateDeliverymanDto) {
    const index = this.deliverymen.findIndex((d) => d.id === id);
    if (index === -1) throw new NotFoundException(`Deliveryman #${id} not found`);

    const updated = { ...this.deliverymen[index], ...updateDeliverymanDto };
    this.deliverymen[index] = updated;
    return updated;
  }

  remove(id: number) {
    const index = this.deliverymen.findIndex((d) => d.id === id);
    if (index === -1) throw new NotFoundException(`Deliveryman #${id} not found`);
    const deleted = this.deliverymen.splice(index, 1);
    return deleted[0];
  }

  // --- Order Management Logic ---

  async findAssignedOrders(id: number) {
    return this.orders.filter(o => o.deliverymanId === id && o.status === 'assigned');
  }

  async acceptOrder(deliverymanId: number, orderId: number) {
    const order = this.orders.find(o => o.id === orderId && o.deliverymanId === deliverymanId);
    if (!order) throw new NotFoundException('Order not found or not assigned to you');
    if (order.status !== 'assigned') throw new BadRequestException('Order cannot be accepted in current status');

    order.status = 'on_the_way';
    return { message: 'Order accepted', order };
  }

  async findOnTheWayOrders(id: number) {
    return this.orders.filter(o => o.deliverymanId === id && o.status === 'on_the_way');
  }

  async markOrderDelivered(deliverymanId: number, orderId: number) {
    const order = this.orders.find(o => o.id === orderId && o.deliverymanId === deliverymanId);
    if (!order) throw new NotFoundException('Order not found');
    if (order.status === 'delivered') throw new BadRequestException('Order is already delivered');

    order.status = 'delivered';
    order.deliveredAt = new Date();
    return { message: 'Order delivered successfully', order };
  }

  async findCompletedOrders(id: number) {
    return this.orders.filter(o => o.deliverymanId === id && o.status === 'delivered');
  }

  async findTodayCompletedOrders(id: number) {
    const todayStr = new Date().toDateString();
    return this.orders.filter(o => 
      o.deliverymanId === id && 
      o.status === 'delivered' && 
      o.deliveredAt?.toDateString() === todayStr
    );
  }
}