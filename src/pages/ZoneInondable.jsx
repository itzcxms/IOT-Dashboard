import React from "react";
import CardsList from "@/components/common/CardsList.jsx";
import GraphsZoneInondable from "@/components/common/GraphsZoneInondable.jsx";

function ZoneInondable() {
  const seuilPreco = 1.18;
  const seuilDanger = 1.68;
  return (
    <>
      <div className="gap-4 flex flex-col">
        <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
          <CardsList
            type={"sonde"}
            seuilPreco={seuilPreco}
            seuilDanger={seuilDanger}
          />
        </div>

        <GraphsZoneInondable seuilDanger={seuilDanger} />
      </div>
    </>
  );
}

export default ZoneInondable;
