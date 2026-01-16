import React from "react";
import Permissions from "@/components/common/Permissions.jsx";
import PageTitle from "@/components/common/PageTitle.jsx";

function GestionPermissions() {
  return (
    <div>
      <PageTitle>Gestion des permissions</PageTitle>
      <Permissions />
    </div>
  );
}

export default GestionPermissions;
