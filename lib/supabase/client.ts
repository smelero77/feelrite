import { createBrowserClient } from "@supabase/ssr"

// Singleton pattern para el cliente de Supabase en el navegador
let supabase: ReturnType<typeof createBrowserClient> | undefined

export function getSupabaseBrowserClient() {
  const SUPABASE_URL_ENV = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const SUPABASE_ANON_KEY_ENV = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  console.log("DEBUG: Intentando leer variables de entorno de Supabase (cliente):")
  console.log(`  process.env.NEXT_PUBLIC_SUPABASE_URL: ${Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)}`)
  console.log(`  process.env.SUPABASE_URL: ${Boolean(process.env.SUPABASE_URL)}`)
  console.log(`  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY: ${Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)}`)
  console.log(`  process.env.SUPABASE_ANON_KEY: ${Boolean(process.env.SUPABASE_ANON_KEY)}`)
  console.log(`  Valor final de SUPABASE_URL_ENV: ${Boolean(SUPABASE_URL_ENV)}`)
  console.log(`  Valor final de SUPABASE_ANON_KEY_ENV: ${Boolean(SUPABASE_ANON_KEY_ENV)}`)

  if (!supabase) {
    if (!SUPABASE_URL_ENV || !SUPABASE_ANON_KEY_ENV) {
      console.error(
        "❌ Supabase env vars missing (client final check):",
        JSON.stringify(
          {
            SUPABASE_URL: Boolean(SUPABASE_URL_ENV),
            SUPABASE_ANON_KEY: Boolean(SUPABASE_ANON_KEY_ENV),
          },
          null,
          2,
        ),
      )
      throw new Error(
        "Faltan las variables de entorno de Supabase (URL y/o ANON KEY) en el cliente. " +
          "Asegúrate de que la URL se llame NEXT_PUBLIC_SUPABASE_URL o SUPABASE_URL.",
      )
    }
    supabase = createBrowserClient(SUPABASE_URL_ENV, SUPABASE_ANON_KEY_ENV)
  }
  return supabase
}
