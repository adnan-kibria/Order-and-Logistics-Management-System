import { UserService } from "../../../_services/user.service";
import { User as UserType } from "../../../_interfaces/user.interface";
import { SearchBar } from "@/app/components/search-bar";
import { UserTable } from "@/app/components/user-table";

export default async function DeliverymanPage(props: {
  searchParams: Promise<{ search?: string }>;
}) {
  const searchParams = await props.searchParams;
  const searchTerm = searchParams.search || "";

  let deliverymanData: UserType[] = [];

  try {
    const data = await UserService.getAllUsersWithRelations();
    deliverymanData = Array.isArray(data) 
      ? data.filter((user) => user.role === "deliveryman") 
      : [];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      deliverymanData = deliverymanData.filter(
        (c) =>
          c.email.toLowerCase().includes(lowerTerm) ||
          c.profile?.name?.toLowerCase().includes(lowerTerm) ||
          c.profile?.phone?.includes(searchTerm)
      );
    }
  } catch (error) {
    console.error("Failed to fetch deliverymen:", error);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Deliverymen</h1>
        <p className="text-gray-600 mt-1">
          Manage all deliveryman accounts ({deliverymanData.length} total)
        </p>
      </header>

      <SearchBar defaultValue={searchTerm} />

      <UserTable 
      data={deliverymanData} 
      searchTerm={searchTerm}
      typeLabel="Deliveryman" />
    </div>
  );
}