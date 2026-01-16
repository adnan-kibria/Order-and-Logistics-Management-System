"use client";

import { useState } from "react";
import { Plus} from "lucide-react";
import { useRouter } from "next/navigation";
import { UserService } from "@/app/_services/user.service";
import AddUserModal from "@/app/components/add-user-modal";

export function AddUserButton() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [userType, setUserType] = useState<"deliveryman" | "inventory_manager">("deliveryman");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });
  const router = useRouter();

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (userType === "deliveryman") {
        await UserService.createDeliveryman(formData);
      } else {
        await UserService.createInventoryManager(formData);
      }
      setShowAddModal(false);
      setFormData({ name: "", email: "", password: "", phone: "" });
      router.refresh();
    } catch (error) {
      console.error("Failed to create user", error);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowAddModal(true)}
        className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
      >
        <Plus className="w-5 h-5" />
        <span>Add User</span>
      </button>

      <AddUserModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddUser}
        userType={userType}
        setUserType={setUserType}
        formData={formData}
        setFormData={setFormData}
      />
    </>
  );
}