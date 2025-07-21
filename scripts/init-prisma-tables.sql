-- Crear la tabla de perfiles si no existe
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL PRIMARY KEY, -- Referencia a auth.users.id
  username text UNIQUE,
  website text,
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar Row Level Security (RLS) para la tabla profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para profiles
-- Permite a todos ver perfiles (ajusta si necesitas privacidad)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT USING (true);

-- Permite a los usuarios insertar su propio perfil
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Permite a los usuarios actualizar su propio perfil
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Crear la tabla de pacientes si no existe
CREATE TABLE IF NOT EXISTS public.patients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  address text,
  avatar_url text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS para la tabla patients
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para patients (ejemplo: solo el usuario autenticado puede ver/gestionar sus pacientes)
-- NOTA: Necesitarías un campo `user_id` en `patients` para vincularlos al usuario autenticado
-- Por simplicidad, aquí se asume que todos los pacientes son visibles para cualquier usuario autenticado
-- Ajusta estas políticas según tu lógica de negocio (ej. `auth.uid() = owner_id`)
DROP POLICY IF EXISTS "Authenticated users can view patients." ON public.patients;
CREATE POLICY "Authenticated users can view patients."
  ON public.patients FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert patients." ON public.patients;
CREATE POLICY "Authenticated users can insert patients."
  ON public.patients FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update patients." ON public.patients;
CREATE POLICY "Authenticated users can update patients."
  ON public.patients FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete patients." ON public.patients;
CREATE POLICY "Authenticated users can delete patients."
  ON public.patients FOR DELETE USING (auth.role() = 'authenticated');


-- Crear la tabla de citas si no existe
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date date NOT NULL,
  time text NOT NULL,
  type text NOT NULL,
  status text NOT NULL,
  notes text,
  patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS para la tabla appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para appointments
DROP POLICY IF EXISTS "Authenticated users can view appointments." ON public.appointments;
CREATE POLICY "Authenticated users can view appointments."
  ON public.appointments FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert appointments." ON public.appointments;
CREATE POLICY "Authenticated users can insert appointments."
  ON public.appointments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update appointments." ON public.appointments;
CREATE POLICY "Authenticated users can update appointments."
  ON public.appointments FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete appointments." ON public.appointments;
CREATE POLICY "Authenticated users can delete appointments."
  ON public.appointments FOR DELETE USING (auth.role() = 'authenticated');


-- Crear la tabla de facturas si no existe
CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number text UNIQUE NOT NULL,
  date date NOT NULL,
  due_date date NOT NULL,
  total_amount real NOT NULL,
  status text NOT NULL,
  notes text,
  patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS para la tabla invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para invoices
DROP POLICY IF EXISTS "Authenticated users can view invoices." ON public.invoices;
CREATE POLICY "Authenticated users can view invoices."
  ON public.invoices FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert invoices." ON public.invoices;
CREATE POLICY "Authenticated users can insert invoices."
  ON public.invoices FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update invoices." ON public.invoices;
CREATE POLICY "Authenticated users can update invoices."
  ON public.invoices FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete invoices." ON public.invoices;
CREATE POLICY "Authenticated users can delete invoices."
  ON public.invoices FOR DELETE USING (auth.role() = 'authenticated');

-- Opcional: Crear una función para generar números de factura secuenciales
-- CREATE SEQUENCE invoice_number_seq START 1;
-- CREATE OR REPLACE FUNCTION generate_invoice_number()
-- RETURNS TEXT AS $$
-- DECLARE
--   next_val INT;
-- BEGIN
--   SELECT nextval('invoice_number_seq') INTO next_val;
--   RETURN 'INV-' || LPAD(next_val::TEXT, 6, '0');
-- END;
-- $$ LANGUAGE plpgsql;

-- Opcional: Añadir un trigger para usar la función de número de factura
-- ALTER TABLE public.invoices ALTER COLUMN invoice_number SET DEFAULT generate_invoice_number();
