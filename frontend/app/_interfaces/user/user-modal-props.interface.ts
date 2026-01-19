export interface AddUserProps {
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
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    password: string;
    phone: string;
  }>>;
}