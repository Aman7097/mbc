import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../components/input";
import Button from "../components/button";

const schema = z
  .object({
    first_name: z
      .string({ required_error: "This field is required" })
      .min(1, "This field is required"),
    last_name: z
      .string({ required_error: "This field is required" })
      .min(1, "This field is required"),
    email: z
      .string({ required_error: "This field is required" })
      .email({ message: "Enter a valid email" })
      .min(1, "This field is required"),
    password: z
      .string({ required_error: "This field is required" })
      .min(6, "Password must be atleast 6 characters"),
    confirm_password: z
      .string({ required_error: "This field is required" })
      .min(6, "Password must be atleast 6 characters"),
  })
  .refine(
    (data) => {
      if (data.password === data.confirm_password) return true;
    },
    {
      path: ["password"],
      message: "Password doesn't match",
    }
  );

type FormData = z.infer<typeof schema>;

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="container max-w-[520px] mx-auto my-10 px-2">
      <h1 className="mb-2 text-2xl font-semibold text-primary">Signup</h1>
      <div className="w-full px-4 py-10 border-2 border-opacity-50 rounded-xl border-primary">
        <form className="mb-4 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("first_name")}
            placeholder="Enter first name"
            error={errors.first_name && errors.first_name.message}
          />
          <Input
            {...register("last_name")}
            placeholder="Enter last name"
            error={errors.last_name && errors.last_name.message}
          />
          <Input
            {...register("email")}
            placeholder="Enter email"
            error={errors.email && errors.email.message}
          />
          <Input
            {...register("password")}
            type="password"
            placeholder="Enter password"
            error={errors.password && errors.password.message}
          />
          <Input
            {...register("confirm_password")}
            type="password"
            placeholder="Enter password again"
            error={errors.confirm_password && errors.confirm_password.message}
          />
          <Button variant="primary" className="justify-center w-full">
            Login
          </Button>
        </form>
        <div className="flex flex-col items-center space-y-3">
          <p>
            Already have an account?{" "}
            <a href="/login">
              <span className="text-primary">Login here</span>
            </a>
          </p>
          <Button variant="primary">
            Signup with <span className="font-semibold">Google</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
