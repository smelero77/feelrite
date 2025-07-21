import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CalendarDays, Lock, Euro, Github, ChromeIcon as Google, Apple } from "lucide-react" // Iconos de Lucide React

// Componentes de iconos sociales (reutilizados de la autenticación)
// Si no existen, se pueden añadir aquí o en components/icons.tsx
// export const Github = () => (...)
// export const Google = () => (...)
// export const Apple = () => (...)

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-primary-text font-sans">
      {/* Sección 1: Hero */}
      <header className="w-full bg-white border-b border-border-light py-4 px-6 md:px-12 lg:px-24">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-2xl font-bold text-primary-text">
            <Image
              src="/placeholder.svg?height=32&width=32"
              alt="feelrait Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            feelrait
          </div>
          <div className="flex items-center gap-6">
            <Link href="#funcionalidades" className="text-secondary-text hover:text-primary-blue transition-colors">
              Funcionalidades
            </Link>
            <Link href="#precios" className="text-secondary-text hover:text-primary-blue transition-colors">
              Precios
            </Link>
            <Link href="#blog" className="text-secondary-text hover:text-primary-blue transition-colors">
              Blog
            </Link>
            {/* Nuevo enlace al Dashboard */}
            <Link href="/dashboard" className="text-secondary-text hover:text-primary-blue transition-colors">
              Dashboard
            </Link>
            <Button asChild className="rounded-full bg-primary-blue text-white hover:bg-primary-blue/90 px-6 py-2">
              <Link href="/register">Crear Cuenta</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-16 md:py-24 lg:py-32 bg-white overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 lg:px-24 flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:w-1/2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-primary-text">
                Recupera tu tiempo. Dedícaselo a tus pacientes.
              </h1>
              <p className="text-lg md:text-xl text-secondary-text mb-8 max-w-lg">
                feelrait es la plataforma todo-en-uno que automatiza la gestión de tu consulta, desde la agenda y las
                notas hasta la facturación y los cobros online.
              </p>
              <Button
                asChild
                className="rounded-full bg-primary-blue text-white hover:bg-primary-blue/90 px-8 py-3 text-lg font-semibold mb-2"
              >
                <Link href="/register">Empieza tu Prueba de 14 Días Gratis</Link>
              </Button>
              <p className="text-sm text-secondary-text">Sin necesidad de tarjeta de crédito.</p>
            </div>
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <Image
                src="/placeholder.svg?height=400&width=600"
                width={600}
                height={400}
                alt="feelrait Interface Showcase"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* Sección 2: Prueba Social */}
        <section className="w-full py-8 bg-gray-50 border-t border-b border-border-light">
          <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center max-w-7xl">
            <p className="text-secondary-text text-lg mb-4">Con la confianza de profesionales de:</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {/* Logos de ejemplo - usar imágenes reales si están disponibles */}
              <Image
                src="/placeholder.svg?height=40&width=120"
                width={120}
                height={40}
                alt="Logo 1"
                className="h-10 object-contain"
              />
              <Image
                src="/placeholder.svg?height=40&width=120"
                width={120}
                height={40}
                alt="Logo 2"
                className="h-10 object-contain"
              />
              <Image
                src="/placeholder.svg?height=40&width=120"
                width={120}
                height={40}
                alt="Logo 3"
                className="h-10 object-contain"
              />
              <Image
                src="/placeholder.svg?height=40&width=120"
                width={120}
                height={40}
                alt="Logo 4"
                className="h-10 object-contain"
              />
            </div>
          </div>
        </section>

        {/* Sección 3: Problema -> Solución */}
        <section id="funcionalidades" className="w-full py-16 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center max-w-7xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-primary-text">
              ¿Cansado/a del papeleo y la gestión manual?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-sm">
                <CalendarDays className="h-12 w-12 text-primary-blue mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-primary-text">Agenda Inteligente</h3>
                <p className="text-secondary-text">
                  Gestiona todas tus citas, envía recordatorios automáticos a tus pacientes y evita las ausencias no
                  planificadas.
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-sm">
                <Lock className="h-12 w-12 text-primary-blue mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-primary-text">Historial Clínico Seguro</h3>
                <p className="text-secondary-text">
                  Centraliza todas tus notas y documentos de paciente en un único lugar, cumpliendo con la normativa
                  RGPD.
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-sm">
                <Euro className="h-12 w-12 text-primary-blue mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-primary-text">Cobros Automatizados</h3>
                <p className="text-secondary-text">
                  Genera facturas con un clic y permite que tus pacientes paguen online con tarjeta o Bizum. Olvídate de
                  perseguir pagos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 4: Showcase de Funcionalidades */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-7xl">
            {/* Sub-sección 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
              <div className="lg:w-1/2 flex justify-center lg:justify-start">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  width={600}
                  height={400}
                  alt="feelrait Calendar"
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div className="lg:w-1/2 text-center lg:text-left">
                <h3 className="text-3xl font-bold mb-4 text-primary-text">
                  Una agenda que trabaja para ti, no en tu contra.
                </h3>
                <p className="text-lg text-secondary-text">
                  Con feelrait, tus citas se organizan solas. Envía recordatorios automáticos por SMS o email, gestiona
                  cancelaciones y reprogramaciones con facilidad, y ten una vista unificada de tu día, semana o mes.
                  Dedica menos tiempo a la logística y más a lo que realmente importa: tus pacientes.
                </p>
              </div>
            </div>

            {/* Sub-sección 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="lg:w-1/2 flex justify-center lg:justify-end">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  width={600}
                  height={400}
                  alt="feelrait Payment Flow"
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div className="lg:w-1/2 text-center lg:text-left">
                <h3 className="text-3xl font-bold mb-4 text-primary-text">
                  Facturación profesional, cobros sin esfuerzo.
                </h3>
                <p className="text-lg text-secondary-text">
                  Genera facturas personalizadas en segundos y envíalas directamente a tus pacientes. Con nuestra
                  integración de pagos online, tus pacientes pueden pagar con tarjeta o Bizum de forma segura y rápida.
                  La conciliación automática te libera de la tediosa tarea de verificar cada pago.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 5: Testimonio Real */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center max-w-7xl">
            <div className="bg-primary-blue/10 p-8 md:p-12 rounded-lg shadow-lg max-w-3xl mx-auto">
              <Avatar className="w-20 h-20 mx-auto mb-6">
                <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Dr. Carlos Valiente" />
                <AvatarFallback>CV</AvatarFallback>
              </Avatar>
              <p className="text-2xl md:text-3xl font-serif italic leading-relaxed mb-6 text-primary-text">
                {
                  "Feelrait me ha ahorrado más de 5 horas a la semana en tareas administrativas. Ahora puedo dedicar esa energía a preparar mejor mis sesiones. Ha sido un cambio total."
                }
              </p>
              <p className="font-semibold text-xl text-primary-text">Dr. Carlos Valiente</p>
              <p className="text-secondary-text text-lg">Psicólogo Clínico</p>
            </div>
          </div>
        </section>

        {/* Sección 6: Precios Claros y Simples */}
        <section id="precios" className="w-full py-16 md:py-24 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center max-w-7xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-primary-text">
              Elige el plan que se adapta a ti.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Plan Profesional */}
              <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center border border-border-light">
                <h3 className="text-2xl font-bold mb-4 text-primary-text">Plan Profesional</h3>
                <p className="text-secondary-text mb-6">Ideal para consultas individuales.</p>
                <div className="flex items-baseline mb-4">
                  <span className="text-5xl font-bold text-primary-blue">39€</span>
                  <span className="text-xl text-secondary-text">/mes</span>
                </div>
                <p className="text-sm text-secondary-text mb-8">O 390€/año (¡2 meses gratis!)</p>
                <ul className="text-left text-primary-text space-y-3 mb-8">
                  <li>✓ Agenda inteligente y recordatorios</li>
                  <li>✓ Historial clínico seguro (RGPD)</li>
                  <li>✓ Facturación y cobros online</li>
                  <li>✓ Soporte prioritario</li>
                  <li>✓ Acceso a todas las funcionalidades</li>
                </ul>
                <Button
                  asChild
                  className="w-full rounded-full bg-primary-blue text-white hover:bg-primary-blue/90 px-8 py-3 text-lg font-semibold"
                >
                  <Link href="/register">Empezar con el Plan Profesional</Link>
                </Button>
              </div>

              {/* Plan Avanzado (Ejemplo, si se desea añadir) */}
              <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center border border-border-light">
                <h3 className="text-2xl font-bold mb-4 text-primary-text">Plan Avanzado</h3>
                <p className="text-secondary-text mb-6">Para clínicas y equipos.</p>
                <div className="flex items-baseline mb-4">
                  <span className="text-5xl font-bold text-primary-blue">69€</span>
                  <span className="text-xl text-secondary-text">/mes</span>
                </div>
                <p className="text-sm text-secondary-text mb-8">O 690€/año (¡2 meses gratis!)</p>
                <ul className="text-left text-primary-text space-y-3 mb-8">
                  <li>✓ Todo lo del Plan Profesional</li>
                  <li>✓ Gestión multi-usuario</li>
                  <li>✓ Roles y permisos personalizados</li>
                  <li>✓ Integraciones avanzadas</li>
                  <li>✓ Soporte premium 24/7</li>
                </ul>
                <Button
                  asChild
                  className="w-full rounded-full bg-primary-blue text-white hover:bg-primary-blue/90 px-8 py-3 text-lg font-semibold"
                >
                  <Link href="/register">Empezar con el Plan Avanzado</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 7: Preguntas Frecuentes (FAQ) */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-primary-text">Preguntas Frecuentes</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-border-light">
                <AccordionTrigger className="text-lg font-semibold text-primary-text hover:no-underline">
                  ¿Mis datos y los de mis pacientes están seguros?
                </AccordionTrigger>
                <AccordionContent className="text-secondary-text pb-4">
                  Sí, la seguridad es nuestra máxima prioridad. feelrait utiliza encriptación de extremo a extremo,
                  servidores seguros y cumple estrictamente con el Reglamento General de Protección de Datos (RGPD) para
                  garantizar la confidencialidad y privacidad de toda la información.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-b border-border-light">
                <AccordionTrigger className="text-lg font-semibold text-primary-text hover:no-underline">
                  ¿Mis pacientes tienen que pagar por usar la app?
                </AccordionTrigger>
                <AccordionContent className="text-secondary-text pb-4">
                  No, el acceso para tus pacientes es completamente gratuito y está incluido en tu plan. Ellos solo
                  necesitarán un enlace para acceder a sus recordatorios, citas y opciones de pago.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-b border-border-light">
                <AccordionTrigger className="text-lg font-semibold text-primary-text hover:no-underline">
                  ¿Puedo cancelar mi suscripción en cualquier momento?
                </AccordionTrigger>
                <AccordionContent className="text-secondary-text pb-4">
                  Sí, puedes cancelar tu suscripción en cualquier momento desde tu panel de control, sin preguntas ni
                  complicaciones. No hay contratos a largo plazo, solo pagas por el tiempo que usas feelrait.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border-b border-border-light">
                <AccordionTrigger className="text-lg font-semibold text-primary-text hover:no-underline">
                  ¿Qué necesito para poder aceptar pagos online?
                </AccordionTrigger>
                <AccordionContent className="text-secondary-text pb-4">
                  Solo necesitas una cuenta en feelrait. Nosotros nos encargamos de la integración con las pasarelas de
                  pago para que puedas aceptar pagos con tarjeta o Bizum de forma sencilla y segura, sin necesidad de
                  configuraciones técnicas adicionales.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Sección 8: CTA Final */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-primary-blue text-white text-center">
          <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-8">
              Únete a la nueva generación de psicólogos digitales.
            </h2>
            <Button
              asChild
              className="rounded-full bg-white text-primary-blue hover:bg-gray-100 px-10 py-4 text-xl font-semibold"
            >
              <Link href="/register">Empieza tu Prueba Gratis</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-black text-secondary-text py-12 px-6 md:px-12 lg:px-24">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8 max-w-7xl">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2 text-2xl font-bold text-white">
              <Image
                src="/placeholder.svg?height=32&width=32"
                alt="feelrait Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              feelrait
            </div>
            <p className="text-sm text-center md:text-left">
              La plataforma todo-en-uno para tu consulta de psicología.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start gap-2">
            <h4 className="font-semibold text-white mb-2">Enlaces Rápidos</h4>
            <Link href="#funcionalidades" className="hover:text-white transition-colors">
              Funcionalidades
            </Link>
            <Link href="#precios" className="hover:text-white transition-colors">
              Precios
            </Link>
            <Link href="#blog" className="hover:text-white transition-colors">
              Blog
            </Link>
          </div>
          <div className="flex flex-col items-center md:items-start gap-2">
            <h4 className="font-semibold text-white mb-2">Legal</h4>
            <Link href="#" className="hover:text-white transition-colors">
              Sobre Nosotros
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Contacto
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Términos y Condiciones
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Política de Privacidad
            </Link>
          </div>
          <div className="flex flex-col items-center md:items-start gap-2">
            <h4 className="font-semibold text-white mb-2">Síguenos</h4>
            <div className="flex gap-4">
              <Link href="#" aria-label="GitHub" className="hover:text-white transition-colors">
                <Github className="h-6 w-6" />
              </Link>
              <Link href="#" aria-label="Google" className="hover:text-white transition-colors">
                <Google className="h-6 w-6" />
              </Link>
              <Link href="#" aria-label="Apple" className="hover:text-white transition-colors">
                <Apple className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          © {new Date().getFullYear()} feelrait. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}
