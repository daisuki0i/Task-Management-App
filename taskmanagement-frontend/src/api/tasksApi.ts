import { Task, TaskUpdate } from "@/lib/types";
import { AxiosResponse } from "axios";
import axiosInstance from "./axios";

export const getTasks = async () => {
  try {
    const response: AxiosResponse<Task[]> = await axiosInstance.get("/tasks", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const responseData = response.data;

    if (responseData) {
      return responseData;
    }
  } catch (error) {
    throw new Error("An error occurred while fetching tasks");
  }
};

export const updateTask = async (id: string, data: TaskUpdate) => {
  try {
    const response: AxiosResponse<Task> = await axiosInstance.patch(
      `/tasks/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const responseData = response.data;

    if (responseData) {
      return responseData;
    }
  } catch (error) {
    throw new Error("An error occurred while updating the task");
  }
};

export const createTask = async (data: TaskUpdate) => {
  try {
    const response: AxiosResponse<Task> = await axiosInstance.post(
      "/tasks",
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const responseData = response.data;

    if (responseData) {
      return responseData;
    }
  } catch (error) {
    throw new Error("An error occurred while creating the task");
  }
};

export const deleteTask = async (id: string) => {
  try {
    await axiosInstance.delete(`/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return true; // Return success status
  } catch (error) {
    throw new Error("An error occurred while deleting the task");
  }
};
