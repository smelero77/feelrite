import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { ChartLineDefault } from "@/components/chart-line-default";

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <SidebarInset>
          <header className="group flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-data-[collapsible=icon]:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger />
              <div className="h-4 w-px bg-border" />
              <h1 className="text-lg font-semibold">FeelRite</h1>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="container mx-auto p-6">
              <h1 className="text-3xl font-bold text-foreground mb-6">
                Bienvenido a FeelRite
              </h1>
              <p className="text-muted-foreground mb-8">
                Tu aplicación de gestión de emociones y bienestar personal.
              </p>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <ChartLineDefault />
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
