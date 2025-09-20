import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

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
import { useLoggedInEntity } from "@/contexts/LoggedInEntityContext";

const pharmacistLoginSchema = z.object({
  userId: z.string().min(1, "Pharmacy ID is required"),
  password: z.string().min(1, "Password is required"),
});

type PharmacistLoginForm = z.infer<typeof pharmacistLoginSchema>;

function PharmacistLoginPage() {
  const navigate = useNavigate();
  const { entity, setEntity } = useLoggedInEntity();

  useEffect(() => {
    if (entity?.loggedIn) {
      if (entity.role === "pharmacist") {
        navigate("/pharmacist/dashboard");
      } else if (entity.role === "doctor") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [entity, navigate]);

  const form = useForm<PharmacistLoginForm>({
    resolver: zodResolver(pharmacistLoginSchema),
    defaultValues: {
      userId: "",
      password: "",
    },
  });

  const onSubmit = async (values: PharmacistLoginForm) => {
    const { userId, password } = values;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/login/pharmacy`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userId, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      const userData = {
        id: data.pharmacy.id,
        name: data.pharmacy.name,
        role: "pharmacist",
        location: data.pharmacy.location_area,
        loggedIn: true,
      };

      // Save to localStorage
      localStorage.setItem("nirmaya-user", JSON.stringify(userData));

      // Update context
      setEntity(userData);

      // Navigate to dashboard
      navigate("/pharmacist/dashboard");
    } catch (err: any) {
      alert(err.message || "Something went wrong during login");
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
                    <FormLabel>Pharmacy ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your pharmacy ID" {...field} />
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
