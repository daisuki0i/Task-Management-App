import { Task, TaskStatus } from "@/lib/types";
import AddTaskButton from "@/components/add-task-button";
import TaskCard from "@/components/task-card";

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  bgColor: string;
  dotColor: string;
  onTaskSaved: () => void;
}

export default function TaskColumn({
  title,
  status,
  tasks,
  bgColor,
  dotColor,
  onTaskSaved,
}: TaskColumnProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`flex items-center justify-center gap-2 ${bgColor} py-2 px-5 rounded-full`}
      >
        <div className={`rounded-full w-4 h-4 ${dotColor}`}></div>
        <h1 className="font-bold">{title}</h1>
      </div>
      <AddTaskButton
        status={status}
        onTaskSaved={onTaskSaved}
      />
      {tasks.map((task) => (
        <TaskCard key={task.id} onTaskSaved={onTaskSaved}  {...task} />
      ))}
    </div>
  );
}
