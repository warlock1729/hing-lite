import MyNavbar from "@/components/MyNavbar";
import Sidebar from "./Sidebar";
import { SmallText } from "@/components/typography";
import { Divider } from "@heroui/divider";
import React from "react";
import { getUserWorkspaceByIdOrDefaultWorkspace } from "@/app/actions/workspaceActions";


export default async function HomeLayout({
  children,params
}: Readonly<{
  children: React.ReactNode;
    params:Promise<{ id: string }>
}>) {
  let workspaceId:number|null;
  const id =  Number((await params).id)
  if(isNaN(id) || id===0){
    workspaceId=null
  }
  else {
    workspaceId=id
  }
    const workspace = await getUserWorkspaceByIdOrDefaultWorkspace(workspaceId)
  return (
    <div>
      <MyNavbar />
      <div className="flex">
        <Sidebar workspace={workspace} />
        <Divider orientation="vertical" className={`border h-[calc(100vh-48px)]`} />
        <main className=" w-full">
          <div className="h-[60px] p-2 px-3 flex flex-col">
            <span className=" font-bold">Home</span>
            <SmallText>Monitor all your project here</SmallText>
          </div>
          <Divider orientation="horizontal" className=" " />
          <div className="p-6">
          {children}
          </div>
        </main>
      </div>
    </div>
  );
}
