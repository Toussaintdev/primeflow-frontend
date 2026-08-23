"use client";

import { Button } from "@/components/ui/button";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Card,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { resetPassord } from "@/lib/api";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function page() {
  const router = useRouter();
  const [ancien_mot_de_passe, setAncien_mot_de_passe] = useState("");
  const [nouveau_mot_de_passe, setNouveau_mot_de_passe] = useState("");
  const [confirmation_mot_de_passe, setConfirmation_mot_de_passe] =
    useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCall, setIsCall] = useState(false);
  async function resetSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (nouveau_mot_de_passe !== confirmation_mot_de_passe) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    setIsCall(true);
    try {
      await resetPassord(
        ancien_mot_de_passe,
        nouveau_mot_de_passe,
        confirmation_mot_de_passe,
      );
      toast.success("Mot de passe réinitialisé avec succès", {
        position: "top-center",
      });
      router.push("/dashboard");
    } catch (error: any) {
      let message =
        "Impossible de réinitialiser le mot de passe, verifiez ce que vous avez entré";
      setError(message);
      toast.error(message, {
        position: "top-center",
      });
    } finally {
      setIsCall(false);
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* <div className="relative hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div> */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <Card className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <div className="flex flex-col gap-6">
              <div className="space-y-10">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">
                    Réinitialiser le mot de passe
                  </CardTitle>
                  <CardDescription>
                    Choisissez un nouveau mot de passe sécurisé pour votre
                    compte
                  </CardDescription>
                  {error && <p className="text-rejected">{error}</p>}
                </CardHeader>
                <CardContent>
                  <form onSubmit={resetSubmit}>
                    <FieldGroup className="gap-6">
                      <Field>
                        <div className="flex items-center">
                          <FieldLabel htmlFor="password">
                            Entrez l'ancien mot de passe
                          </FieldLabel>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          value={ancien_mot_de_passe}
                          onChange={(e) =>
                            setAncien_mot_de_passe(e.target.value)
                          }
                          required
                          className="bg-background h-10 border-draft rounded-sm"
                        />
                      </Field>
                      <Field>
                        <div className="flex items-center">
                          <FieldLabel htmlFor="password">
                            Entrez votre nouveau mot de passe
                          </FieldLabel>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          value={nouveau_mot_de_passe}
                          onChange={(e) =>
                            setNouveau_mot_de_passe(e.target.value)
                          }
                          required
                          className="bg-background h-10 border-draft rounded-sm"
                        />
                      </Field>
                      <Field>
                        <div className="flex items-center">
                          <FieldLabel htmlFor="password">
                            Confirmer le mot de passe
                          </FieldLabel>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          value={confirmation_mot_de_passe}
                          onChange={(e) =>
                            setConfirmation_mot_de_passe(e.target.value)
                          }
                          required
                          className="bg-background h-10 border-draft rounded-sm"
                        />
                      </Field>
                      <Field>
                        <Button
                          type="submit"
                          disabled={isCall}
                          className="font-bold h-14"
                        >
                          {isCall ? (
                            <>
                              <Spinner data-icon="inline-start" />{" "}
                              Réinitialisation...
                            </>
                          ) : (
                            "Réinitialiser le mot de passe"
                          )}
                        </Button>
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
          </div>
        </Card>
      </div>
    </div>
  );
}
