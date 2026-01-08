"use client";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Divider } from "@heroui/divider";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { IoCalendarNumber, IoFlagOutline } from "react-icons/io5";
import { createOrEditTask, getTaskById } from "@/app/actions/taskActions";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditTaskFormValues,
  editTaskSchema,
} from "@/lib/schemas/editTaskSchema";
import { Controller, useForm } from "react-hook-form";
import {
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import {
  BsFillFloppy2Fill,
  BsFillFloppyFill,
  BsFloppy,
  BsFloppy2,
  BsFloppy2Fill,
} from "react-icons/bs";
import { RiFlagFill, RiHardDrive3Fill, RiHardDriveFill } from "react-icons/ri";
import { TaskPriority, TaskStatus } from "@/generated/prisma";
import { LabelText } from "@/components/typography";
import { Suspense, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { statusToLabel, TaskStatusColorMap } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { fetchUsersByName } from "@/lib/helpers/task";
import { DescriptionEditor } from "../(task_id)/components/DescriptionEditor";
import { toast } from "react-toastify";

const TaskPriorityColorMapper = {
  [TaskPriority.HIGH]: "red",
  [TaskPriority.LOW]: "yellow",
  [TaskPriority.MEDIUM]: "blue",
};

const getTaskPriorityObjectFromTaskPriority = (priority: TaskPriority) => {
  return {
    key: priority,
    label: priority.at(0) + priority.slice(1)?.toLowerCase(),
    icon: <RiFlagFill size={12} color={TaskPriorityColorMapper[priority]} />,
    color: TaskPriorityColorMapper[priority],
  };
};

const getTaskStatusObjectFromTaskStatus = (status: TaskStatus) => {
  return {
    key: status,
    label: statusToLabel(status),
    color: TaskStatusColorMap[status],
  };
};

type User = {
  id: number;
  name: string | null;
  email: string;
  image: string | null;
};

export default function EditTaskForm({
  taskId,
  task,
}: {
  taskId: number;
  task: NonNullable<
    Pick<Awaited<ReturnType<typeof getTaskById>>, "data">["data"]
  >;
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isLoading, isValid },
  } = useForm<EditTaskFormValues>({
    resolver: zodResolver(editTaskSchema),
    mode: "all",
    defaultValues: {
      title: task?.title,
      description: task?.description ?? "",
      status: task?.status,
      dueDate: task?.dueDate.toISOString().slice(0, 10),
      priority: task?.priority,
      assigneeId: task?.assignedTo.id,
    },
  });
  const router = useRouter();
  const workspaceId = 5;
  const onSubmit = handleSubmit(async (values: EditTaskFormValues) => {
    const result = await createOrEditTask({
      taskId: taskId,
      spaceId: task.spaceId!,
      data: values,
    });
    if(result.status==="success"){
      toast.success("Task edited successfully")
    router.refresh();
    }else{
      toast.error(result.error  )
    }

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
        console.log(data);
        setUsers(data);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [debouncedQuery, workspaceId]);
  console.log(errors, isValid);
  return (
    <form className=" w-full" onSubmit={onSubmit}>
      <div className="flex w-full">
        {/* LEFT MAIN CONTENT */}
        <div className="flex-1">
          {/* breadcrumb */}
          {/* <div className="text-sm text-default-500 mb-4">
          Marketing / Q3 Campaign / <span className="text-foreground">Web Updates</span>
        </div> */}

          {/* header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-xs text-default-400 mb-1">
                #Task-{task?.id}
              </div>
              <h1 className="text-2xl font-semibold">{task?.title}</h1>
            </div>

            {/* STATUS */}
            <Controller
              name="status"
              control={control}
              render={({ field }) => {
                const { label, color } = getTaskStatusObjectFromTaskStatus(
                  field.value
                );

                return (
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        size="sm"
                        variant="flat"
                        className={`bg-${color}-100 font-medium !text-${color}-100`}
                      >
                        {label}
                      </Button>
                    </DropdownTrigger>

                    <DropdownMenu
                      aria-label="Task status"
                      selectedKeys={[field.value]}
                      selectionMode="single"
                      onAction={(key) => field.onChange(key as TaskStatus)}
                    >
                      {Object.values(TaskStatus).map((status) => {
                        const { key, label, color } =
                          getTaskStatusObjectFromTaskStatus(status);

                        return (
                          <DropdownItem
                            key={key}
                            className={`text-${color}-700`}
                          >
                            {label}
                          </DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  </Dropdown>
                );
              }}
            />
          </div>

          {/* description */}
          <div className="mb-8">
            <div className="text-xs font-semibold text-default-500 mb-2">
              DESCRIPTION
            </div>
            {/* <Textarea
              isInvalid={!!errors.description?.message}
              errorMessage={errors.description?.message}
              minRows={6}
              {...register("description")}
            /> */}
            <Controller name="description" control={control}
            render={({field})=>{
              return <DescriptionEditor value={field.value} onChange={field.onChange} />
            }}
            />
              
              
          </div>

          {/* subtasks */}
          {/* <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-semibold text-default-500">
              SUBTASKS
            </div>
            <Button size="sm" variant="light">
              + Add New
            </Button>
          </div>
        </div> */}

          {/* attachments */}
          {/* <div>
          <div className="text-xs font-semibold text-default-500 mb-2">
            ATTACHMENTS
          </div>
          <div className="flex gap-4">
            <div className="w-48 h-28 rounded-lg bg-default-200 flex items-end p-2 text-xs">
              hero-v2.png
            </div>
            <div className="w-48 h-28 border-2 border-dashed rounded-lg flex items-center justify-center text-default-400 text-sm">
              Drop files here
            </div>
          </div>
        </div> */}
        </div>
        <div className="">
          <Divider
            id="xx"
            orientation="vertical"
            className="min-h-full ml-4 "
          />
        </div>
        {/* RIGHT SIDEBAR */}
        <div className="w-[320px]  bg-slate-200    px-6 py-6 space-y-6">
          {/* timestamps */}
          <div className="flex justify-between text-sm">
            <div>
              <div className="text-default-400">Created</div>
              <div>{task?.createdAt.toLocaleString().slice(0,17)}</div>
            </div>
            <div>
              <div className="text-default-400">Updated</div>
              <div>{task?.updatedAt.toLocaleString().slice(0,17)}</div>
            </div>
          </div>

          <Divider />

          {/* assignee */}
          <div>
            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => {
                const isAssigned = !!field.value;
                const selectedUser: User | null = isAssigned
                  ? users.find((u) => u.id === Number(field.value)) ??
                    (task?.assignedTo as User)
                  : null;
                if (selectedUser) {
                  return (
                    <div className="w-full  flex flex-col">
                      <LabelText className="text-xs font-semibold text-default-500 mb-2">
                        Assignee
                      </LabelText>
                      <Chip
                        className="w-full h-fit p-2"
                        onClose={() => {
                          field.onChange(null);
                          setSearch("");
                        }}
                        variant="flat"
                        avatar={
                          <Avatar
                            className="p-2"
                            src={selectedUser.image ?? undefined}
                            name={selectedUser.name ?? ""}
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
                    isInvalid={!!errors.assigneeId}
                    onInputChange={setSearch}
                    onSelectionChange={(key) => {
                      field.onChange(key ? Number(key) : undefined);
                    }}
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
          </div>

          {/* due date */}
          <div>
            <div className="text-xs font-semibold text-default-500 mb-2">
              DUE DATE
            </div>
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => {
                console.log(field.value, typeof field.value);
                return (
                  <Input
                    radius="sm"
                    startContent={<IoCalendarNumber size={16} />}
                    type="date"
                    value={field.value}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      console.log(e.target.value, typeof e.target.value);

                      field.onChange(e.target.value);
                    }}
                  />
                );
              }}
            />
          </div>

          {/* priority */}
          <div>
            <div className="text-xs font-semibold text-default-500 mb-2">
              PRIORITY
            </div>
            {/* <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  selectedKeys={[field.value]}
                  onSelectionChange={(k) => {
                    field.onChange([...k][0]);
                  }}
                >
                  {Object.keys(TaskPriority).map((p) => {
                    const { icon, key, label, color } =
                      getTaskPriorityObjectFromTaskPriority(p as TaskPriority);
                    return (
                      <SelectItem
                        startContent={icon}
                        style={{ color: color }}
                        key={key}
                      >
                        {label}
                      </SelectItem>
                    );
                  })}
                </Select>
              )}
            /> */}
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  style={{ background: "white" }}
                  radius="sm"
                  selectedKeys={[field.value]}
                  onSelectionChange={(k) => {
                    field.onChange([...k][0]);
                  }}
                  renderValue={(items) =>
                    items.map((item) => {
                      const { icon, label, color } =
                        getTaskPriorityObjectFromTaskPriority(
                          item.key as TaskPriority
                        );

                      return (
                        <div
                          key={item.key}
                          className="flex items-center gap-2 "
                          style={{ color }}
                        >
                          {icon}
                          <span>{label}</span>
                        </div>
                      );
                    })
                  }
                >
                  {Object.values(TaskPriority).map((p) => {
                    const { icon, key, label, color } =
                      getTaskPriorityObjectFromTaskPriority(p);

                    return (
                      <SelectItem
                        key={key}
                        startContent={icon}
                        className="flex items-center gap-2"
                        style={{ color }}
                      >
                        {label}
                      </SelectItem>
                    );
                  })}
                </Select>
              )}
            />
          </div>

          {/* tags */}
          {/* <div>
          <div className="text-xs font-semibold text-default-500 mb-2">
            TAGS
          </div>
          <div className="flex gap-2 flex-wrap">
            <Chip color="secondary" variant="flat">Marketing</Chip>
            <Chip color="secondary" variant="flat">Website</Chip>
            <Button size="sm" variant="light">+ Add Tag</Button>
          </div>
        </div> */}
        </div>
      </div>
      <Divider orientation="horizontal" className="w-full" />

      {/* cancel and submit buttons */}
      <div className="flex items-center justify-end p-3 gap-2">
        <Button variant="ghost" className="border-0">
          Cancel
        </Button>
        <Button
          type="submit"
          color="secondary"
          isDisabled={!isValid}
          isLoading={isLoading || isSubmitting}
        >
          <BsFloppy2Fill /> <span>Submit</span>
        </Button>
      </div>
    </form>
  );
}
