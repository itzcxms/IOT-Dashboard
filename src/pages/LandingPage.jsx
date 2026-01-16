import React, { useState } from "react";
import {
  Droplets,
  Map,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Send,
  Bike,
  Waves,
  Grape,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "../assets/Hero.jpg";

const WaterLevelCard = () => {
  const level = 4.0;
  const status = "Conditions idéales";
  const maxLevel = 5;
  const percentage = (level / maxLevel) * 100;

  return (
    <Card className="w-full max-w-md mx-auto -mt-16 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 shadow-xl border-none rounded-2xl bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Droplets className="h-5 w-5" />
              <span className="font-medium text-sm uppercase tracking-wider">
                Niveau d'eau de la Loire
              </span>
            </div>
            <p className="text-xs text-gray-500">Mise à jour en temps réel</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-bold text-slate-800">{level}</span>
            <span className="text-xl font-semibold text-slate-600">m</span>
          </div>
          <p className="text-emerald-600 font-medium flex items-center gap-2">
            {status}
          </p>
        </div>

        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
          <span>0m</span>
          <span>Crue (5m)</span>
        </div>
      </CardContent>
    </Card>
  );
};

const FeatureCard = ({ icon: Icon, title, description, link }) => (
  <Card className="rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-gray-100 group h-full bg-white">
    <CardContent className="p-8 flex flex-col items-center text-center h-full">
      <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors">
        <Icon className="h-6 w-6 text-emerald-700" />
      </div>
      <h3 className="text-xl font-serif text-slate-800 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed mb-8 flex-grow text-sm">
        {description}
      </p>
      <Button
        asChild
        className="w-full bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium rounded-lg h-auto py-2.5"
      >
        <a
          href={link}
          className="inline-flex items-center gap-2 justify-center"
        >
          En savoir plus
          <Send className="h-3 w-3" />
        </a>
      </Button>
    </CardContent>
  </Card>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-slate-800">
      <header className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto mt-[-100px]">
          <h2 className="text-2xl md:text-3xl font-light mb-2 tracking-wide">
            L'aire de
          </h2>
          <h1 className="text-5xl md:text-7xl font-serif mb-6 tracking-tight">
            Chaumont-sur-Loire
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
            Au cœur du Val de Loire, découvrez un territoire d'exception où
            patrimoine, nature et art de vivre se rencontrent
          </p>
        </div>
      </header>

      <div className="px-4">
        <WaterLevelCard />
      </div>

      <section className="py-20 px-4 md:px-8 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-emerald-900 mb-8">
          Bienvenue à l'Aire de Chaumont
        </h2>
        <p className="text-gray-600 leading-loose text-lg font-light">
          Vous êtes arrivés à un point de vue exceptionnel sur la Loire sauvage
          et le Domaine de Chaumont-sur-Loire. Cette aire de repos, étape
          majeure de La Loire à Vélo, est le lieu idéal pour une pause. Que ce
          soit pour vous détendre à la guinguette, découvrir l'histoire du port
          ou simplement admirer le paysage classé au patrimoine mondial de
          l'UNESCO, votre escale commence ici.
        </p>
      </section>

      <section className="py-16 px-4 md:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-emerald-900 mb-16 text-center">
            Découvrez les Richesses du Territoire
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Grape}
              title="Territoire viticole"
              description="Explorez les vignobles de cette appellation réputée et dégustez les meilleurs crus des coteaux ligériens."
              link="#"
            />
            <FeatureCard
              icon={Waves}
              title="Un fleuve sauvage protégé"
              description="Le Val de Loire, de Sully-sur-Loire à Chalonnes-sur-Loire, est inscrit au patrimoine mondial de l'Unesco depuis 2000. Un paysage culturel exceptionnel façonné par des siècles d'interactions."
              link="#"
            />
            <FeatureCard
              icon={Bike}
              title="La Loire à Vélo"
              description="Un voyage mythique de près de 900 km le long du dernier fleuve sauvage d'Europe. Traversez six départements, découvrez les châteaux emblématiques, les paysages préservés et la gastronomie locale."
              link="#"
            />
          </div>
        </div>
      </section>

      {/*      <section className="py-24 px-4 md:px-8 bg-[#FDFBF7]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-emerald-900 mb-4">
            Être notifié des alertes
          </h2>
          <p className="text-gray-500 mb-10">
            Recevez les alertes liées au niveau de l'eau en temps réel sur votre
            boite mail
          </p>

          <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="example@example.com"
              className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 text-gray-700 placeholder:text-gray-400 h-auto py-3 text-base"
            />
            <Button className="px-8 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-medium rounded-lg h-auto">
              Envoyer
            </Button>
          </div>
        </div>
      </section>*/}

      <footer className="bg-emerald-900 text-emerald-50 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
          <div>
            <h4 className="font-serif text-lg mb-6 text-white">Lorem ipsum</h4>
            <ul className="space-y-4 opacity-80">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4" />
                <span>Lorem ipsum</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4" />
                <span>Lorem ipsum</span>
              </li>
              <li className="flex items-center gap-3">
                <Map className="h-4 w-4" />
                <span>Lorem ipsum</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 text-white">Liens utiles</h4>
            <ul className="space-y-3 opacity-80">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Val de Loire
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Office de tourisme
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Domaine de Chaumont-sur-Loire
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Vigicrues
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 text-white">Lorem ipsum</h4>
            <div className="flex gap-4 mb-6">
              <a
                href="#"
                className="h-8 w-8 rounded-full bg-emerald-800 flex items-center justify-center hover:bg-emerald-700 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="h-8 w-8 rounded-full bg-emerald-800 flex items-center justify-center hover:bg-emerald-700 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="h-8 w-8 rounded-full bg-emerald-800 flex items-center justify-center hover:bg-emerald-700 transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
            <p className="opacity-60 text-xs leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Follow
              for daily garden inspiration and tips.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
