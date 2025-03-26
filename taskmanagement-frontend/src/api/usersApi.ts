import { Credentials, User, LoginResponse } from "@/lib/types";
import { AxiosResponse } from "axios";
import axiosInstance from "./axios";

export const postRegister = async (data: Credentials) => {
  try {
    const response: AxiosResponse<User> = await axiosInstance.post("/users/register", data);
    const responseData = response.data;

    if (responseData) {
      return responseData;
    }
  } catch (error) {
    throw new Error("An error occurred. Please try again.");
  }
}

export const postLogin = async (data: Credentials) => {
  try {
    const response: AxiosResponse<LoginResponse> = await axiosInstance.post("/users/login", data);
    const responseData = response.data;

    if (responseData) {
      return responseData;
    }
  } catch (error) {
    throw new Error("An error occurred. Please try again.");
  }
}