import React, { useState, useRef } from "react";
import DiscoveryPoint from "@/components/decouverte/DiscoveryPoint";
import DiscoveryModal from "@/components/decouverte/DiscoveryModal";

const discoveryPoints = [
  {
    id: 1,
    label: "Déguster",
    subtitle: "Un territoire viticole",
    position: { top: 45, left: 57 },
    content: `Territoire viticole : Découverte de l'AOC Touraine Mesland

Le vignoble de Touraine Mesland s'étend sur les coteaux dominant la Loire, offrant des vins d'exception dans un cadre naturel préservé. Cette appellation produit des vins rouges, rosés et blancs caractéristiques du terroir ligérien.`,
    links: [
      { label: "Site de l'ADT41", url: "https://www.coeur-val-de-loire.com/" }
    ]
  },
  {
    id: 2,
    label: "Protéger",
    subtitle: "Un fleuve sauvage",
    position: { top: 65, left: 50 },
    content: `Un fleuve sauvage protégé - Le Val de Loire patrimoine mondial

Le Val de Loire, de Sully-sur-Loire (Loiret) à Chalonnes-sur-Loire (Maine-et-Loire), est inscrit sur la Liste du patrimoine mondial de l'Unesco depuis le 30 novembre 2000.

Cette reconnaissance internationale consacre un paysage culturel exceptionnel — comprenant des villes et villages historiques, de grands monuments architecturaux et des terres cultivées — façonné par des siècles d'interactions entre les populations et leur environnement physique, dont la Loire elle-même.

🎮 Activité : parcours découverte de la nature avec GuidiGo

Adapté aux enfants de 7 à 12 ans, ce parcours numérique ludique permet de découvrir la nature au travers un parcours pédagogique et didactique.

Veuzain-sur-Loire : Terrasse de la Loire, un paysage à « croquer » !

Accompagnés de Beaver, la jeune castor passionnée de dessin naturaliste, vous parcourez ce site dont la flore et la faune sont caractéristiques des forêts alluviales et des pelouses sur sable. Munis de votre matériel, vous pourrez « croquer » la vie des bords de Loire et découvrir une plante utile pour les artistes.`,
    links: [
      { label: "GuidiGo Terrasses de la Loire", url: "https://www.guidigo.com/" }
    ]
  },
  {
    id: 3,
    label: "Découvrir",
    subtitle: "Un site marqué par l'histoire humaine",
    position: { top: 72, left: 25 },
    content: `Port de Chaumont-sur-Loire

Chaumont-sur-Loire bénéficie depuis 1792 d'un port construit. La présence d'un bac reliant Chaumont-sur-Loire et Onzain est attestée depuis le Moyen-Age. Il a fonctionné jusqu'en 1858, date de la construction d'un pont suspendu sur la Loire.

En 1816, le bac de Chaumont utilise un bateau passe cheval de 11,34 m x 1,15 m pourvu d'un gouvernail, de deux bourdes ferrées et d'une corde d'amarrage.

⛵ Activités : Promenades conviviales sur la Loire

Les promenades en bateau s'adressent à tous, petits et grands. Elles permettent de découvrir autrement le fleuve, ses paysages, sa faune et sa flore.

La perception de l'espace, des lumières et des sons évoluent et diffèrent lorsque l'on se retrouve au centre du fleuve sauvage. Sa beauté changeante en fonction des saisons et des moments de la journée rend chaque balade unique.`,
    links: [
      { label: "Site ADT41 - Promenades en bateau", url: "https://www.coeur-val-de-loire.com/" }
    ]
  },
  {
    id: 4,
    label: "Explorer",
    subtitle: "La Loire à vélo",
    position: { top: 58, left: 82 },
    content: `La Loire à Vélo : un voyage mythique au cœur du dernier fleuve sauvage d'Europe

La Loire à Vélo est l'itinéraire cyclable touristique le plus long de France, offrant une aventure unique sur près de 900 km le long du majestueux fleuve de la Loire.

Cet itinéraire mythique de près de 650 km relie Cuffy (près de Nevers) à Saint-Brévin-les-Pins sur l'océan Atlantique. Entièrement balisé dans les deux sens (d'Est en Ouest), il est facilement repérable grâce au logo de La Loire à Vélo.

🏰 Un patrimoine exceptionnel à découvrir

Pédaler sur La Loire à Vélo, c'est s'immerger au cœur du Val de Loire, surnommé "vallée des rois" ou "jardin de la France", inscrit au patrimoine mondial de l'UNESCO.

Le long de ce voyage à travers l'histoire, vous découvrirez :
• Des paysages naturels préservés
• Les incontournables Châteaux de la Loire
• Une richesse culturelle et gastronomique

Comptez environ une semaine et demie de voyage pour relier l'intégralité des 650 km de Nevers à l'océan.

Que vous soyez cycliste aguerri ou en famille à la recherche de balades faciles, La Loire à Vélo séduit par son profil à la fois touristique, culturel, éco-responsable et sportif.`,
    links: [
      { label: "Site officiel La Loire à Vélo", url: "https://www.loireavelo.fr/" }
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
        links={selectedPoint?.links || []}
      />
    </div>
  );
}

export default Decouverte;
