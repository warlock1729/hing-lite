"use client";

import { createSpaceAction, CreateSpaceInput } from "@/app/actions/spaceActions";
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



export default function CreateSpaceModal({
  isOpen,
  onClose,
  projectId
  // onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  projectId:number
  // onSubmit: (data: CreateSpaceForm) => Promise<void> | void;
}) {

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<CreateSpaceInput>({defaultValues:{projectId:projectId}});

  const handleCreate = handleSubmit(async (data: CreateSpaceInput) => {
    await createSpaceAction(data)
    reset();
    onClose();
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent>
        <form onSubmit={handleCreate}>
          <ModalHeader>Create Space</ModalHeader>

          <ModalBody className="gap-4">
            <Input
              label="Name"
              placeholder="Enter space name"
              {...register("name", { required: "Space name is required" })}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />

            <Textarea
              label="Description"
              placeholder="Description"
              {...register("description")}
                 isInvalid={!!errors.description}
              errorMessage={errors.description?.message}
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
