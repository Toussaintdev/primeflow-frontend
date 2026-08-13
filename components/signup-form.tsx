"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { register } from "@/lib/api";

export function SignupForm({
  className,
  isCall,
  setCreating,
  roles,
  ...props
}: {
  isCall: boolean;
  setCreating: React.Dispatch<React.SetStateAction<boolean>>;
  roles: RoleType[];
} & React.ComponentProps<"div">) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isCallRegister, setIsCallRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const registerSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsCallRegister(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      const data = await register(username, email, selectedRole);
      // alert(data);
      setError(null);
      toast.success("Succès de création du compte.", {
        position: "top-center",
      });
      setCreating(true);
      setUsername("");
      setEmail("");
      setSelectedRole("");
      // window.location.href = "/utilisateur/";
    } catch {
      toast.error("Erreur lors de la création du compte.", {
        position: "top-center",
        // action: {
        //   label: "X",
        //   onClick: () => console.log("Undo"),
        // },
      });
      setError("Erreur lors de la création du compte. Réessayer");
    } finally {
      setIsCallRegister(false);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Créer un compte</CardTitle>
          <CardDescription>
            {/* Enter your email below to create your account */}
          </CardDescription>
          {error && <p className="text-rejected">{error}</p>}
        </CardHeader>
        <CardContent>
          <form onSubmit={registerSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nom d'utilisateur</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-background h-10 border-draft rounded-sm"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background h-10 border-draft rounded-sm"
                  required
                />
              </Field>
              <Field>
                <Field className="gap-4">
                  <FieldLabel htmlFor="role">Rôle</FieldLabel>
                  <Select
                    value={selectedRole}
                    onValueChange={setSelectedRole}
                    required
                  >
                    <SelectTrigger className="w-45">
                      <SelectValue placeholder="Attribuez un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {roles.map((item) => (
                          <SelectItem key={item.code} value={item.code}>
                            {item.libelle}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </Field>
              <Field>
                <Button
                  type="submit"
                  disabled={isCallRegister}
                  className="font-bold h-10"
                >
                  {isCallRegister ? (
                    <>
                      <Spinner data-icon="inline-start" />
                      Création du compte...
                    </>
                  ) : (
                    "Créer le compte"
                  )}
                </Button>
                {/* <FieldDescription className="text-center">
                  Already have an account? <a href="#">Sign in</a>
                </FieldDescription> */}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </div>
      <FieldDescription className="px-6 text-center">
        {/* By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>. */}
      </FieldDescription>
    </div>
  );
}
