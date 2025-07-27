import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react"
import { Header } from "@/components/header"

export default function CrossFitAslakPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      {/* Section Héro */}
      <section
        id="hero"
        className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat pt-16"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">CrossFit Aslak</h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 font-medium">Forgez Votre Forme</p>
          <Button size="lg" className="bg-[#ec3642] hover:bg-[#d12b36] text-white font-bold px-8 py-4 text-lg" asChild>
            <a href="#contact">Réservez Votre Séance d'Essai Gratuite</a>
          </Button>
        </div>
      </section>

      {/* Section Qu'est-ce que le CrossFit */}
      <section id="crossfit" className="py-20 px-4 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#ec3642]">Qu'est-ce que le CrossFit ?</h2>
          <p className="text-lg text-gray-300 text-center mb-16 max-w-4xl mx-auto leading-relaxed">
            Le CrossFit est une méthodologie de fitness qui combine des mouvements fonctionnels constamment variés
            exécutés à haute intensité. Notre programme offre une condition physique large, générale et inclusive, vous
            préparant à tous les défis physiques que la vie peut vous réserver.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-700 border-gray-600 text-center p-8">
              <CardContent className="pt-6">
                <div className="text-6xl mb-4">🔄</div>
                <h3 className="text-xl font-bold mb-4 text-[#ec3642]">Constamment Varié</h3>
                <p className="text-gray-300">
                  Aucun entraînement ne se ressemble. Nous varions constamment les exercices, les répétitions et les
                  durées pour maintenir votre corps en adaptation et en progression.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600 text-center p-8">
              <CardContent className="pt-6">
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-4 text-[#ec3642]">Haute Intensité</h3>
                <p className="text-gray-300">
                  Nous travaillons à haute intensité relative à votre niveau de forme, maximisant les résultats en un
                  minimum de temps grâce à des entraînements stimulants et adaptables.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600 text-center p-8">
              <CardContent className="pt-6">
                <div className="text-6xl mb-4">🏋️‍♂️</div>
                <h3 className="text-xl font-bold mb-4 text-[#ec3642]">Mouvements Fonctionnels</h3>
                <p className="text-gray-300">
                  Nous nous concentrons sur des mouvements qui imitent les activités de la vie quotidienne, développant
                  force et mobilité qui se traduisent dans vos tâches quotidiennes et vos sports.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Coachs */}
      <section id="coaches" className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#ec3642]">Rencontrez Nos Coachs</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Coach Sarah"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-[#ec3642]">Sarah Martinez</h3>
                <p className="text-sm text-gray-400 mb-3">CF-L2, USAW Performance Sportive</p>
                <p className="text-gray-300 text-sm">
                  Avec 8 ans d'expérience en CrossFit, Sarah se spécialise dans l'haltérophilie olympique et aide les
                  athlètes à atteindre leur potentiel grâce à une technique et une forme appropriées.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Coach Marcus"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-[#ec3642]">Marcus Thompson</h3>
                <p className="text-sm text-gray-400 mb-3">CF-L3, Nutrition Précision</p>
                <p className="text-gray-300 text-sm">
                  Marcus apporte 10 ans d'expérience de coaching avec un focus sur la nutrition et le conditionnement
                  métabolique. Il est passionné par l'aide aux membres pour atteindre leurs objectifs.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Coach Emma"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-[#ec3642]">Emma Dubois</h3>
                <p className="text-sm text-gray-400 mb-3">CF-L2, Yoga Alliance RYT-200</p>
                <p className="text-gray-300 text-sm">
                  Emma combine son expertise CrossFit avec le yoga et le travail de mobilité, s'assurant que les membres
                  restent sans blessure tout en développant force et flexibilité.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section id="contact" className="py-20 px-4 bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#ec3642]">Prêt à Commencer Votre Parcours ?</h2>

          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-8">
              <form action="#" method="POST" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">
                      Nom Complet *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                      Adresse Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-300">
                    Numéro de Téléphone
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                    placeholder="Parlez-nous de vos objectifs fitness ou posez vos questions..."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-[#ec3642] hover:bg-[#d12b36] text-white font-bold">
                  Envoyer le Message & Réserver l'Essai Gratuit
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pied de page */}
      <footer className="bg-gray-900 py-12 px-4 border-t border-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#ec3642]">CrossFit Aslak</h3>
              <div className="flex items-start space-x-2 text-gray-300">
                <MapPin className="w-5 h-5 mt-1 text-[#ec3642]" />
                <div>
                  <p>22 Rue de Bezons</p>
                  <p>78420 Carrières-sur-Seine</p>
                  <p>France</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-[#ec3642]">Informations de Contact</h4>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-[#ec3642]" />
                  <span>+33 1 23 45 67 89</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-[#ec3642]" />
                  <span>info@crossfitaslak.fr</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-[#ec3642]">Suivez-Nous</h4>
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com/crossfitaslak"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#ec3642] transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="https://facebook.com/crossfitaslak"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#ec3642] transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} CrossFit Aslak. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
