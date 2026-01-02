// // app/api/users/[id]/role/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { auth } from "@/auth";

// export async function PATCH(req: NextRequest) {
//   try {
//     const { email, role, workspaceId } = await req.body
//     const session = await auth();

//     if (!session?.user?.id) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const requester = await prisma.workspaceMember.findUnique({
//       where: {
//         userId_workspaceId: {
//           userId: Number(session.user.id),
//           workspaceId,
//         },
//       },
//     });

//     if (requester?.role !== "OWNER") {
//       return NextResponse.json({ message: "Forbidden" }, { status: 403 });
//     }

//     const targetUser = await prisma.user.findUnique({ where: { email } });
//     if (!targetUser) {
//       return NextResponse.json({ message: "User not found" }, { status: 400 });
//     }

//     if (targetUser.id === Number(session.user.id)) {
//       return NextResponse.json(
//         { message: "Owner cannot change own role" },
//         { status: 400 }
//       );
//     }

//     const targetMember = await prisma.workspaceMember.findUnique({
//       where: {
//         userId_workspaceId: {
//           userId: targetUser.id,
//           workspaceId,
//         },
//       },
//     });

//     if (!targetMember) {
//       return NextResponse.json(
//         { message: "User not in workspace" },
//         { status: 400 }
//       );
//     }

//     const normalizedRole = role?.toUpperCase();
//     if (!["OWNER", "ADMIN", "MEMBER"].includes(normalizedRole)) {
//       return NextResponse.json({ message: "Invalid role" }, { status: 400 });
//     }

//     const updated = await prisma.workspaceMember.update({
//       where: {
//         userId_workspaceId: {
//           userId: targetUser.id,
//           workspaceId,
//         },
//       },
//       data: { role: normalizedRole },
//     });

//     return NextResponse.json(updated);
//   } catch (e) {
//     console.error(e);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }


