// app/api/users/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name")?.trim();
  const workspaceId = Number(searchParams.get("workspaceId"));

  if (!name || name.length < 1 || !workspaceId) {
    return NextResponse.json(
      { message: "name (min 1 chars) and valid workspaceId are required" },
      { status: 400 }
    );
  }

  const users = await prisma.user.findMany({
    where: {
      name: {
        contains: name,
        mode: "insensitive",
      },
      workspaceMembers: {
        some: {
          workspaceId,
          isRemoved: false,
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
    // take: 10,
  });

  return NextResponse.json({ users });
}
