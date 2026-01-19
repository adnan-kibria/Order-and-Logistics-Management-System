'use client';

import { useEffect } from 'react';
import Pusher from 'pusher-js';
import toast, { Toaster } from 'react-hot-toast';

interface OrderNotification {
  orderId: string;
  status: string;
  message: string;
}

interface Props {
  customerId: number;
}
export default function OrderNotifications({ customerId }: Props) {
  useEffect(() => {
    // Initialize Pusher (frontend only uses key & cluster)
    const pusher = new Pusher('8f804bded840f6535f33', {
      cluster: 'ap2',
    });

    // Subscribe to the customer-specific channel
    const channel = pusher.subscribe(`order-${customerId}`);

    // Listen for order status updates
    channel.bind('order-status-changed', (data: OrderNotification) => {
      console.log('Order update received:', data);

      // Show a toast notification
      toast.success(data.message, {
        duration: 5000
      });
    });

    // Cleanup
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [customerId]);

  return <Toaster position="top-right" reverseOrder={false} />;
}
