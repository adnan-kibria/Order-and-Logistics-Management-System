import { orderService } from "@/app/_services/order.service"

export default async function TrackOrders() {
  const orders = await orderService.trackOrders();
  console.log(orders);

  return (
    <div>TrackOrders</div>
  )
}
