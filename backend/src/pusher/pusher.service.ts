/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import Pusher from 'pusher';

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
});


// Function called when admin updates order status
// function notifyCustomerOrderStatus(customerId: string, orderId: string, status: string) {
//     pusher.trigger(`private-order-${customerId}`, 'order-status-changed', {
//         orderId,
//         status,
//         message: `Your order #${orderId} is now ${status}`,
//     });
// }
pusher.trigger("my-channel", "my-event", {
    message: "hello world"
});