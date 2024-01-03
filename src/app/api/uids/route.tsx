import { getUIDFolderList } from "@/server/DataLoader";

export async function GET(request: Request) {
    return Response.json(await getUIDFolderList())
  }
