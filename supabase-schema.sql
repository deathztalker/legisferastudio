-- Script para crear la base de datos de citas en Supabase

-- 1. Crear la tabla 'appointments'
CREATE TABLE appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    reason TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status TEXT DEFAULT 'pending' -- Puede ser 'pending', 'confirmed', 'cancelled'
);

-- 2. Habilitar Seguridad a Nivel de Fila (RLS)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- 3. Crear política para permitir que CUALQUIER USUARIO ANÓNIMO pueda insertar citas
-- Esto es necesario para que funcione tu formulario público en la web
CREATE POLICY "Permitir inserciones anónimas" 
ON appointments 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- 4. (Opcional pero recomendado) Política para que solo los administradores puedan leer
-- Solo tú (usuario autenticado desde el panel de Supabase) podrás ver los datos
CREATE POLICY "Permitir lectura solo a usuarios autenticados" 
ON appointments 
FOR SELECT 
TO authenticated 
USING (true);

-- 5. (Opcional) Política para actualizaciones (ej. cambiar status)
CREATE POLICY "Permitir actualización solo a usuarios autenticados" 
ON appointments 
FOR UPDATE 
TO authenticated 
USING (true);
