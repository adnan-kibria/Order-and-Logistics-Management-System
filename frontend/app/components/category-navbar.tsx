import { ICategory } from "../_interfaces/category.interface";
import { CategoryService } from "../_services/category.service";
export default async function CategoryNavBar() {
    const data: ICategory[] = await CategoryService.getAll();
    return (
        <div className=" mx-auto grid grid-cols-6 gap-4 my-4">
            <h2 key={0} className="text-center border p-1 rounded-4xl">All</h2>
            {
                data.map((category: ICategory) => (
                    <h2 key={category.id} className="text-center border p-1 rounded-4xl">{category.name}</h2>
                ))
            }
        </div>
    )
}
