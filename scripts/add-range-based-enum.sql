-- Adiciona o valor RANGE_BASED ao enum DeliveryType
ALTER TYPE "DeliveryType" ADD VALUE IF NOT EXISTS 'RANGE_BASED';
