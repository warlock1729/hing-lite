// "use client";

import {
  Caption,
  Heading1,
  Heading2,
  Heading5,
  SmallText,
} from "@/components/typography";
import { getAnalyticsStats } from "@/hooks/useAnalytics";
import { AnalyticsCard, AnalyticsStats, Workspace } from "@/types";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import {
  IoBriefcaseOutline,
  IoCheckboxOutline,
  IoAlertCircleOutline,
  IoListOutline,
  IoPersonOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import { getWorkspaceMembers } from "@/app/actions/membersActions";
import { fetchWorkspaceById } from "@/lib/helpers/workspace";
import { getTasksBySpace, getTasksByWorkspace } from "@/app/actions/taskActions";
import { mapAnalyticsCards } from "@/lib/utils";

const ANALYTICS_CARDS: Omit<AnalyticsCard, "value">[] = [
  {
    key: "totalProjects",
    title: "Total Projects",
    icon: <IoBriefcaseOutline />,
  },
  {
    key: "totalTasks",
    title: "Total Tasks",
    icon: <IoListOutline />,
  },
  {
    key: "tasksAssignedToMe",
    title: "Assigned Tasks",
    icon: <IoPersonOutline />,
  },
  {
    key: "completedTasks",
    title: "Completed Tasks",
    icon: <IoCheckboxOutline />,
  },
  {
    key: "overdueTasks",
    title: "Overdue Tasks",
    icon: <IoAlertCircleOutline />,
  },
];



export default async function HomePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workspaceId = Number(id)
  const people = await getWorkspaceMembers({workspaceId,isRemoved:false,page:1,pageSize:10})
  const isPeopleOverflow = people.data?.length >5
  if(isPeopleOverflow) people.data =  people.data.slice(0,5)
  const workspaceResult = await fetchWorkspaceById(workspaceId)
  const projects = workspaceResult.status==='success'?workspaceResult.data.projects:null
  const data = await getAnalyticsStats({
    type: "workspace",
    workspaceId: workspaceId,
  });
  const cards = data ? mapAnalyticsCards(ANALYTICS_CARDS,data) : [];
  const tasks = await getTasksByWorkspace({workspaceId})
  return (
    <div>
      <div className="flex flex-col gap-4">
        <Heading2>Welcome, user</Heading2>
        <Heading5 className="font-light text-neutral-500">
          Here is what is happening in your workspace today.
        </Heading5>
      </div>
      <div className="flex w-full gap-2 my-4">
        {cards.map((item) => {
          return (
            <Card key={item.title} className="w-full p-2">
              <CardHeader className="text-neutral-500">{item.title}</CardHeader>
              <CardBody>
                <Heading1>{item.value}</Heading1>
              </CardBody>
            </Card>
          );
        })}
      </div>
      <div className="flex gap-4">
        <Card className="w-1/2 bg-slate-200 px-2">
          <CardHeader className="font-semibold my-1">Assigned Tasks</CardHeader>
          <div className="px-3">
            <Divider orientation="horizontal" className="" />
          </div>
          <CardBody className="flex flex-col gap-3">
            {tasks.data.slice(0,3).map((task) => {
              return (
                <div key={task.title} className="bg-white p-3">
                  <Heading5 className="mb-2">{task.title}</Heading5>
                  <div className="flex gap-2">
                    <Caption className="font-normal">
                      {task.title}
                    </Caption>
                    <SmallText className="ml-4 flex">
                      {" "}
                      <IoCalendarOutline size={12} />
                      <span className="text-[12px] ml-1">
                        Due on : {task.dueDate.toLocaleDateString()} 
                      </span>{" "}
                    </SmallText>
                  </div>
                </div>
              );
            })}
          </CardBody>
        </Card>
        <Card className="bg w-full max-w-1/2">
          <CardHeader className="px-4 my-1 font-semibold w-full">
            <span>Projects (2)</span>
          </CardHeader>
          <div className="px-3">
            <Divider orientation="horizontal" className="" />
          </div>
          <CardBody className="h-fit">
            <div className="h-fit grid grid-cols-2 gap-2">
              {projects?.map((p) => {
                return (
                  <Button
                    key={p.name}
                    variant="light"
                    radius={"sm"}
                    className="flex gap-4 h-fit py-2 items-center justify-start border-1 border-neutral-300"
                  >
                    <div className="bg-green-300 px-2 py-1 aspect-square  rounded-sm font-bold ">
                      {p.name.at(0)}
                    </div>
                    <div className="text-xl">{p.name.length<18?p.name:`${p.name.slice(0,15)}...`}</div>
                  </Button>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="my-4">
        <Card className="px-2">
          <CardHeader>People</CardHeader>
          <div className="px-3">
            <hr className="border-neutral-300 border-dashed" />
          </div>
          <CardBody className="max-w-">
            <div className="flex gap-3  max-w-full">
              {people?.data && people.data.map((person) => {
                return (
                  <div
                    className="flex flex-col items-center border-1  border-neutral-100 p-4 py-8 gap-1 shadow-md"
                    key={person?.user?.email}
                  >
                    <div className="bg-neutral-300 rounded-full w-10 h-10 flex items-center justify-center">
                      {person?.user?.name?.at(0)}
                    </div>
                    <span>{person?.user?.name}</span>
                    <SmallText className="text-xs">{person?.user?.email}</SmallText>
                  </div>
                );
              })}
              {isPeopleOverflow &&    <div
                    className="flex flex-col items-center justify-center font-light text-neutral-500  p-4 py-8 gap-1 "
                    key={"more"}
                  >{`...and ${people?.data?.length - 5} more`}</div>}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
