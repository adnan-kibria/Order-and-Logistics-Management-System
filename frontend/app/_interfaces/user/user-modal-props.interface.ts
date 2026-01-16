export interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  userType: "deliveryman" | "inventory_manager";
  setUserType: (type: "deliveryman" | "inventory_manager") => void;
  formData: {
    name: string;
    email: string;
    password: string;
    phone: string;
  };
  setFormData: (data: any) => void;
}