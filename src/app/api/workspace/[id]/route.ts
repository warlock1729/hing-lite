import { NextResponse } from "next/server";
import { getUserWorkspaceById } from "@/app/actions/workspaceActions"; // adjust path

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const workspaceId = Number((await params).id);

  if (Number.isNaN(workspaceId)) {
    return NextResponse.json(
      { status: "error", error: "Invalid workspace id" },
      { status: 400 }
    );
  }

  try {
    const result = await getUserWorkspaceById(workspaceId);
    if (result.status === "error") {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error:any) {
    return NextResponse.json(
      { status: "error", error: `${error?.message ?? error}` },
      { status: 500 }
    );
  }
}
