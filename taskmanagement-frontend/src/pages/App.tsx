import LogoutIcon from "@mui/icons-material/Logout";
import TaskColumn from "@/components/task-column";
import { Task, TaskStatus } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getTasks } from "@/api/tasksApi";

interface ColumnConfig {
  title: string;
  status: TaskStatus;
  bgColor: string;
  dotColor: string;
}

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();

      if (data) {
        setTasks(data);
      }
    } catch (error) {
      toast.error("An error occurred while fetching tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const columnConfigs: ColumnConfig[] = [
    {
      title: "Pending",
      status: "pending",
      bgColor: "bg-[#E5E4E1]",
      dotColor: "bg-[#878583]",
    },
    {
      title: "In Progress",
      status: "in_progress",
      bgColor: "bg-[#F8E6BA]",
      dotColor: "bg-[#CA9132]",
    },
    {
      title: "Completed",
      status: "completed",
      bgColor: "bg-[#DCEBDD]",
      dotColor: "bg-[#5F9772]",
    },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <>
      <div className="flex items-center justify-end p-3">
        <a
          href="/get-started"
          className="flex items-center hover:underline cursor-pointer"
        >
          <LogoutIcon className="mr-1" />
          Logout
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 p-8 gap-4 w-full">
        {columnConfigs.map((config) => (
          <TaskColumn
            key={config.status}
            title={config.title}
            status={config.status}
            tasks={getTasksByStatus(config.status)}
            bgColor={config.bgColor}
            dotColor={config.dotColor}
            onTaskSaved={fetchTasks}
          />
        ))}
      </div>
    </>
  );
}
