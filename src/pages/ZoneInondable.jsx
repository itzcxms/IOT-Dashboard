import React from "react";
import CardsList from "@/components/common/CardsList.jsx";
import GraphsZoneInondable from "@/components/common/GraphsZoneInondable.jsx";

function ZoneInondable() {
  return (
    <>
      <div className="gap-4 flex flex-col">
        <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
          <CardsList type={"sonde"} />
        </div>

        <GraphsZoneInondable />
      </div>
    </>
  );
}

export default ZoneInondable;
