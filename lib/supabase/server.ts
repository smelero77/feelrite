import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

const SUPABASE_URL_ENV = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ""
const SUPABASE_ANON_KEY_ENV =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || // opcional, por si la marcas como pública
  ""

function assertEnv() {
  console.log("DEBUG: Intentando leer variables de entorno de Supabase:")
  console.log(`  process.env.NEXT_PUBLIC_SUPABASE_URL: ${Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)}`)
  console.log(`  process.env.SUPABASE_URL: ${Boolean(process.env.SUPABASE_URL)}`)
  console.log(`  process.env.SUPABASE_ANON_KEY: ${Boolean(process.env.SUPABASE_ANON_KEY)}`);
  console.log(`  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY: ${Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)}`)
  console.log(`  Valor final de SUPABASE_URL_ENV: ${Boolean(SUPABASE_URL_ENV)}`)
  console.log(`  Valor final de SUPABASE_ANON_KEY_ENV: ${Boolean(SUPABASE_ANON_KEY_ENV)}`)

  if (!SUPABASE_URL_ENV || !SUPABASE_ANON_KEY_ENV) {
    console.error(
      "❌ Supabase env vars missing (final check):",
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
      "Faltan las variables de entorno de Supabase (URL y/o ANON KEY). " +
        "Revísalas en el panel de Vercel o en tu .env.local. " +
        "Asegúrate de que la URL se llame NEXT_PUBLIC_SUPABASE_URL o SUPABASE_URL.",
    )
  }
}

export async function getSupabaseServerClient() {
  assertEnv()

  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL_ENV, SUPABASE_ANON_KEY_ENV, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}
