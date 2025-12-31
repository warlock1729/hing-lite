"use client";

import {
  Caption,
  Heading1,
  Heading2,
  Heading5,
  SmallText,
} from "@/components/typography";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button, Divider } from "@heroui/react";
import React from "react";
import { IoCalendarNumberOutline, IoCalendarOutline } from "react-icons/io5";

export default function HomePage() {
  const people = [
    { fullName: "Hardik Jain", email: "hardik.j@neosoftmail.com" },
    { fullName: "Aniket Ramteke", email: "aniket.ramteke@neosoftmail.com" },
  ];
  const projects = [
    { title: "Hubblehox" },
    { title: "Schoolerp" },
    { title: "People Strong" },
  ];

  const cards = [
    { title: "Total Projects", count: 2 },
    { title: "Total Tasks", count: 14 },
    { title: "Assigned Tasks", count: 7 },
    { title: "Completed Tasks", count: 2 },
    { title: "Overdue Tasks", count: 0 },
  ];

  const tasks = [
    {
      title: "Conduct usability testing",
      projectName: "Mobile app development",
      days: 14,
    },
    {
      title: "Implement offline mode",
      projectName: "Mobile app development",
      days: 14,
    },
    {
      title: "Integerate push notifications",
      projectName: "Mobile app development",
      days: 14,
    },
  ];
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
                <Heading1>{item.count}</Heading1>
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
            {tasks.map((task) => {
              return (
                <div key={task.title} className="bg-white p-3">
                  <Heading5 className="mb-2">{task.title}</Heading5>
                  <div className="flex gap-2">
                    <Caption className="font-normal">
                      {task.projectName}
                    </Caption>
                    <SmallText className="ml-4 flex">
                      {" "}
                      <IoCalendarOutline size={12} />
                      <span className="text-[12px] ml-1">
                        {task.days} days
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
              {projects.map((project) => {
                return (
                  <Button
                    key={project.title}
                    variant="light"
                    radius={"sm"}
                    className="flex gap-4 h-fit py-2 items-center justify-start border-1 border-neutral-300"
                  >
                    <div className="bg-green-300 px-2 py-1 aspect-square  rounded-sm font-bold ">
                      {project.title.at(0)}
                    </div>
                    <div className="text-xl">{project.title}</div>
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
          <CardBody>
            <div className="flex gap-3">
              {people.map((person) => {
                return (
                  <div className="flex flex-col items-center border-1 border-neutral-100 p-4 py-8 gap-1 shadow-md" key={person.email}>
                    <div className="bg-neutral-300 rounded-full w-10 h-10 flex items-center justify-center">{person.fullName.at(0)}</div>
                    <span>{person.fullName}</span>
                   <SmallText className="text-xs">{person.email}</SmallText>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
