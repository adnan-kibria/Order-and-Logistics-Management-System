"use client";

import React from "react";
import { Truck, Package, X } from "lucide-react";
import { AddUserModalProps } from "../_interfaces/user-modal-props.interface";

export default function AddUserModal({
  isOpen,
  onClose,
  onSubmit,
  userType,
  setUserType,
  formData,
  setFormData,
}: AddUserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay: Semi-transparent with a slight blur */}
      <div 
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Fixed Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New User</h2>
            <p className="text-sm text-gray-500 mt-1">Create a new staff member</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="addUserForm" onSubmit={onSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 bg-white">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              User Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType("deliveryman")}
                className={`px-4 py-3 rounded-lg border-2 transition-all flex flex-col items-center ${
                  userType === "deliveryman"
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm"
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
                    ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
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
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Uppercase, lowercase, number, and special character required.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="+880 1XXX-XXXXXX"
              />
            </div>
          </div>
        </form>

        {/* Fixed Footer */}
        <div className="p-6 border-t border-gray-200 flex space-x-3 bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="addUserForm"
            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
          >
            Create User
          </button>
        </div>
      </div>
    </div>
  );
}