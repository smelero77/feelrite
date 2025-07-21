"use client";

import { useEffect } from 'react';

/**
 * Hook para suprimir warnings de hidratación causados por extensiones de navegador
 * que inyectan atributos como bis_skin_checked, __reactInternalInstance, etc.
 */
export function useSuppressHydrationWarnings() {
  useEffect(() => {
    // Guardamos la función original de console.error
    const originalError = console.error;

    // Sobrescribimos console.error para filtrar warnings específicos
    console.error = (...args: any[]) => {
      const errorMessage = args[0];
      
      if (typeof errorMessage === 'string') {
        // Suprimimos errores de hidratación causados por extensiones de navegador
        const isHydrationWarning = errorMessage.includes('A tree hydrated but some attributes of the server rendered HTML didn\'t match the client properties');
        const isBrowserExtensionAttribute = args.some((arg: any) => 
          typeof arg === 'string' && (
            arg.includes('bis_skin_checked') ||
            arg.includes('__reactInternalInstance') ||
            arg.includes('_hjRecordingLastActivity') ||
            arg.includes('_hjSessionUser_') ||
            arg.includes('_hjSessionTooLarge') ||
            arg.includes('data-focus-visible-added')
          )
        );

        if (isHydrationWarning && isBrowserExtensionAttribute) {
          // No mostramos este error específico
          return;
        }
      }

      // Para todos los otros errores, usamos la función original
      originalError.apply(console, args);
    };

    // Cleanup: restauramos la función original cuando el componente se desmonta
    return () => {
      console.error = originalError;
    };
  }, []);
} 