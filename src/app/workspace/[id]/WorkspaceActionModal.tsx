"use client";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import React, { useEffect, useState } from "react";
import { Input, Textarea } from "@heroui/input";
import { Heading3, SmallText } from "@/components/typography";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, formSchema } from "@/lib/schemas/createWorkspaceSchema";
import {
  createWorkspace,
  updateWorkspace,
} from "@/app/actions/workspaceActions";
import { z } from "zod";

type WorkspaceProps = {
  id: number;
  name: string;
  description: string;
  people: number;
  isVisible: boolean;
  setIsVisible: any;
  mode: "Edit" | "Create";
};

export default function CreateWorkspaceModal(workspaceData: WorkspaceProps) {
  const isEdit = workspaceData.mode === "Edit";
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isLoading },
    reset,
    setError,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: isEdit
      ? {
          mode: "Edit",
          workspaceId: workspaceData.id,
          description: workspaceData.description,
          name: workspaceData.name,
          people: workspaceData.people,
        }
      : { mode: "Create", description: "", name: "", people: 1 },
  });

  const handleCreateWorkspace = handleSubmit(async (data: FormSchema) => {
    console.log(data);

    let result;
    if (data.mode === "Create") {
      result = await createWorkspace(data);
    } else if (workspaceData.mode === "Edit") {
      result = await updateWorkspace(data);
    }
    console.log(result);
  });

  useEffect(() => {
    reset(
      isEdit
        ? {
            mode: "Edit",
            workspaceId: workspaceData.id,
            description: workspaceData.description,
            name: workspaceData.name,
            people: workspaceData.people,
          }
        : { mode: "Create", description: "", name: "", people: 1 }
    );
  }, [workspaceData.mode, isEdit]);

  return (
    <>
      {/* Modal */}
      <Modal
        isOpen={workspaceData.isVisible}
        onClose={() => workspaceData.setIsVisible(false)}
      >
        <ModalContent className="p-2 my-2 px-2">
          <ModalHeader className="flex flex-col ">
            <Heading3>Lets build your Workspace</Heading3>
            <SmallText className="mt-2">
              A workspace represents your organization.
            </SmallText>
          </ModalHeader>
          <form onSubmit={handleCreateWorkspace}>
            <ModalBody>
              {isEdit && (
                <div>
                  {/* Workspace Id */}
                  <label htmlFor="workspace-name">Workspace ID</label>
                  <Input
                    {...register("workspaceId")}
                    placeholder="WorkspaceId"
                    readOnly
                  />
                </div>
              )}

              <div>
                {/* Workspace Name */}
                <label htmlFor="workspace-name">Workspace Name</label>
                <Input
                  id="workspace-name"
                  {...register("name")}
                  placeholder="e.g., Acme Corp's Workspace"
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                />
              </div>

              <div style={{ marginTop: "10px" }}>
                {/* Description */}
                <label htmlFor="description">
                  Description <small>(Optional)</small>
                </label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Briefly describe what this workspace is for..."
                  errorMessage={errors.description?.message}
                  isInvalid={!!errors.description}

                />
              </div>

              <div style={{ marginTop: "10px" }}>
                {/* People Count */}
                <label htmlFor="people-count">How many people?</label>
                <Input
                  id="people-count"
                  {...register("people")}
                  placeholder="e.g., 5"
                  type="number"
                  isInvalid={!!errors.people}
                  errorMessage={errors.people?.message}
                />
              </div>
            </ModalBody>

            {/* Modal Footer with Action Buttons */}
            <ModalFooter>
              <Button
                onPress={() => workspaceData.setIsVisible(false)}
                variant="ghost"
              >
                Cancel
              </Button>
              <Button type="submit" className="">
                {workspaceData.mode} Workspace
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
