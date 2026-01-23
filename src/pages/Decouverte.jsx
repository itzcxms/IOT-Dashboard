import React, { useState, useRef } from "react";
import { Info } from "lucide-react";
import DiscoveryPoint from "@/components/decouverte/DiscoveryPoint";
import DiscoveryModal from "@/components/decouverte/DiscoveryModal";
import InfoModal from "@/components/decouverte/InfoModal";

// TODO : Alertes expiration droits des images

const discoveryPoints = [
  {
    id: 1,
    label: "Déguster",
    logo: "/decouverte/logos/touraine.png",
    subtitle:
      "Découvrez l'AOC Touraine Mesland : L'Élégance du Loir-et-Cher en Bouteille",
    position: { top: 45, left: 57 },
    image: "/decouverte/deguster.jpg",
    // ⚠️ ALERTE: Droits photo expiration le 12/09/2030 - Changer la photo avant juin 2030
    content:
      "Cette appellation d'origine contrôlée, nichée sur les coteaux de la Loire, se distingue par un terroir exceptionnel, souvent composé de sables et d'argiles à silex (appelés localement \"perruches\") qui confèrent à ce vin son caractère unique. Chaque verre révèle le terroir unique de Touraine Mesland. Venez rencontrer des vignerons passionnés et partagez un moment d'authenticité et de plaisir au fil de la Loire.",
    activities:
      "Dégustez des vins raffinés : Le Rosé, dominé par le Gamay, offrant une bouche fraîche et fruitée. Le Rouge, élaboré à partir de Côt et de Gamay, révèle des arômes de fruits rouges. Le Blanc, issu du Chenin ou du Sauvignon, exprime toute la minéralité de notre sol.",
    links: [
      {
        label: "Poursuivez l'aventure et trouvez des adresses de dégustations",
        url: "https://www.vin-touraine-mesland.fr/",
      },
    ],
    links: [
      {
        label: "Poursuivez l'aventure et trouvez des adresses de dégustations",
        url: "https://www.vin-touraine-mesland.fr/",
      },
    ],
    // x% (horizontal) y% (vertical) - ex: "50% 20%" pour remonter l'image
    imagePosition: "50% 75%",
  },
  {
    id: 2,
    label: "Protéger",
    subtitle: "Un fleuve sauvage",
    position: { top: 65, left: 50 },
    image: "/decouverte/proteger.jpg",
    // ⚠️ ALERTE: Droits photo expiration le 31/12/2026 - Changer la photo avant octobre 2026
    imageSource: "©Laurent Alvarez - ADT41",
    content:
      "Bienvenue sur les rives de la Loire, le dernier fleuve sauvage d'Europe ! Traversant le Loir-et-Cher, ce géant naturel est un trésor exceptionnel : le Val de Loire est inscrit au Patrimoine Mondial de l'UNESCO depuis l'an 2000 en tant que \"paysage culturel vivant\". Ce fleuve unique vit au rythme des saisons qui le façonne et le transforme. C'est le lieu idéal pour une immersion dans une nature préservée.",
    activities:
      "Ouvrez l'œil et laissez-vous surprendre par la faune ligérienne : le discret Castor d'Europe qui travaille les berges, la gracieuse Sterne pierregarin en pleine pêche, et une multitude d'oiseaux migrateurs. La Loire vous offre un spectacle naturel fascinant et changeant, invitant à la contemplation. Alors n'hésitez pas à partir à sa découverte.",
    links: [
      {
        label: "Aventure en Famille : lancez-vous dans l'exploration",
        url: "https://www.guidigo.com/",
      },
    ],
    imagePosition: "45% 30%",
  },
  {
    id: 3,
    label: "Découvrir",
    subtitle: "Un site marqué par l'histoire humaine",
    position: { top: 72, left: 25 },
    image: "/decouverte/decouvrir.jpg",
    // ⚠️ ALERTE: Droits photo expiration le 31/12/2026 - Changer la photo avant octobre 2026
    imageSource: "©Enola Création / ADT41",
    content:
      "Avant la construction du premier pont suspendu en 1858, la traversée du fleuve se faisait depuis le port de Chaumont-sur-Loire vers Onzain par un bac. On retrouve des traces de l'existence de ce bac dès le Moyen-âge. Aujourd'hui le pont de Chaumont-sur-Loire constitue un trait d'union important entre les deux rives du fleuve (un des 4 ponts sur la Loire en Loir-et-Cher).",
    activities:
      "Chaumont-sur-Loire bénéficie depuis 1792 d'un port construit, lieu fort pour l'économie et le commerce local. Aujourd'hui, le port permet d'embarquer dans un bateau traditionnel et de s'offrir une découverte hors du temps sur le dernier fleuve sauvage d'Europe.",
    links: [
      {
        label: "Vers une promenade en bateau sur la Loire",
        url: "https://www.coeur-val-de-loire.com/",
      },
    ],
    imagePosition: "50% 80%",
  },
  {
    id: 4,
    label: "Explorer",
    subtitle: "La Loire à Vélo : Une Étape Royale Incontournable",
    position: { top: 58, left: 82 },
    image: "/decouverte/explorer.jpg",
    // ⚠️ ALERTE: Droits photo expiration le 31/12/2026 - Changer la photo avant octobre 2026
    content:
      "La Loire à Vélo est un itinéraire exceptionnel qui vous mène au cœur du dernier fleuve sauvage d'Europe mais dont les rives sont habitées depuis des siècles. Sur près de 55 kilomètres balisés, vous pédalez au cœur du Val de Loire. Cette portion est la promesse d'une exploration royale qui vous donne accès à un patrimoine mondial remarquable.",
    activities:
      "Le Domaine National de Chambord, le Château Royal de Blois, et juste derrière vous, le Domaine de Chaumont-sur-Loire et son Festival des Jardins. Que vous arriviez de l'ouest ou que vous partiez vers l'Atlantique, faites une halte privilégiée sur nos rives. Profitez de la douceur de vivre ligérienne avant de poursuivre votre périple.",
    links: [
      {
        label: "A vos vélos : planifiez votre découverte en Loir et Cher",
        url: "https://www.val-de-loire-41.com/circuits-et-randonnees/a-velo/circuits-velo-loir-et-cher/circuits-velo/",
      },
    ],
    imagePosition: "50% 60%",
  },
];

function Decouverte() {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const containerRef = useRef(null);

  const handlePointClick = (point) => {
    setSelectedPoint(point);
  };

  const handleCloseModal = () => {
    setSelectedPoint(null);
  };

  const handleScroll = (e) => {
    if (!hasScrolled) {
      const { scrollLeft, scrollTop } = e.currentTarget;
      // Fade out only after scrolling 50px in any direction
      if (Math.abs(scrollLeft) > 50 || Math.abs(scrollTop) > 50) {
        setHasScrolled(true);
      }
    }
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
        onScroll={handleScroll}
        className="absolute inset-0 overflow-auto"
        style={{
          overflowX: "auto",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {}
        <div
          className="relative"
          style={{
            minWidth: "100vw",
            minHeight: "100vh",

            width: "max-content",
            height: "max-content",
          }}
        >
          {}
          <img
            src="/decouverte/chaumont-loire.jpg"
            alt="Vue du Port de Chaumont-sur-Loire"
            className="block"
            style={{
              minWidth: "100vw",
              minHeight: "100vh",
              objectFit: "cover",
              width: "auto",
              height: "100vh",
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
                left: `${point.position.left}%`,
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
                transform: "translate(-50%, 24px)",
              }}
            >
              <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap backdrop-blur-sm">
                {point.id}. {point.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile swipe hint */}
      <div
        className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-10 md:hidden landscape:hidden pointer-events-none transition-opacity duration-700 ${
          hasScrolled ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-2">
          <span>↔</span>
          <span>Glissez pour explorer</span>
        </div>
      </div>

      {/* Partner Logos - Bottom Left */}
      <div className="fixed bottom-4 left-4 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg">
        <a
          href="https://www.val-de-loire-41.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/decouverte/logos/RVB-ValdeLoire-Vertical-Quadri.jpg"
            alt="Val de Loire"
            className="h-10 md:h-12 rounded"
          />
        </a>
        <a
          href="https://www.loireavelo.fr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/decouverte/logos/La_Loire_à_vélo_Logo.png"
            alt="La Loire à Vélo"
            className="h-10 md:h-12 rounded"
          />
        </a>
      </div>

      {/* Info Button - Bottom Right */}
      <button
        onClick={() => setShowInfoModal(true)}
        className="fixed bottom-4 right-4 z-10 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
        aria-label="Informations"
      >
        <Info className="w-5 h-5 text-gray-700" />
      </button>

      <DiscoveryModal
        isOpen={selectedPoint !== null}
        onClose={handleCloseModal}
        title={selectedPoint?.label}
        subtitle={selectedPoint?.subtitle}
        content={selectedPoint?.content}
        activities={selectedPoint?.activities}
        image={selectedPoint?.image}
        imageSource={selectedPoint?.imageSource}
        imageFit={selectedPoint?.imageFit}
        imagePosition={selectedPoint?.imagePosition}
        logo={selectedPoint?.logo}
        links={selectedPoint?.links || []}
      />

      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
    </div>
  );
}

export default Decouverte;
