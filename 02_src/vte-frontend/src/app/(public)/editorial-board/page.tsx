import { api } from "@/lib/api/client";
import EditorialBoardView from "./EditorialBoardView";

export const dynamic = "force-dynamic";

export default async function EditorialBoardPage() {
  const members = await api.getEditorialBoard();
  return <EditorialBoardView members={members} />;
}
