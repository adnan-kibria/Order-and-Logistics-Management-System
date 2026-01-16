"use client";

import { useState } from "react";
import { Truck, Package, X, AlertCircle } from "lucide-react";
import { AddUserModalProps } from "../_interfaces/user/user-modal-props.interface";

export default function AddUserModal({
  isOpen,
  onClose,
  onSubmit,
  userType,
  setUserType,
  formData,
  setFormData,
}: AddUserModalProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password does not meet security requirements.";
    }
    const phoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Enter a valid phone number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(e);
      setErrors({});
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
      <div 
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New User</h2>
            <p className="text-sm text-gray-500 mt-1">Create a new staff member</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
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
                  userType === "deliveryman"
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <Truck className="w-5 h-5 mb-1" />
                <span className="text-sm font-medium">Deliveryman</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType("inventory_manager")}
                className={`px-4 py-3 rounded-lg border-2 transition-all flex flex-col items-center ${
                  userType === "inventory_manager"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <Package className="w-5 h-5 mb-1" />
                <span className="text-sm font-medium">Manager</span>
              </button>
            </div>
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
                Uppercase, lowercase, number, and special character required (min 6).
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={inputClasses("phone")}
                placeholder="+880 1XXX-XXXXXX"
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.phone}</p>}
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-gray-200 flex space-x-3 bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="addUserForm"
            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm"
          >
            Create User
          </button>
        </div>
      </div>
    </div>
  );
}