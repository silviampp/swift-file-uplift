
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PlanificacionData, DiaCalendario } from '../types/planificacion';
import { addDays, startOfWeek, endOfWeek, format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

interface PlanificacionContextType {
  planificacion: PlanificacionData | null;
  diasCalendario: DiaCalendario[];
  toggleDiaLectivo: (fecha: Date) => void;
  setPlanificacion: (data: PlanificacionData) => void;
}

const PlanificacionContext = createContext<PlanificacionContextType | undefined>(undefined);

export const usePlanificacion = () => {
  const context = useContext(PlanificacionContext);
  if (!context) {
    throw new Error('usePlanificacion must be used within a PlanificacionProvider');
  }
  return context;
};

export const PlanificacionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [planificacion, setPlanificacionState] = useState<PlanificacionData | null>(null);
  const [diasCalendario, setDiasCalendario] = useState<DiaCalendario[]>([]);

  const generarDiasCalendario = (data: PlanificacionData): DiaCalendario[] => {
    const dias: DiaCalendario[] = [];
    let fechaActual = data.calendarioEscolar.fechaInicio;
    
    while (fechaActual <= data.calendarioEscolar.fechaFin) {
      const diaSemana = fechaActual.getDay();
      const esFinde = diaSemana === 0 || diaSemana === 6;
      const esNoLectivo = data.calendarioEscolar.diasNoLectivos.some(
        dia => isSameDay(dia, fechaActual)
      );
      
      dias.push({
        fecha: new Date(fechaActual),
        esLectivo: !esFinde && !esNoLectivo,
        esFinde,
        esNoLectivo
      });
      
      fechaActual = addDays(fechaActual, 1);
    }
    
    return dias;
  };

  const setPlanificacion = (data: PlanificacionData) => {
    setPlanificacionState(data);
    setDiasCalendario(generarDiasCalendario(data));
  };

  const toggleDiaLectivo = (fecha: Date) => {
    setDiasCalendario(prev => 
      prev.map(dia => {
        if (isSameDay(dia.fecha, fecha) && !dia.esFinde) {
          return {
            ...dia,
            esLectivo: !dia.esLectivo,
            esNoLectivo: dia.esLectivo
          };
        }
        return dia;
      })
    );
  };

  return (
    <PlanificacionContext.Provider value={{
      planificacion,
      diasCalendario,
      toggleDiaLectivo,
      setPlanificacion
    }}>
      {children}
    </PlanificacionContext.Provider>
  );
};
