import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useLoggedInEntity } from "@/contexts/LoggedInEntityContext";

const doctorLoginSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
});

type DoctorLoginForm = z.infer<typeof doctorLoginSchema>;

function DoctorLoginPage() {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const { entity, setEntity } = useLoggedInEntity();

  useEffect(() => {
    if (entity?.loggedIn) {
      if (entity.role === "doctor") {
        navigate("/doctor/dashboard");
      } else if (entity.role === "pharmacist") {
        navigate("/pharmacist/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [entity, navigate]);

  const form = useForm<DoctorLoginForm>({
    resolver: zodResolver(doctorLoginSchema),
    defaultValues: {
      userId: "",
      password: "",
    },
  });

  const onSubmit = async (values: DoctorLoginForm) => {
    const { userId, password } = values;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/login/doctor`,
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

      const doctorData = {
        id: data.doctor.id,
        name: data.doctor.name,
        role: "doctor",
        loggedIn: true,
      };

      localStorage.setItem("nirmaya-entity", JSON.stringify(doctorData));
      setEntity(doctorData);

      navigate("/doctor/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setShowDialog(true);
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
            Doctor Login
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
                Sign up as a doctor
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-center text-sm">
          <p>
            Are you a pharmacist?{" "}
            <Link to="/pharmacist/login" className="text-primary underline">
              Login as pharmacist
            </Link>
          </p>
        </div>
      </main>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invalid Credentials</DialogTitle>
            <DialogDescription>
              The user ID or password you entered is incorrect. Please try
              again.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DoctorLoginPage;
