//kibria

'use client';
import { useRouter } from "next/navigation";
import { UserService } from "../_services/user.service";
import { Eye, Trash2 } from "lucide-react";
import Link from "next/link";

export function ActionButtons({ email, userId }: { email: string; userId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;
    try {
      await UserService.deleteUser(email);
      router.refresh();
    } catch (e) {
      alert("Failed to delete user");
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Link href={`/admin/users/${userId}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
        <Eye className="w-5 h-5" />
      </Link>
      <button onClick={handleDelete} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}