import MyNavbar from "@/components/navbar/MyNavbar";
import Sidebar from "./Sidebar";
import { SmallText } from "@/components/typography";
import { Divider } from "@heroui/divider";
import  { ReactNode } from "react";
import { getUserWorkspaceById } from "@/app/actions/workspaceActions";
import { notFound } from "next/navigation";
import { fetchWorkspaceById } from "@/lib/helpers/workspace";


export default async function HomeLayout({
  children,params
}: Readonly<{
  children: ReactNode;
    params:Promise<{ id: string }>
}>) {
  const id =  Number((await params).id)
  if(isNaN(id) || id===0){
    return notFound
  }

  const result = await fetchWorkspaceById(id)
  if(result.status==='error') return "Workspace not found"
  const workspace = result.data
  return (
    <div>
      <MyNavbar />
      <div className="flex items-start">
        <Sidebar key={new Date().toISOString()} workspace={workspace} />
        <Divider orientation="vertical" className={`border sticky top-[48px] h-[calc(100vh-48px)] `} />
        <main className="w-full ">
          <div className="h-[60px] p-2 px-3 flex flex-col sticky top-0">
            <span className=" font-bold">Welcome to Hing</span>
            <SmallText>Manage taks and collaborate with your team easily </SmallText>
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
