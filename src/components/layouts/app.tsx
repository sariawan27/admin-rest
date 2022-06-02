import { SUPERUSER } from "@utils/constants";
import dynamic from "next/dynamic";

const AdminLayout = dynamic(() => import("@components/layouts/admin"));
const OwnerLayout = dynamic(() => import("@components/layouts/owner"));

export default function AppLayout({
  userGroup,
  ...props
}: {
  userGroup: string[];
}) {
  if (userGroup?.includes(SUPERUSER)) {
    return <AdminLayout {...props} />;
  }
  return <OwnerLayout {...props} />;
}
