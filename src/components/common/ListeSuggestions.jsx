import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx";
import { useAuth } from "@/context/useAuth.jsx";
import generateCallsAPI from "@/functions/GestionnaireCallsAPI.jsx";

function ListeSuggestions({ isLoadingGeneral }) {
  const { token } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchSuggestions() {
      await setIsLoading(true);
      const response = await generateCallsAPI(
        token,
        "GET",
        "/api/questionnaires/comments",
      );
      setSuggestions(response["data"]);
      setTotal(response["total"]);
      setIsLoading(false);
    }

    void fetchSuggestions();
  }, []);

  return (
    <Card>
      <CardContent className="gap-4 flex flex-col">
        <div className="flex-col flex gap-2">
          <span className="text-base font-semibold">
            Remarques et suggestions
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            Avez-vous des remarques ou suggestions sur votre expérience le long
            de "La Loire à Vélo" ?
          </span>
        </div>

        {isLoading || isLoadingGeneral ? (
          <div className="rounded-md border">Chargement en cours...</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">N°</TableHead>
                  <TableHead className="w-30">Date</TableHead>
                  <TableHead>Commentaire</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion, key) => {
                    let date = new Date(Date.parse(suggestion.createdAt));
                    date = date.toLocaleString("fr");
                    return (
                      <TableRow key={suggestions.length - key}>
                        <TableCell className="font-medium">
                          {suggestions.length - key}
                        </TableCell>
                        <TableCell>{date.split(" ")[0]}</TableCell>
                        <TableCell>{suggestion.remarques}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Aucune remarque pour le moment.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex justify-center">
          <span className="text-sm font-medium">
            Total : {total} remarque
            {total > 1 ? "s" : ""}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default ListeSuggestions;
