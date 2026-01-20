import CardsList from "@/components/common/CardsList.jsx";
import GraphsGestion from "@/components/common/GraphsGestion.jsx";

function GestionAire() {
  return (
    <>
      {/* Cartes */}
      <div className="gap-4 flex flex-col">
        <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
          <CardsList type={"toilette"} />
        </div>

        {/* Graph */}
        <GraphsGestion />
      </div>
    </>
  );
}

export default GestionAire;
