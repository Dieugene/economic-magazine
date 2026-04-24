import { api } from "@/lib/api/client";
import EditorialBoardView from "./EditorialBoardView";

export default async function EditorialBoardPage() {
  const members = await api.getEditorialBoard();
  return <EditorialBoardView members={members} />;
}
