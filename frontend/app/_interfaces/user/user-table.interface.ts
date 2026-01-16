import { User as UserType } from "@/app/_interfaces/user/user.interface";

export interface UserTableProps {
  data: UserType[];
  searchTerm: string;
  typeLabel: "Customer" | "Deliveryman" | "Inventory Manager";
}