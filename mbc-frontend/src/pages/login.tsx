import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../components/input";
import Button from "../components/button";

const schema = z.object({
  email: z
    .string({ required_error: "This field is required" })
    .email({ message: "Enter a valid email" })
    .min(1, "This field is required"),
  password: z
    .string({ required_error: "This field is required" })
    .min(1, "This field is required"),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
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
    <div className="min-h-screen w-full bg-main-gradient">
      <div className="container max-w-[520px] mx-auto my-10 px-2">
        <h1 className="mb-2 text-2xl font-semibold text-primary">Login</h1>
        <div className="w-full px-4 py-10 border-2 border-opacity-50 rounded-xl border-primary">
          <form className="mb-4 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("email")}
              type="email"
              placeholder="Enter email"
              error={errors.email && errors.email.message}
            />
            <Input
              {...register("password")}
              type="password"
              placeholder="Enter password"
              error={errors.password && errors.password.message}
            />
            <Button
              type="submit"
              variant="primary"
              className="justify-center w-full"
            >
              Login
            </Button>
          </form>
          <div className="flex flex-col items-center space-y-3">
            <p>
              Don't have an account?{" "}
              <a href="/signup">
                <span className="text-primary">Signup here</span>
              </a>
            </p>
            <Button variant="primary">
              Login with <span className="font-semibold">Google</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
