"use client";

import { useState } from "react";
import { Truck, Package, X, AlertCircle } from "lucide-react";
import { AddUserProps } from "../_interfaces/user/user-modal-props.interface";
import { AddUserSchema } from "../_schemas/add-user.schema";

export default function AddUserModal({ isOpen, onClose, onSubmit, userType, setUserType, formData, setFormData,}: AddUserProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const dataToValidate = {
      ...formData,
      role: userType,
    };

    const result = AddUserSchema.safeParse(dataToValidate);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(e);
    }
  };

  const inputClasses = (fieldName: string) => `
    w-full px-4 py-2.5 border rounded-lg outline-none transition-all
    ${errors[fieldName] 
      ? "border-red-500 focus:ring-2 focus:ring-red-200" 
      : "border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"}
  `;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New User</h2>
            <p className="text-sm text-gray-500 mt-1">Create a new staff member</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form id="addUserForm" onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 bg-white">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">User Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType("deliveryman")}
                className={`px-4 py-3 rounded-lg border-2 transition-all flex flex-col items-center ${
                  userType === "deliveryman" ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-600"
                }`}
              >
                <Truck className="w-5 h-5 mb-1" />
                <span className="text-sm font-medium">Deliveryman</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType("inventory_manager")}
                className={`px-4 py-3 rounded-lg border-2 transition-all flex flex-col items-center ${
                  userType === "inventory_manager" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-600"
                }`}
              >
                <Package className="w-5 h-5 mb-1" />
                <span className="text-sm font-medium">Manager</span>
              </button>
            </div>
            {errors.role && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.role}</p>}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClasses("name")}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClasses("email")}
                placeholder="user@example.com"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={inputClasses("password")}
                placeholder="••••••••"
              />
              <p className={`text-[11px] mt-1 ${errors.password ? "text-red-500" : "text-gray-500"}`}>
                {errors.password || "8+ chars: Uppercase, lowercase, number, and symbol required."}
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={inputClasses("phone")}
                placeholder="017XXXXXXXX"
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.phone}</p>}
            </div>
          </div>
        </form>
        <div className="p-6 border-t border-gray-200 flex space-x-3 bg-gray-50 flex-shrink-0">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium">
            Cancel
          </button>
          <button type="submit" form="addUserForm" className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm">
            Create User
          </button>
        </div>
      </div>
    </div>
  );
}