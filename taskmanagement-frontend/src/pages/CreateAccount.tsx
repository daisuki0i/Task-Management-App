import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { postRegister } from "@/api/usersApi";

export default function CreateAccount() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required("Email is required"),
      password: Yup.string().required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: async (values) => {
      try {
        const data = await postRegister(values);

        if (data) {
          toast.success("Account created successfully");
          navigate("/login");
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
            <CardTitle>Create Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="email"
                    name="email"
                    placeholder="Your email address"
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
                    placeholder="Create a password"
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
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword ? (
                    <div className="text-red-500 text-xs mt-1">
                      {formik.errors.confirmPassword}
                    </div>
                  ) : null}
                </div>
              </div>
              <CardFooter className="flex flex-col justify-center px-0 mt-4">
                <Button type="submit" className="mb-2">
                  Create Account
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
