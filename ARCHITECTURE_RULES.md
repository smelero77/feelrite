# Reglas de Estilo y Arquitectura para el Proyecto "FeelRite"

## 🎯 Objetivo
Establecer directrices claras y consistentes para el desarrollo y mantenimiento del proyecto FeelRite, asegurando una arquitectura de diseño escalable y mantenible.

## 📋 Reglas Fundamentales

### 1. `globals.css` es la Única Fuente de Verdad para el Tema

**Regla**: Todos los tokens de diseño (colores, fuentes, radios de borde, etc.) deben definirse como variables CSS en `app/globals.css` dentro de los selectores `:root` (tema claro) y `.dark` (tema oscuro).

**Mi Compromiso**: Antes de proponer un nuevo estilo, verificaré si ya existe una variable CSS adecuada. Si necesitas un nuevo color, te guiaré para que primero lo añadas como una variable en `globals.css`.

**Ejemplo Correcto**:
```css
:root {
  --primary: oklch(0 0 0);
  --primary-foreground: oklch(1 0 0);
  --background: oklch(0.9900 0 0);
  --foreground: oklch(0 0 0);
}
```

### 2. `tailwind.config.ts` es un Espejo, no una Fuente

**Regla**: El archivo `tailwind.config.ts` solo debe referenciar las variables CSS de `globals.css`, utilizando la sintaxis correcta (ej. `hsl(var(--background))`).

**Mi Compromiso**: Me aseguraré de no duplicar valores ni anidar funciones de color (como `oklch(oklch(...))`). La configuración de Tailwind siempre reflejará lo que está definido en `globals.css`.

**Ejemplo Correcto**:
```typescript
colors: {
  primary: {
    DEFAULT: 'oklch(var(--primary))',
    foreground: 'oklch(var(--primary-foreground))'
  },
  background: 'oklch(var(--background))',
  foreground: 'oklch(var(--foreground))',
}
```

### 3. Cero Clases o Variables "Mágicas"

**Regla**: No se utilizarán clases de Tailwind (como `text-primary-blue`) que no se deriven de una variable CSS definida en `globals.css` y mapeada en `tailwind.config.ts`.

**Mi Compromiso**: No inventaré clases. Si una clase no funciona, identificaré si es porque la variable subyacente no está definida y te indicaré cómo solucionarlo desde la "fuente de la verdad" (`globals.css`).

**❌ Incorrecto**:
```jsx
<div className="text-primary-blue bg-custom-color">
```

**✅ Correcto**:
```jsx
<div className="text-primary bg-primary-foreground">
```

### 4. Prioridad Absoluta a las Clases de Utilidad del Tema

**Regla**: La estilización de componentes se realizará exclusivamente con las clases de utilidad generadas por tu tema (`bg-primary`, `text-foreground`, `border`, etc.).

**Mi Compromiso**: Evitaré el uso de estilos en línea (`style={{...}}`) y me opondré a crear CSS personalizado a menos que sea la única solución viable para un requisito específico que Tailwind no pueda manejar.

**❌ Evitar**:
```jsx
<Button style={{ backgroundColor: 'var(--primary-blue)' }}>
```

**✅ Preferir**:
```jsx
<Button variant="default" className="bg-primary text-primary-foreground">
```

## 🔧 Proceso de Trabajo

### Para Nuevos Colores/Tokens:
1. **Definir** en `app/globals.css` dentro de `:root` y `.dark`
2. **Mapear** en `tailwind.config.ts` usando la sintaxis correcta
3. **Usar** en componentes con clases de utilidad

### Para Nuevos Componentes:
1. **Verificar** variables CSS existentes en `globals.css`
2. **Usar** clases de utilidad del tema
3. **Evitar** estilos en línea o CSS personalizado

### Para Debugging de Estilos:
1. **Verificar** que la variable existe en `globals.css`
2. **Confirmar** que está mapeada en `tailwind.config.ts`
3. **Usar** la clase de utilidad correcta

## 📁 Estructura de Archivos

```
app/
├── globals.css          # 🎯 Única fuente de verdad para el tema
├── layout.tsx
└── ...

tailwind.config.ts       # 🔄 Espejo de globals.css

components/
├── ui/                  # Componentes base con clases del tema
└── ...
```

## 🚫 Anti-patrones a Evitar

- ❌ Variables CSS duplicadas
- ❌ Clases de Tailwind "mágicas"
- ❌ Estilos en línea (`style={{...}}`)
- ❌ CSS personalizado innecesario
- ❌ Valores hardcodeados en componentes

## ✅ Patrones Recomendados

- ✅ Variables CSS centralizadas en `globals.css`
- ✅ Clases de utilidad del tema
- ✅ Componentes reutilizables
- ✅ Configuración consistente en `tailwind.config.ts`
- ✅ Documentación de cambios en el tema

## 🔄 Flujo de Cambios

1. **Identificar** necesidad de cambio de estilo
2. **Verificar** variables existentes en `globals.css`
3. **Añadir** nueva variable si es necesario
4. **Mapear** en `tailwind.config.ts`
5. **Implementar** en componentes usando clases de utilidad
6. **Documentar** cambios si es necesario

---

**Última actualización**: Enero 2025
**Versión**: 1.0
**Proyecto**: FeelRite Medical Dashboard 