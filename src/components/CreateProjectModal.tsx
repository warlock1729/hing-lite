"use client";

import { createProjectAction, CreateProjectInput } from "@/app/actions/projectActions";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@heroui/react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";



export default function CreateProjectModal({
  isOpen,
  onClose,
  // onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  // onSubmit: (data: CreateProjectForm) => Promise<void> | void;
}) {
  const params  = useParams()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<CreateProjectInput>({defaultValues:{workspaceId:Number(params.id!)}});

  const handleCreate = handleSubmit(async (data: CreateProjectInput) => {
    await createProjectAction(data)
    reset();
    onClose();
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent>
        <form onSubmit={handleCreate}>
          <ModalHeader>Create Project</ModalHeader>

          <ModalBody className="gap-4">
            <Input
              label="Project name"
              placeholder="Enter project name"
              {...register("name", { required: "Project name is required" })}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />

            <Textarea
              label="Description"
              placeholder="Optional description"
              {...register("description")}
            />
          </ModalBody>

          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={isSubmitting}
            >
              Create
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
