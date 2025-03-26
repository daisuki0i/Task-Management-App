import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Task } from "@/lib/types";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateTask, deleteTask } from "@/api/tasksApi";
import { toast } from "sonner";

interface TaskFormProps extends Task {
  onTaskSaved: () => void;
}

export default function TaskCard(props: TaskFormProps) {
  const formik = useFormik({
    initialValues: {
      title: props.title,
      description: props.description || "",
      status: props.status,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().optional().nullable(),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: async (values) => {
      console.log("Updated task:", values);
      // update logic
      try {
        await updateTask(props.id, {
          title: values.title,
          description: values.description,
          status: values.status,
        });
        toast.success("Task updated successfully");
        props.onTaskSaved();
      } catch (error) {
        toast.error("Failed to update task. Please try again.");
      }
    },
  });

  const handleDelete = async () => {
    console.log("Delete task:", props.id);
    // deletion logic
    try {
      await deleteTask(props.id);
      toast.success("Task deleted successfully");
      props.onTaskSaved();
    } catch (error) {
      toast.error("Failed to delete task. Please try again.");
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Card className="cursor-pointer w-full">
            <CardHeader>
              <CardTitle>{props.title}</CardTitle>
              <CardDescription>{props.description}</CardDescription>
            </CardHeader>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
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
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formik.values.status}
                  onValueChange={(value) =>
                    formik.setFieldValue("status", value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {formik.touched.status && formik.errors.status ? (
                  <div className="text-red-500 text-xs col-start-2 col-span-3">
                    {formik.errors.status}
                  </div>
                ) : null}
              </div>
            </div>
            <DialogFooter className="flex">
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={handleDelete}
              >
                Delete Task
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
