import { UserService } from "../../../_services/user.service";
import { User as UserType } from "../../../_interfaces/user.interface";
import { SearchBar } from "@/app/components/search-bar";
import { UserTable } from "@/app/components/user-table";

export default async function CustomerPage(props: {
  searchParams: Promise<{ search?: string }>;
}) {
  const searchParams = await props.searchParams;
  const searchTerm = searchParams.search || "";

  let invmanagerData: UserType[] = [];

  try {
    const data = await UserService.getAllUsersWithRelations();
    
    invmanagerData = Array.isArray(data) 
      ? data.filter((user) => user.role === "inventorymanager") 
      : [];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      invmanagerData = invmanagerData.filter(
        (c) =>
          c.email.toLowerCase().includes(lowerTerm) ||
          c.profile?.name?.toLowerCase().includes(lowerTerm) ||
          c.profile?.phone?.includes(searchTerm)
      );
    }
  } catch (error) {
    console.error("Failed to fetch inventory managers:", error);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Inventory Managers</h1>
        <p className="text-gray-600 mt-1">Manage all inventory manager accounts ({invmanagerData.length} total)</p>
      </header>

      <SearchBar defaultValue={searchTerm} />

      <UserTable 
      data={invmanagerData} 
      searchTerm={searchTerm}
      typeLabel="Inventory Manager" />
    </div>
  );
}