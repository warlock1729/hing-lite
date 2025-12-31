// TaskTable.tsx
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Avatar,
} from "@heroui/react";

const statusColorMap: Record<string, "default" | "primary" | "success" | "warning" | "danger"> = {
  Backlog: "danger",
  "In Review": "primary",
  Todo: "danger",
  "In Progress": "warning",
  Done: "success",
};

const tasks = [
  {
    id: 1,
    name: "Conduct usability testing",
    project: "Mobile App Development",
    assignee: "John",
    dueDate: "October 15th, 2024",
    status: "Backlog",
  },
  {
    id: 2,
    name: "Integrate push notifications",
    project: "Mobile App Development",
    assignee: "John",
    dueDate: "October 13th, 2024",
    status: "Backlog",
  },
  {
    id: 3,
    name: "Develop login screen",
    project: "Mobile App Development",
    assignee: "Antonio",
    dueDate: "October 12th, 2024",
    status: "In Review",
  },
  {
    id: 4,
    name: "Implement navigation flow",
    project: "Mobile App Development",
    assignee: "John",
    dueDate: "October 11th, 2024",
    status: "Todo",
  },
  {
    id: 5,
    name: "Design UI components",
    project: "Mobile App Development",
    assignee: "Antonio",
    dueDate: "October 10th, 2024",
    status: "In Progress",
  },
  {
    id: 6,
    name: "Create app wireframes",
    project: "Mobile App Development",
    assignee: "John",
    dueDate: "October 9th, 2024",
    status: "Done",
  },
];

export default function TaskTable() {
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
     <Table removeWrapper aria-label="Tasks">
  <TableHeader>
    <TableColumn>Task Name</TableColumn>
    <TableColumn>Project</TableColumn>
    <TableColumn>Assignee</TableColumn>
    <TableColumn>Due Date</TableColumn>
    <TableColumn>Status</TableColumn>
  </TableHeader>

  <TableBody items={tasks}>
    {(item) => (
      <TableRow key={item.id}>
        <TableCell className="font-medium">
          {item.name}
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">
              M
            </div>
            <span>{item.project}</span>
          </div>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-300 text-sm flex items-center justify-center">
              {item.assignee[0]}
            </div>
            <span>{item.assignee}</span>
          </div>
        </TableCell>

        <TableCell className="text-green-500">
          {item.dueDate}
        </TableCell>

        <TableCell>
          <Chip size="sm" variant="flat" color={statusColorMap[item.status]}>
            {item.status}
          </Chip>
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>

    </div>
  );
}
