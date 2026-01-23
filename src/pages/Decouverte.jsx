import React, { useState, useRef } from "react";
import DiscoveryPoint from "@/components/decouverte/DiscoveryPoint";
import DiscoveryModal from "@/components/decouverte/DiscoveryModal";

const discoveryPoints = [
  {
    id: 1,
    label: "Déguster",
    subtitle: "Un territoire viticole",
    position: { top: 45, left: 57 },
    image: "/decouverte/deguster.jpg",
    content: "Le vignoble de Touraine Mesland s'étend sur les coteaux dominant la Loire, offrant des vins d'exception dans un cadre naturel préservé. Cette appellation produit des vins rouges, rosés et blancs caractéristiques du terroir ligérien.",
    activities: "Découverte de l'AOC Touraine Mesland avec dégustation de vins locaux. Visite des caves et rencontre avec les vignerons du territoire.",
    links: [
      { label: "Site de l'ADT41", url: "https://www.coeur-val-de-loire.com/" }
    ]
  },
  {
    id: 2,
    label: "Protéger",
    subtitle: "Un fleuve sauvage",
    position: { top: 65, left: 50 },
    image: "/decouverte/proteger.jpg",
    content: "Le Val de Loire, de Sully-sur-Loire à Chalonnes-sur-Loire, est inscrit sur la Liste du patrimoine mondial de l'Unesco depuis le 30 novembre 2000. Cette reconnaissance internationale consacre un paysage culturel exceptionnel façonné par des siècles d'interactions entre les populations et leur environnement.",
    activities: "Parcours découverte de la nature avec GuidiGo adapté aux enfants de 7 à 12 ans. Veuzain-sur-Loire : Terrasse de la Loire, un paysage à « croquer » avec Beaver, la jeune castor passionnée de dessin naturaliste.",
    links: [
      { label: "GuidiGo Terrasses de la Loire", url: "https://www.guidigo.com/" }
    ]
  },
  {
    id: 3,
    label: "Découvrir",
    subtitle: "Un site marqué par l'histoire humaine",
    position: { top: 72, left: 25 },
    image: "/decouverte/decouvrir.jpg",
    content: "1858, date de la construction d'un pont suspendu sur la Loire. En 1816, le bac de Chaumont utilise un bateau passe cheval de 11,34 m x 1,15 m pourvu d'un gouvernail, de deux bourdes ferrées et d'une corde d'amarrage.",
    links: [
      { label: "Vers une promenade en bateau sur la Loire", url: "https://www.coeur-val-de-loire.com/" }
    ]
  },
  {
    id: 4,
    label: "Explorer",
    subtitle: "La Loire à vélo",
    position: { top: 58, left: 82 },
    image: "/decouverte/explorer.jpg",
    content: "Un voyage mythique au cœur du dernier fleuve sauvage d'Europe. La Loire à Vélo est l'itinéraire cyclable touristique le plus long de France, offrant une aventure unique sur près de 900 km le long du majestueux fleuve de la Loire.",
    activities: null,
    links: [
      { label: "Site de la loire à Vélo", url: "https://www.loireavelo.fr/" }
    ]
  }
];

function Decouverte() {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const containerRef = useRef(null);

  const handlePointClick = (point) => {
    setSelectedPoint(point);
  };

  const handleCloseModal = () => {
    setSelectedPoint(null);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <h1 className="text-white text-lg md:text-2xl font-bold text-center drop-shadow-lg">
          Découverte du milieu au niveau de Chaumont
        </h1>
        <p className="text-white/80 text-xs md:text-sm text-center mt-1 drop-shadow">
          Cliquez sur les points pour en savoir plus
        </p>
      </div>

      <div 
        ref={containerRef}
        className="absolute inset-0 overflow-auto"
        style={{
          overflowX: 'auto',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {}
        <div 
          className="relative"
          style={{
            minWidth: '100vw',
            minHeight: '100vh',

            width: 'max-content',
            height: 'max-content'
          }}
        >
          {}
          <img
            src="/decouverte/chaumont-loire.jpg"
            alt="Vue du Port de Chaumont-sur-Loire"
            className="block"
            style={{
              minWidth: '100vw',
              minHeight: '100vh',
              objectFit: 'cover',
              width: 'auto',
              height: '100vh'
            }}
            draggable={false}
          />

          {discoveryPoints.map((point) => (
            <DiscoveryPoint
              key={point.id}
              number={point.id}
              label={point.label}
              position={{
                top: `${point.position.top}%`,
                left: `${point.position.left}%`
              }}
              isActive={selectedPoint?.id === point.id}
              onClick={() => handlePointClick(point)}
            />
          ))}

          {discoveryPoints.map((point) => (
            <div
              key={`label-${point.id}`}
              className="absolute z-5 pointer-events-none"
              style={{
                top: `${point.position.top}%`,
                left: `${point.position.left}%`,
                transform: "translate(-50%, 24px)"
              }}
            >
              <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap backdrop-blur-sm">
                {point.id}. {point.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 md:hidden pointer-events-none">
        <div className="bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-2">
          <span>↔</span>
          <span>Glissez pour explorer</span>
        </div>
      </div>

      <DiscoveryModal
        isOpen={selectedPoint !== null}
        onClose={handleCloseModal}
        title={selectedPoint?.label}
        subtitle={selectedPoint?.subtitle}
        content={selectedPoint?.content}
        activities={selectedPoint?.activities}
        image={selectedPoint?.image}
        links={selectedPoint?.links || []}
      />
    </div>
  );
}

export default Decouverte;
