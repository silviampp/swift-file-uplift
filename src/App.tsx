
import React, { useEffect } from 'react';
import { PlanificacionProvider, usePlanificacion } from './context/PlanificacionContext';
import CronogramaInteractivo from './components/CronogramaInteractivo';
import { PlanificacionData } from './types/planificacion';

// Datos de ejemplo para la demostración
const datosEjemplo: PlanificacionData = {
  unidadesDidacticas: [
    {
      id: '1',
      nombre: 'Introducción a la Programación',
      fechaInicio: new Date(2024, 8, 15), // Septiembre 15
      fechaFin: new Date(2024, 9, 31), // Octubre 31
      horasSemanales: 4,
      color: '#3B82F6'
    },
    {
      id: '2',
      nombre: 'Estructuras de Datos',
      fechaInicio: new Date(2024, 10, 1), // Noviembre 1
      fechaFin: new Date(2024, 11, 20), // Diciembre 20
      horasSemanales: 6,
      color: '#10B981'
    },
    {
      id: '3',
      nombre: 'Bases de Datos',
      fechaInicio: new Date(2025, 0, 8), // Enero 8
      fechaFin: new Date(2025, 1, 28), // Febrero 28
      horasSemanales: 5,
      color: '#F59E0B'
    }
  ],
  calendarioEscolar: {
    fechaInicio: new Date(2024, 8, 15), // Septiembre 15
    fechaFin: new Date(2025, 5, 30), // Junio 30
    diasNoLectivos: [
      new Date(2024, 9, 12), // Día del Pilar
      new Date(2024, 10, 1),  // Todos los Santos
      new Date(2024, 11, 6),  // Constitución
      new Date(2024, 11, 8),  // Inmaculada
      new Date(2024, 11, 25), // Navidad
      new Date(2025, 0, 1),   // Año Nuevo
      new Date(2025, 0, 6),   // Reyes
    ]
  },
  horarioClases: {
    diasSemana: [1, 2, 3, 4, 5], // Lunes a Viernes
    horasPorDia: 6
  }
};

const AppContent: React.FC = () => {
  const { setPlanificacion } = usePlanificacion();

  useEffect(() => {
    setPlanificacion(datosEjemplo);
  }, [setPlanificacion]);

  return <CronogramaInteractivo />;
};

const App: React.FC = () => {
  return (
    <PlanificacionProvider>
      <AppContent />
    </PlanificacionProvider>
  );
};

export default App;
