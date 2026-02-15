-- ============================================
-- Fase 3 v0: Soporte de Señales Proactivas
-- ============================================
-- Reutiliza la tabla `notifications` existente con category='signal'
-- y type='silence_risk' | 'predict_delay'.
-- La evidencia y acciones recomendadas van en metadata (JSONB).

-- Agregar preferencia de señales a la tabla de preferencias existente
ALTER TABLE user_notification_preferences
ADD COLUMN IF NOT EXISTS soflia_signals BOOLEAN DEFAULT true;

-- Índice parcial para filtrar señales rápidamente
CREATE INDEX IF NOT EXISTS idx_notifications_signals
ON notifications(recipient_id, category, is_read, created_at DESC)
WHERE category = 'signal';

-- Agregar campo metadata a notifications si no existe (para evidencia de señales)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE notifications ADD COLUMN metadata JSONB DEFAULT NULL;
  END IF;
END $$;

COMMENT ON COLUMN user_notification_preferences.soflia_signals IS
  'Habilitar/deshabilitar señales proactivas de inteligencia (Silence Risk, Predict Delay, etc.)';
