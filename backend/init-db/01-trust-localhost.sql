-- Script de inicialización para permitir conexiones trust desde el host
-- Esto solo afecta a desarrollo local y se ejecuta cuando el contenedor se crea por primera vez

DO $$
BEGIN
    -- Modificar pg_hba.conf para permitir conexiones sin password desde el host
    ALTER SYSTEM SET listen_addresses = '*';
END
$$;
