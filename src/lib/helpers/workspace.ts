import { ActionResult, Workspace } from "@/types";
import { cookies } from "next/headers";



export async function fetchWorkspaceById(
  workspaceId: number
): Promise<ActionResult<Workspace>> {
  const cookieStore = await cookies();
  
  const res = await fetch(`http://localhost:3000/api/workspace/${workspaceId}`, {
    method: "GET",
    // credentials: "include",
    // headers: {
    //   "Content-Type": "application/json",
    // },
        headers: {
      Cookie: cookieStore.toString(),
    },
    cache:'no-cache',
  });
  
  return res.json();
}
