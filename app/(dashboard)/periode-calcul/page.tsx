import { SectionCards } from "@/components/custom/section-cards";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Eye, Edit, Delete, Trash2 } from "lucide-react";

export default function page() {
  return (
    <div>
      <div className="flex">
        <div className="flex-1">
          <p className="text-(length:--text-2xl) font-bold">Validations</p>
          {/* <p className="text-muted-foreground text-(length:--text-base)">
            Vue d'ensemble du système
          </p> */}
        </div>
        <Card className=""></Card>
      </div>
      <div className="space-y-(--space-md) mt-(--space-lg)">
        {/* <div className="grid grid-cols-4 gap-(--space-md)"> */}
        <SectionCards />
        {/* </div> */}

        <div className="grid grid-cols-3 gap-(--space-md)">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="gap-(--space-md)">
          <Card className="p-0">
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader className="bg-primary/10">
                <TableRow>
                  <TableHead className="w-25 text-accent font-bold">
                    ID
                  </TableHead>
                  <TableHead className="text-accent font-bold">
                    Username
                  </TableHead>
                  <TableHead className="text-accent font-bold">Email</TableHead>
                  <TableHead className="text-accent font-bold">Role</TableHead>
                  <TableHead className="text-accent font-bold">
                    Etat du compte
                  </TableHead>
                  <TableHead className="text-right text-accent font-bold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-table-row-hover">
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>User 1</TableCell>
                  <TableCell>user@ex.com</TableCell>
                  <TableCell>Direction des opérations</TableCell>
                  <TableCell>Actif</TableCell>
                  <TableCell className="flex items-end justify-end space-x-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-table-row-hover">
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>User 1</TableCell>
                  <TableCell>user@ex.com</TableCell>
                  <TableCell>Direction des opérations</TableCell>
                  <TableCell>Actif</TableCell>
                  <TableCell className="text-right">X</TableCell>
                </TableRow>
                <TableRow className="hover:bg-table-row-hover">
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>User 1</TableCell>
                  <TableCell>user@ex.com</TableCell>
                  <TableCell>Direction des opérations</TableCell>
                  <TableCell>Actif</TableCell>
                  <TableCell className="text-right">X</TableCell>
                </TableRow>
                <TableRow className="hover:bg-table-row-hover">
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>User 1</TableCell>
                  <TableCell>user@ex.com</TableCell>
                  <TableCell>Direction des opérations</TableCell>
                  <TableCell>Actif</TableCell>
                  <TableCell className="text-right">X</TableCell>
                </TableRow>
                <TableRow className="hover:bg-table-row-hover">
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>User 1</TableCell>
                  <TableCell>user@ex.com</TableCell>
                  <TableCell>Direction des opérations</TableCell>
                  <TableCell>Actif</TableCell>
                  <TableCell className="text-right">X</TableCell>
                </TableRow>
                <TableRow className="hover:bg-table-row-hover">
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>User 1</TableCell>
                  <TableCell>user@ex.com</TableCell>
                  <TableCell>Direction des opérations</TableCell>
                  <TableCell>Actif</TableCell>
                  <TableCell className="text-right">X</TableCell>
                </TableRow>
                <TableRow className="hover:bg-table-row-hover">
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>User 1</TableCell>
                  <TableCell>user@ex.com</TableCell>
                  <TableCell>Direction des opérations</TableCell>
                  <TableCell>Actif</TableCell>
                  <TableCell className="text-right">X</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}
