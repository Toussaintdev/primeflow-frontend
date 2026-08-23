"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getJournalAudit } from "@/lib/api";
import { toast } from "sonner";

export default function JournalAuditPage() {
  const [rows, setRows] = useState<any[]>([]),
    [q, setQ] = useState("");
  useEffect(() => {
    getJournalAudit()
      .then((r) => setRows(r as any[]))
      .catch((e: any) => toast.error(e.message));
  }, []);
  const filtered = rows.filter((r) =>
    JSON.stringify(r).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Journal d'audit</h1>
        <p className="text-muted-foreground">
          Traçabilité des principales actions effectuées dans l'application.
        </p>
      </div>
      <Card className="rounded-sm">
        <CardHeader>
          <div className="flex items-center gap-4">
            <CardTitle className="flex-1">Historique</CardTitle>
            <Input
              className="max-w-sm"
              placeholder="Rechercher..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary/10">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Utilisateur</th>
                  <th className="p-3 text-left">Action</th>
                  <th className="p-3 text-left">Objet</th>
                  <th className="p-3 text-left">Résultat</th>
                  <th className="p-3 text-left">Adresse IP</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.idJournal} className="border-b">
                    <td className="p-3">
                      {r.dateJournal
                        ? new Date(r.dateJournal).toLocaleString("fr-FR")
                        : "—"}
                    </td>
                    <td className="p-3">{r.utilisateur}</td>
                    <td className="p-3">{r.action}</td>
                    <td className="p-3">{r.object}</td>
                    <td className="p-3">{r.resultat}</td>
                    <td className="p-3">{r.adresseIP}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
