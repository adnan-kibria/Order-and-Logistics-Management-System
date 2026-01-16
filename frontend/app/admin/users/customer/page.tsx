import { UserService } from "../../../_services/user.service";
import { User as UserType } from "../../../_interfaces/user.interface";
import { SearchBar } from "@/app/components/search-bar";
import { UserTable } from "@/app/components/user-table";

export default async function CustomerPage(props: {
  searchParams: Promise<{ search?: string }>;
}) {
  const searchParams = await props.searchParams;
  const searchTerm = searchParams.search || "";

  let customerData: UserType[] = [];

  try {
    const data = await UserService.getAllUsersWithRelations();
    
    customerData = Array.isArray(data) 
      ? data.filter((user) => user.role === "customer") 
      : [];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      customerData = customerData.filter(
        (c) =>
          c.email.toLowerCase().includes(lowerTerm) ||
          c.profile?.name?.toLowerCase().includes(lowerTerm) ||
          c.profile?.phone?.includes(searchTerm)
      );
    }
  } catch (error) {
    console.error("Failed to fetch customers:", error);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-1">Manage all customer accounts ({customerData.length} total)</p>
      </header>

      <SearchBar defaultValue={searchTerm} />

      <UserTable 
      data={customerData} 
      searchTerm={searchTerm}
      typeLabel="Customer" />
    </div>
  );
}