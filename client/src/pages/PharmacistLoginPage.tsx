import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/themes/mode-toggle";
import { HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";

const pharmacistLoginSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
});

type PharmacistLoginForm = z.infer<typeof pharmacistLoginSchema>;

function PharmacistLoginPage() {
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();

  useEffect(() => {
    if (user.loggedIn) {
      if (user.role === "pharmacist") {
        navigate("/pharmacist/dashboard");
      } else if (user.role === "doctor") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const form = useForm<PharmacistLoginForm>({
    resolver: zodResolver(pharmacistLoginSchema),
    defaultValues: {
      userId: "",
      password: "",
    },
  });

  const onSubmit = (values: PharmacistLoginForm) => {
    const { userId, password } = values;

    if (userId === "7301122" && password === "7301122") {
      setUser({
        loggedIn: true,
        name: "Suman Yadav",
        email: "pharma.suman@nirmaya.in",
        role: "pharmacist",
      });
      navigate("/pharmacist/dashboard");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex w-full justify-between px-8 py-4">
        <Link to="/" className="flex items-center gap-4">
          <p className="font-bold border-4 text-xl rounded border-primary text-primary h-10 w-10 flex justify-center items-center">
            <HeartPulse />
          </p>
          <p className="font-bold text-primary">Nirmaya</p>
        </Link>
        <ModeToggle />
      </header>

      <main className="flex flex-col flex-1 mb-12 items-center justify-center px-4">
        <div className="w-full max-w-lg mb-4 border border-muted rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-center text-primary">
            Pharmacist Login
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your user ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </Form>

          <div className="mt-6 flex flex-col gap-2 text-center text-sm">
            <p>
              Don't have an account?{" "}
              <Link to="#" className="text-primary underline">
                Sign up as a pharmacist
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-center text-sm">
          <p>
            Are you a doctor?{" "}
            <Link to="/doctor/login" className="text-primary underline">
              Login as doctor
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default PharmacistLoginPage;
