"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import OrderViewModal from "./order-details-modal";

export function OrderActionWrapper({ order, deliverymen }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleUpdate = () => {
    setIsOpen(false);
    router.refresh();
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="p-2 bg-gray-100 hover:bg-indigo-600 hover:text-white rounded-lg transition-all"
      >
        <Eye size={18}/>
      </button>

      {isOpen && (
        <OrderViewModal 
          isOpen={isOpen} 
          order={order} 
          deliverymen={deliverymen}
          onClose={() => setIsOpen(false)} 
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
}