import MyNavbar from "@/components/navbar/MyNavbar";
import Sidebar from "./Sidebar";
import { SmallText } from "@/components/typography";
import { Divider } from "@heroui/divider";
import  { ReactNode } from "react";
import { getUserWorkspaceById } from "@/app/actions/workspaceActions";
import { notFound } from "next/navigation";


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

  const result = await getUserWorkspaceById(id)
  if(result.status==='error') return "Workspace not found"
  const workspace = result.data
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
