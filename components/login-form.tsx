"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { login } from "@/lib/api";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [idUtilisateur, setIdUtilisateur] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCall, setIsCall] = useState(false);

  async function loginSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsCall(true);

    try {
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      const data = await login(idUtilisateur, password);
      if (data.must_change_password) {
        window.location.href = "/renitialise-password/";
        return;
      }
      window.location.href = "/dashboard/";
    } catch (error: any) {
      const message = "Identifiant ou mot de passe incorrect.";
      setError(message);

      toast.error(message, {
        position: "top-center",
        // action: {
        //   label: "X",
        //   onClick: () => console.log("Undo"),
        // },
      });
    } finally {
      setIsCall(false);
    }
  }
  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={loginSubmit}
    >
      <FieldGroup className="gap-10">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Connectez vous à votre espace
          </p>
          {/* {error && <p className="text-rejected">{error}</p>} */}
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>
        <Field>
          <FieldLabel htmlFor="idUtilisateur">Entrez votre ID</FieldLabel>
          <Input
            id="idUtilisateur"
            type="text"
            placeholder="XX-0000"
            value={idUtilisateur}
            onChange={(e) => setIdUtilisateur(e.target.value)}
            required
            className="bg-background h-10 border-draft rounded-sm"
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">
              Entrez votre mot de passe
            </FieldLabel>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-background h-10 border-draft rounded-sm"
          />
        </Field>
        <Field>
          <Button type="submit" disabled={isCall} className="font-bold h-14">
            {isCall ? (
              <>
                <Spinner data-icon="inline-start" /> Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
