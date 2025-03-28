import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { TaskStatus, TaskUpdate } from "@/lib/types";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createTask } from "@/api/tasksApi";
import { useState } from "react";
import { toast } from "sonner";

interface TaskFormProps {
  status: TaskStatus;
  onTaskSaved: () => void;
}

export default function AddTaskButton({ status, onTaskSaved }: TaskFormProps) {
  const [open, setOpen] = useState(false);
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      status: status,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Task name is required"),
      description: Yup.string().optional().nullable(),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: async (values) => {
      try {
        const taskData: TaskUpdate = {
          title: values.title,
          description: values.description,
          status: values.status as TaskStatus,
        };

        await createTask(taskData);
        toast.success("Task created successfully");

        formik.resetForm({
          values: {
            title: "",
            description: "",
            status: status,
          },
        });

        setOpen(false);
        onTaskSaved();
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      }
    },
  });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="cursor-pointer w-full">
            + New Task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title">Name</Label>
                <Input
                  id="title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="col-span-3"
                />
                {formik.touched.title && formik.errors.title ? (
                  <div className="text-red-500 text-xs col-start-2 col-span-3">
                    {formik.errors.title}
                  </div>
                ) : null}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="col-span-3"
                />
                {formik.touched.description && formik.errors.description ? (
                  <div className="text-red-500 text-xs col-start-2 col-span-3">
                    {formik.errors.description}
                  </div>
                ) : null}
              </div>
              {/* Status field is now displayed as non-editable */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status">Task Status</Label>
                <Input
                  id="status"
                  name="status"
                  value={formik.values.status} // Showing the current status as a read-only input
                  readOnly
                  className="col-span-3 bg-gray-100 text-gray-500 cursor-not-allowed" // Styling for read-only
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Task</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
