import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { DeliverymanService } from './deliveryman.service';
import { CreateDeliverymanDto } from './dto/create-deliveryman.dto';
import { UpdateDeliverymanDto } from './dto/update-deliveryman.dto';

@Controller('deliveryman')
export class DeliverymanController {
  constructor(private readonly deliverymanService: DeliverymanService) {}

  // --- Standard CRUD ---
  @Post()
  create(@Body() createDto: CreateDeliverymanDto) {
    return this.deliverymanService.create(createDto);
  }

  @Get()
  findAll() {
    return this.deliverymanService.findAll();
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deliverymanService.remove(id);
  }

  // --- Profile Features ---
  
  // 7. View Profile
  @Get(':id/profile')
  getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.deliverymanService.findOne(id);
  }

  // 8. Edit Profile
  @Patch(':id/profile')
  updateProfile(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateDeliverymanDto) {
    return this.deliverymanService.update(id, updateDto);
  }

  // --- Order Features ---

  // 1. View Assigned Orders
  @Get(':id/orders/assigned')
  getAssignedOrders(@Param('id', ParseIntPipe) id: number) {
    return this.deliverymanService.findAssignedOrders(id);
  }

  // 2. Accept Order
  @Patch(':id/orders/:orderId/accept')
  acceptOrder(@Param('id', ParseIntPipe) id: number, @Param('orderId', ParseIntPipe) orderId: number) {
    return this.deliverymanService.acceptOrder(id, orderId);
  }

  // 3. View On the Way Orders
  @Get(':id/orders/on-the-way')
  getOnTheWayOrders(@Param('id', ParseIntPipe) id: number) {
    return this.deliverymanService.findOnTheWayOrders(id);
  }

  // 4. Mark as Delivered
  @Patch(':id/orders/:orderId/deliver')
  markDelivered(@Param('id', ParseIntPipe) id: number, @Param('orderId', ParseIntPipe) orderId: number) {
    return this.deliverymanService.markOrderDelivered(id, orderId);
  }

  // 5. View Completed (History)
  @Get(':id/orders/completed')
  getCompletedOrders(@Param('id', ParseIntPipe) id: number) {
    return this.deliverymanService.findCompletedOrders(id);
  }

  // 6. View Today's Completed
  @Get(':id/orders/completed-today')
  getTodayCompletedOrders(@Param('id', ParseIntPipe) id: number) {
    return this.deliverymanService.findTodayCompletedOrders(id);
  }
}