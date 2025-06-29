
import React, { useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { usePlanificacion } from '../context/PlanificacionContext';

const CronogramaInteractivo: React.FC = () => {
  const { planificacion, diasCalendario, toggleDiaLectivo } = usePlanificacion();

  if (!planificacion || diasCalendario.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Cargando cronograma...</p>
      </div>
    );
  }

  const mesesUnicos = [...new Set(diasCalendario.map(dia => 
    format(dia.fecha, 'yyyy-MM')
  ))];

  const getDiaClass = (dia: any) => {
    let baseClass = "h-10 border border-gray-200 cursor-pointer transition-colors text-xs flex items-center justify-center";
    
    if (dia.esFinde) {
      baseClass += " bg-gray-100 text-gray-400 cursor-not-allowed";
    } else if (dia.esNoLectivo) {
      baseClass += " bg-red-100 text-red-600 hover:bg-red-200";
    } else if (dia.esLectivo) {
      baseClass += " bg-green-100 text-green-600 hover:bg-green-200";
    } else {
      baseClass += " bg-yellow-100 text-yellow-600 hover:bg-yellow-200";
    }
    
    return baseClass;
  };

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-gray-50 p-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Cronograma Interactivo</h2>
        <p className="text-sm text-gray-600 mt-1">
          Haz clic en los días para cambiar entre lectivo/no lectivo
        </p>
      </div>

      {/* Cronograma Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Fixed Column - Unidades Didácticas */}
        <div className="w-64 bg-gray-50 border-r flex-shrink-0">
          <div className="h-20 border-b bg-gray-100 flex items-center px-4">
            <h3 className="font-semibold text-gray-700">Unidades Didácticas</h3>
          </div>
          <div className="overflow-y-auto" style={{ height: 'calc(100% - 5rem)' }}>
            {planificacion.unidadesDidacticas.map((unidad, index) => (
              <div 
                key={unidad.id}
                className="h-12 flex items-center px-4 border-b border-gray-200"
                style={{ backgroundColor: `${unidad.color}20` }}
              >
                <div className="w-4 h-4 rounded mr-3" style={{ backgroundColor: unidad.color }}></div>
                <span className="text-sm font-medium text-gray-700 truncate">
                  {unidad.nombre}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable Calendar Area */}
        <div className="flex-1 overflow-x-auto">
          <div className="min-w-max">
            {/* Header con días */}
            <div className="h-20 bg-gray-100 border-b flex">
              {diasCalendario.map((dia, index) => (
                <div key={index} className="w-12 border-r border-gray-200 flex flex-col">
                  <div className="h-6 text-xs text-center text-gray-500 pt-1">
                    {format(dia.fecha, 'EEE', { locale: es })}
                  </div>
                  <div className="h-6 text-xs text-center font-medium text-gray-700">
                    {format(dia.fecha, 'd')}
                  </div>
                  <div className="h-8 text-xs text-center text-gray-400">
                    {format(dia.fecha, 'MMM', { locale: es })}
                  </div>
                </div>
              ))}
            </div>

            {/* Rows de Unidades Didácticas */}
            <div>
              {planificacion.unidadesDidacticas.map((unidad, unidadIndex) => (
                <div key={unidad.id} className="h-12 flex border-b border-gray-200">
                  {diasCalendario.map((dia, diaIndex) => (
                    <div
                      key={diaIndex}
                      className={getDiaClass(dia)}
                      style={{ width: '3rem' }}
                      onClick={() => !dia.esFinde ? toggleDiaLectivo(dia.fecha) : undefined}
                    >
                      {dia.esLectivo && !dia.esFinde && (
                        <div 
                          className="w-8 h-8 rounded opacity-60"
                          style={{ backgroundColor: unidad.color }}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leyenda */}
      <div className="bg-gray-50 p-4 border-t">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
            <span>Día lectivo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
            <span>Día no lectivo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
            <span>Fin de semana</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CronogramaInteractivo;
