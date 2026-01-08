"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  AutocompleteItem,
  Autocomplete,
  Chip,
  Avatar,
  Textarea,
} from "@heroui/react";
import {Button} from "@heroui/button"
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { LabelText } from "./typography";
import { fetchUsersByName } from "@/lib/helpers/task";
import { createOrEditTask } from "@/app/actions/taskActions";
import { EditTaskFormValues, editTaskSchema } from "@/lib/schemas/editTaskSchema";
import { TaskPriority, TaskStatus } from "@/generated/prisma";
import { toast } from "react-toastify";

type User = {
  id: number;
  name: string | null;
  email: string;
  image: string | null;
};


export default function CreateTaskModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { id: workspaceId,spaceId } = useParams<{ id: string,spaceId:string }>();

  const { control, handleSubmit, reset, formState:{isValid,isLoading,isSubmitting,errors},register } = useForm<EditTaskFormValues>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      title: "",
      dueDate:(new Date()).toISOString(),
      priority: undefined,
      status:TaskStatus.TODO
    },
  });

  const [search, setSearch] = useState("");
  const debouncedQuery = useDebounce(search);
  const [users, setUsers] = useState<User[]>([]);

  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 1) {
      setUsers([]);
      return;
    }
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const data = await fetchUsersByName(
          debouncedQuery,
          Number(workspaceId)
        );
        setUsers(data);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [debouncedQuery, workspaceId]);
  console.log(errors)
  
  const onSubmit = async (data:EditTaskFormValues) => {
    const result  = await createOrEditTask({spaceId:Number(spaceId),data:data})
    if(result.status==="success"){
      toast.success("Task created")
    reset();
    setSearch("")
    onClose();
    }
    else{
      toast.error("Task created")

    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Create a new task</ModalHeader>

          <ModalBody className="gap-4">
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Task Name"
                  placeholder="Enter task name"
                  errorMessage={fieldState.error?.message}
                  isInvalid={!!fieldState.error}
                />
              )}
            />

              <Textarea
              label="Description"
              placeholder="Description"
              {...register("description")}
                 isInvalid={!!errors.description}
              errorMessage={errors.description?.message}
            />
            

            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <Input {...field} type="date" min={new Date().getTime()} label="Due Date" />
              )}
            />

            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => {
                const selectedUser = users.find(
                  (u) => u.id === Number(field.value)
                );

                if (selectedUser) {
                  return (
                    <div className="w-full  flex flex-col">
                      <LabelText className="text-neutral-500">
                        Assignee
                      </LabelText>
                      <Chip
                        className="w-full h-fit p-2"
                        onClose={() => {
                          field.onChange(null);
                          setSearch("");
                        }}
                        variant="flat"
                        startContent={
                          <Avatar
                            src={selectedUser.image ?? undefined}
                            name={selectedUser.name ?? ""}
                            size="sm"
                          />
                        }
                      >
                        {selectedUser.name}
                      </Chip>
                    </div>
                  );
                }

                return (
                  <Autocomplete
                    label="Assignee"
                    placeholder="Search user"
                    isLoading={loadingUsers}
                    inputValue={search}
                    onInputChange={setSearch}
                    onSelectionChange={(key) =>{
                      // alert(key)
                      field.onChange(key ? Number(key) : null)
                    }
                    }
                  >
                    {users.map((user) => (
                      <AutocompleteItem
                        key={user.id}
                        startContent={
                          <Avatar
                            src={user.image ?? undefined}
                            name={user.name ?? ""}
                            size="sm"
                          />
                        }
                      >
                        {user.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                );
              }}
            />

            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Priority"
                  selectedKeys={[field.value]}
                  onSelectionChange={(keys) => field.onChange([...keys][0])}
                >
                  <SelectItem key={TaskPriority.HIGH}>High</SelectItem>
                  <SelectItem key={TaskPriority.MEDIUM}>Medium</SelectItem>
                  <SelectItem key={TaskPriority.LOW}>Low</SelectItem>
                </Select>
              )}
            />
          </ModalBody>

          <ModalFooter className="justify-between">
            <Button variant="light" onPress={()=>{reset();onClose()}}>
              Cancel
            </Button>
            <Button   isLoading={isLoading || isSubmitting} color="secondary" type="submit">
              Create Task
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
