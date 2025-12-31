"use server"
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

export async function regenerateWorkspaceInviteLink({workspaceId}:{workspaceId:string|number}) {
    const wid = Number(workspaceId)
    await prisma.workspace.update({
        where:{id:wid},
        data:{inviteCode:uuidv4()}
    })

    return {status:'success',data:{inviteCode:wid}}
}

export async function removeMemberFromWorkspace({workspaceId,memberId}:{workspaceId:string,memberId:string}){
    const wid = Number(workspaceId)
    const session = await auth()
    const email = session?.user?.email
    if(!email) return 

   const workspaceMember = await prisma.workspaceMember.findFirst({
    where:{workspaceId:wid,user:{email:email}}
   })

   if(!workspaceMember || (workspaceMember.role!=='OWNER')){
    return {status:'error',message:"Unauthorized"}
   }

   const data =await prisma.workspaceMember.update({
    where:{userId_workspaceId:{userId:workspaceMember.userId,workspaceId:workspaceMember.workspaceId}},
    data:{isRemoved:true}
   })

   return {statsu:"success",message:"Member removed successfully"}
}



type GetWorkspaceMembersParams = {
  workspaceId: number;
  page?: number;
  pageSize?: number;
  includeRemoved?: boolean;
};

export async function getWorkspaceMembers({
  workspaceId,
  page = 1,
  pageSize = 10,
  includeRemoved = false,
}: GetWorkspaceMembersParams) {
  if (page < 1) page = 1;
  if (pageSize < 1) pageSize = 10;

  const skip = (page - 1) * pageSize;
  console.log("==============",workspaceId)

  const whereClause = {
    workspaceId,
    ...(includeRemoved ? {} : { isRemoved: false }),
  };

  const [members, total] = await Promise.all([
    prisma.workspaceMember.findMany({
      where: whereClause,
      skip,
      take: pageSize,
      orderBy: {
        user: {
          createdAt: "asc",
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        },
      },
    }),

    prisma.workspaceMember.count({
      where: whereClause,
    }),
  ]);
  console.log("==============",members)

  return {
    data: members,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      hasNextPage: skip + pageSize < total,
      hasPreviousPage: page > 1,
    },
  };
}
