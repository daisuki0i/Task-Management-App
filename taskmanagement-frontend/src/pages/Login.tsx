import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import * as Yup from "yup";
import { postLogin } from "@/api/usersApi";

export default function Login() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const data = await postLogin(values);

        if (data) {
          localStorage.setItem("token", data.access_token);
          toast.success("Login successfully");
          navigate("/");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      }
    },
  });

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <Card className="w-[350px]">
          <CardHeader className="flex items-center justify-center">
            <CardTitle>Log in to Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500 text-xs mt-1">
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-red-500 text-xs mt-1">
                      {formik.errors.password}
                    </div>
                  ) : null}
                </div>
              </div>
              <CardFooter className="flex flex-col justify-center items-center px-0 mt-4">
                <Button type="submit" className="mb-2">
                  Login
                </Button>
                <CardDescription>Don't have an account?</CardDescription>
                <a
                  className="text-sm font-bold ml-1 hover:underline cursor-pointer"
                  href="/create-account"
                >
                  Create Account Here
                </a>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
