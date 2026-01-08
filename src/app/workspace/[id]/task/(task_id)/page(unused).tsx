import { Chip } from "@heroui/chip";
import { DescriptionEditor } from "./components/DescriptionEditor";
import { Avatar, AvatarIcon } from "@heroui/avatar";

export default async function TaskPage({ params }) {
  const { task_id } = await params;
  const selectedKeys = "text";
  const selectedValue = "Text";
  const setSelectedKeys = () => {};
  return (
    <div className="grid grid-cols-12">
      <div className="main-container col-span-8">
        <div className="flex justify-between items-center">
          <small className="text-gray-400">#Task: {task_id}</small>
          <Chip color="primary">Primary</Chip>
        </div>
        <div className="mt-6">
          <h1 className="text-3xl font-bold text-gray-800 ">Task Title</h1>

          <div className="mt-3">
            <small className="text-[12px] text-gray-400 font-bold">
              DESCRIPTION
            </small>
            <DescriptionEditor description="hello bro" />
          </div>
          <div className="mt-5">
            <small className="text-[12px] text-gray-400 font-bold ">
              ATTACHMENTS
            </small>
            <div className="w-full bg-gray-100 p-2 rounded-md mt-2 whitespace-nowrap overflow-x-scroll">
              {[1, 2, 3].map((attachment) => (
                <img
                  key={attachment}
                  className="w-62.5 rounded-sm inline-block mr-3 last-of-type:mr-0"
                  src={
                    "https://i0.wp.com/d365demystified.com/wp-content/uploads/2023/03/error.png?fit=2354%2C1317&ssl=1"
                  }
                  alt=""
                />
              ))}
            </div>
          </div>
          <div className="mt-5">
            <small className="text-[12px] font-light text-gray-500">
              {"Last Modified Just now"}
            </small>
          </div>
        </div>
      </div>

      <div className="side-container col-span-4 border-l-1 border-gray-300 h-full ml-6 -mt-6 p-4">
        <div className="mt-3">
          <small className="text-[12px] text-gray-400 font-bold">
            ASSIGNEE
          </small>
          <div className="flex justify-start items-center gap-2 mt-2">
            <Avatar
              classNames={{
                base: "bg-linear-to-br from-[#FFB457] to-[#FF705B]",
                icon: "text-black/80",
              }}
              icon={<p className="text-xl">{String("Hardik")[0]}</p>}
            />
            <h3>Hardik</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
