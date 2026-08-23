"use client";

import { LoginForm } from "@/components/login-form";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-svh grid lg:grid-cols-2 bg-background">
      <section className="hidden lg:flex relative overflow-hidden bg-header text-white p-12 items-end">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.18),transparent_35%)]" />
        <div className="relative max-w-xl">
          <div className="text-5xl font-bold tracking-tight">LCT</div>
          <p className="mt-2 text-orange-300 font-semibold">
            Lomé Container Terminal
          </p>
          <h2 className="mt-12 text-4xl font-bold leading-tight">
            Performance d'aujourd'hui,
            <br />
            reconnaissance de demain.
          </h2>
          <p className="mt-5 max-w-md text-white/75">
            Système de gestion des primes de productivité des opérateurs.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center p-6 md:p-10">
        <Card className="w-full max-w-md p-8 md:p-10">
          <LoginForm />
        </Card>
      </section>
    </div>
  );
}
