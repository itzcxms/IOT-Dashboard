import React from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserTableRow, EmptyState } from "./UserComponents";

export const UsersTable = ({ users, onEdit, onDelete, getRoleColor }) => {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Rôle & Statut</TableHead>
            <TableHead className="hidden md:table-cell">Création</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <EmptyState />
          ) : (
            users.map((user) => (
              <UserTableRow
                key={user._id}
                user={user}
                onEdit={onEdit}
                onDelete={onDelete}
                getRoleColor={getRoleColor}
              />
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
