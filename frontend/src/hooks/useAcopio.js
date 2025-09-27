// src/hooks/useAcopio.js
import { useState, useCallback } from 'react';
import { fetchApi } from '../services/api';

// useAcopio.js
export function useAcopio() {
  const [acopios, setAcopios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función existente - Listar todos los acopios
  const getAcopio = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchApi('/api/acopio/listarAcopios');
      const data = response.data || [];
      setAcopios(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al obtener centros de acopio';
      setError(errorMessage);
      console.error('Error obteniendo acopios:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obtener coordenadas de acopios (IMPLEMENTADO)
  const getAcopioCoordenadas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchApi('/api/acopio/listarAcopiosCoordenadas');
      return response.data || [];
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al obtener coordenadas';
      setError(errorMessage);
      console.error('Error obteniendo coordenadas:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ======= OPERACIONES CRUD PREPARADAS PARA BACKEND =======

  // Crear nuevo centro de acopio (PENDIENTE EN BACKEND)
  const crearAcopio = useCallback(async (acopioData) => {
    setLoading(true);
    setError(null);
    try {
      // Validar datos obligatorios
      if (!acopioData.nombre?.trim()) {
        throw new Error('El nombre es obligatorio');
      }

      // Validar coordenadas si se proporcionan
      if (acopioData.latitud && (acopioData.latitud < -90 || acopioData.latitud > 90)) {
        throw new Error('La latitud debe estar entre -90 y 90');
      }
      if (acopioData.longitud && (acopioData.longitud < -180 || acopioData.longitud > 180)) {
        throw new Error('La longitud debe estar entre -180 y 180');
      }

      console.warn('⚠️ API no implementada en backend: POST /api/acopio/crear');
      console.log('Datos a enviar:', acopioData);
      
      // TODO: Descomentar cuando el backend esté listo
      // const response = await fetchApi('/api/acopio/crear', {
      //   method: 'POST',
      //   body: JSON.stringify(acopioData)
      // });
      // await getAcopio(); // Refrescar lista
      // return response.data;
      
      // Simulación temporal para desarrollo
      const nuevoAcopio = {
        id: Date.now(),
        ...acopioData,
        created_at: new Date().toISOString()
      };
      
      return { 
        ok: true,
        data: nuevoAcopio, 
        message: 'Centro de acopio creado exitosamente (simulación)' 
      };
    } catch (err) {
      const errorMessage = err.message || 'Error al crear centro de acopio';
      setError(errorMessage);
      console.error('Error creando acopio:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener centro por ID (PENDIENTE EN BACKEND)
  const getAcopioById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      console.warn('⚠️ API no implementada en backend: GET /api/acopio/obtener/' + id);
      
      // TODO: Descomentar cuando el backend esté listo
      // const response = await fetchApi(`/api/acopio/obtener/${id}`);
      // return response.data;
      
      // Alternativa temporal: buscar en la lista local
      const acopio = acopios.find(a => a.id === parseInt(id));
      if (acopio) {
        return { ok: true, data: acopio };
      }
      
      throw new Error('Centro de acopio no encontrado');
    } catch (err) {
      const errorMessage = err.message || 'Error al obtener centro de acopio';
      setError(errorMessage);
      console.error('Error obteniendo acopio por ID:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [acopios]);

  // Actualizar centro de acopio (PENDIENTE EN BACKEND)
  const actualizarAcopio = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      // Validar datos si se proporcionan
      if (updateData.latitud && (updateData.latitud < -90 || updateData.latitud > 90)) {
        throw new Error('La latitud debe estar entre -90 y 90');
      }
      if (updateData.longitud && (updateData.longitud < -180 || updateData.longitud > 180)) {
        throw new Error('La longitud debe estar entre -180 y 180');
      }

      console.warn('⚠️ API no implementada en backend: PUT /api/acopio/actualizar/' + id);
      console.log('Datos a actualizar:', updateData);
      
      // TODO: Descomentar cuando el backend esté listo
      // const response = await fetchApi(`/api/acopio/actualizar/${id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(updateData)
      // });
      // await getAcopio(); // Refrescar lista
      // return response.data;
      
      // Simulación temporal
      return { 
        ok: true,
        data: { id: parseInt(id), ...updateData, updated_at: new Date().toISOString() }, 
        message: 'Centro de acopio actualizado exitosamente (simulación)' 
      };
    } catch (err) {
      const errorMessage = err.message || 'Error al actualizar centro de acopio';
      setError(errorMessage);
      console.error('Error actualizando acopio:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar centro de acopio (PENDIENTE EN BACKEND)
  const eliminarAcopio = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      console.warn('⚠️ API no implementada en backend: DELETE /api/acopio/eliminar/' + id);
      
      // TODO: Descomentar cuando el backend esté listo
      // const response = await fetchApi(`/api/acopio/eliminar/${id}`, {
      //   method: 'DELETE'
      // });
      // await getAcopio(); // Refrescar lista
      // return response.data;
      
      // Simulación temporal
      return { 
        ok: true,
        data: { id: parseInt(id), eliminado: true }, 
        message: 'Centro de acopio eliminado exitosamente (simulación)' 
      };
    } catch (err) {
      const errorMessage = err.message || 'Error al eliminar centro de acopio';
      setError(errorMessage);
      console.error('Error eliminando acopio:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener centros por zona (PENDIENTE EN BACKEND)
  const getAcopiosByZona = useCallback(async (zonaId) => {
    setLoading(true);
    setError(null);
    try {
      console.warn('⚠️ API no implementada en backend: GET /api/acopio/zona/' + zonaId);
      
      // TODO: Descomentar cuando el backend esté listo
      // const response = await fetchApi(`/api/acopio/zona/${zonaId}`);
      // return response.data;
      
      // Alternativa temporal: filtrar de la lista local
      const acopiosFiltrados = acopios.filter(a => a.zona_id === parseInt(zonaId));
      return { 
        ok: true, 
        data: acopiosFiltrados,
        message: `Centros de zona ${zonaId} obtenidos exitosamente` 
      };
    } catch (err) {
      const errorMessage = err.message || 'Error al obtener centros por zona';
      setError(errorMessage);
      console.error('Error obteniendo acopios por zona:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [acopios]);

  // Validar datos de acopio
  const validarDatosAcopio = useCallback((datos) => {
    const errores = [];

    if (!datos.nombre?.trim()) {
      errores.push('El nombre es obligatorio');
    }

    if (datos.latitud !== null && datos.latitud !== undefined) {
      if (isNaN(datos.latitud) || datos.latitud < -90 || datos.latitud > 90) {
        errores.push('La latitud debe estar entre -90 y 90');
      }
    }

    if (datos.longitud !== null && datos.longitud !== undefined) {
      if (isNaN(datos.longitud) || datos.longitud < -180 || datos.longitud > 180) {
        errores.push('La longitud debe estar entre -180 y 180');
      }
    }

    if (datos.zona_id && isNaN(datos.zona_id)) {
      errores.push('El ID de zona debe ser un número válido');
    }

    // Validar formato de horario si se proporciona
    if (datos.horario && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(datos.horario)) {
      errores.push('El formato de horario debe ser HH:MM-HH:MM (ej: 08:00-17:00)');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }, []);

  // Función de refresco
  const refreshAcopios = useCallback(() => {
    return getAcopio();
  }, []);

  return {
    // Estado
    acopios,
    loading,
    error,
    
    // Operaciones implementadas
    getAcopio,
    getAcopioCoordenadas,
    
    // Operaciones CRUD preparadas (pendientes en backend)
    crearAcopio,
    getAcopioById,
    actualizarAcopio,
    eliminarAcopio,
    getAcopiosByZona,
    
    // Utilidades
    validarDatosAcopio,
    refreshAcopios,
    
    // Limpiar estado
    clearError: () => setError(null)
  };
}