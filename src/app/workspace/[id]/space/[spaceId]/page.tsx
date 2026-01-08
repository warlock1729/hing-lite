// "use client";
import { Heading1 } from "@/components/typography";
import { Card, CardBody, CardHeader } from "@heroui/card";

import TaskTable from "@/components/SpaceTasksTable";
import { getSpaceDetailsById } from "@/app/actions/spaceActions";
import { getAnalyticsStats } from "@/hooks/useAnalytics";
import { mapAnalyticsCards } from "@/lib/utils";
import { IoAlertCircleOutline, IoBriefcaseOutline, IoCheckboxOutline, IoListOutline, IoPersonOutline } from "react-icons/io5";
import { AnalyticsCard } from "@/types";
import CreateTaskForm from "@/components/CreateTaskForm";

const ANALYTICS_CARDS: Omit<AnalyticsCard, "value">[] = [

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

export default async function Space({params}:{params:Promise<{spaceId:string,id:string}>}) {
  const spaceId = Number((await params).spaceId)
  const workspaceId = Number((await params).id)
  const space = await getSpaceDetailsById(spaceId)

const data = await getAnalyticsStats({
    type: "space",
    spaceId:spaceId
  });
  const cards = data ? mapAnalyticsCards(ANALYTICS_CARDS,data) : [];
  const projectName = space?.project.name;
  const spaceName = space?.name

  return (
    <div className="relative">
      <div className="flex mr-8 gap-2 font-medium justify-between">
        {" "}
        <div className="flex items-center gap-2 font-medium">
          <div className="bg-blue-600 min-w-fit h-8 w-8 grid place-items-center rounded-md text-white font-medium">
            {projectName?.at(0)}
          </div>
          <span>{projectName}</span><span className="font-light">{" > "}{spaceName}</span>
        </div>
        {/* <div>
          <Button size="md" variant="light" className="shadow font-bold ">
            {" "}
            <GiPencil size={15} /> <span>Edit Space</span>
          </Button>
        </div> */}
      </div>

      <div className="flex w-full gap-2 my-8">
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

      <hr className="border-dashed border-neutral-300 mb-6" />

      <div>
        
              <CreateTaskForm />
     <TaskTable key={new Date().toUTCString()} spaceId={Number((await params).spaceId)} workspaceId={workspaceId}/>
      </div>
    </div>
  );
}
