import { User as UserType } from "@/app/_interfaces/user.interface";

export interface UserTableProps {
  data: UserType[];
  searchTerm: string;
  typeLabel: "Customer" | "Deliveryman" | "Inventory Manager";
}