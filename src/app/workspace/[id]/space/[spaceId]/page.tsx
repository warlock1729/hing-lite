// "use client";
import { Heading1 } from "@/components/typography";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import React from "react";
import { IoPencilOutline, IoPersonCircleOutline } from "react-icons/io5";
import { GiPencil } from "react-icons/gi";
import TaskTable from "@/components/SpaceTasksTable";
import { getSpaceDetailsById } from "@/app/actions/spaceActions";

export default async function Space({params}:{params:Promise<{spaceId:string}>}) {
  const spaceId = Number((await params).spaceId)
  const space = await getSpaceDetailsById(spaceId)

  const cards = [
    // { title: "Total Spaces", count: 2 },
    { title: "Total Tasks", count: 14 },
    { title: "Assigned Tasks", count: 7 },
    { title: "Completed Tasks", count: 2 },
    { title: "Overdue Tasks", count: 0 },
  ];
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
                <Heading1>{item.count}</Heading1>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <hr className="border-dashed border-neutral-300 mb-6" />

      <div>
        
     <TaskTable spaceId={Number((await params).spaceId)}/>
      </div>
    </div>
  );
}
