import { getUIDFolderList } from '@/server/uidFolders';

export async function GET(request: Request) {
    return Response.json(await getUIDFolderList())
  }
