
import React, { useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, isSameDay } from 'date-fns';
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

  const getDiaClass = (dia: any) => {
    let baseClass = "h-12 border-r border-gray-300 cursor-pointer transition-colors text-xs flex items-center justify-center relative";
    
    if (dia.esFinde) {
      baseClass += " bg-gray-200 text-gray-500 cursor-not-allowed";
    } else if (dia.esNoLectivo) {
      baseClass += " bg-red-50 hover:bg-red-100";
    } else if (dia.esLectivo) {
      baseClass += " bg-white hover:bg-gray-50";
    } else {
      baseClass += " bg-yellow-50 hover:bg-yellow-100";
    }
    
    return baseClass;
  };

  const isUnidadActivaEnDia = (unidad: any, dia: any) => {
    return isWithinInterval(dia.fecha, { start: unidad.fechaInicio, end: unidad.fechaFin }) && dia.esLectivo && !dia.esFinde;
  };

  const mesesHeaders = React.useMemo(() => {
    const meses: { [key: string]: number } = {};
    diasCalendario.forEach(dia => {
      const mesKey = format(dia.fecha, 'yyyy-MM');
      meses[mesKey] = (meses[mesKey] || 0) + 1;
    });
    return meses;
  }, [diasCalendario]);

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      {/* Header Principal */}
      <div className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">CRONOGRAMA DE GANTT</h1>
        <p className="text-blue-100 mt-1">
          Calendario de Días Lectivos - Haz clic en los días para cambiar su estado (no se pueden modificar sábados y domingos)
        </p>
      </div>

      {/* Container Principal */}
      <div className="flex-1 flex overflow-hidden border-2 border-blue-400">
        {/* Columna Fija - Actividades */}
        <div className="w-80 bg-teal-400 border-r-2 border-blue-400 flex-shrink-0">
          <div className="h-20 bg-teal-500 border-b-2 border-blue-400 flex items-center justify-center">
            <h3 className="font-bold text-white text-lg">ACTIVIDADES</h3>
          </div>
          <div className="h-16 bg-teal-400 border-b-2 border-blue-400 flex items-center justify-center">
            <h4 className="font-semibold text-white">TIEMPO DE DURACIÓN</h4>
          </div>
          <div className="overflow-y-auto" style={{ height: 'calc(100% - 9rem)' }}>
            {planificacion.unidadesDidacticas.map((unidad, index) => (
              <div 
                key={unidad.id}
                className="h-16 flex items-center px-4 border-b border-teal-500 bg-teal-400"
              >
                <div className="text-white text-sm font-medium leading-tight">
                  {unidad.nombre}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Área Scrolleable - Cronograma */}
        <div className="flex-1 overflow-x-auto bg-white">
          <div className="min-w-max">
            {/* Header de Meses */}
            <div className="h-20 bg-teal-500 border-b-2 border-blue-400 flex">
              {Object.entries(mesesHeaders).map(([mesKey, dias]) => (
                <div 
                  key={mesKey}
                  className="border-r-2 border-blue-400 flex items-center justify-center text-white font-bold"
                  style={{ width: `${dias * 48}px` }}
                >
                  {format(new Date(mesKey + '-01'), 'MMMM', { locale: es }).toUpperCase()}
                </div>
              ))}
            </div>

            {/* Header de Días */}
            <div className="h-16 bg-teal-400 border-b-2 border-blue-400 flex">
              {diasCalendario.map((dia, index) => (
                <div 
                  key={index} 
                  className="w-12 border-r border-teal-500 flex flex-col items-center justify-center text-white text-xs font-medium"
                >
                  <div>{format(dia.fecha, 'd')}</div>
                  <div>{format(dia.fecha, 'EEE', { locale: es }).charAt(0).toUpperCase()}</div>
                </div>
              ))}
            </div>

            {/* Filas de Unidades Didácticas */}
            <div>
              {planificacion.unidadesDidacticas.map((unidad, unidadIndex) => (
                <div key={unidad.id} className="h-16 flex border-b border-gray-300">
                  {diasCalendario.map((dia, diaIndex) => (
                    <div
                      key={diaIndex}
                      className={getDiaClass(dia)}
                      style={{ width: '3rem' }}
                      onClick={() => !dia.esFinde ? toggleDiaLectivo(dia.fecha) : undefined}
                    >
                      {/* Barra de la unidad didáctica */}
                      {isUnidadActivaEnDia(unidad, dia) && (
                        <div 
                          className="absolute inset-1 rounded opacity-80"
                          style={{ backgroundColor: unidad.color }}
                        ></div>
                      )}
                      
                      {/* Indicador de estado del día */}
                      <div className="relative z-10 text-xs">
                        {dia.esNoLectivo && !dia.esFinde && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leyenda */}
      <div className="bg-gray-50 p-4 border-t-2 border-blue-400">
        <div className="flex items-center gap-6 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
            <span>Día lectivo disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 border border-red-200 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            <span>Día no lectivo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div>
            <span>Fin de semana (no modificable)</span>
          </div>
          {planificacion.unidadesDidacticas.map((unidad) => (
            <div key={unidad.id} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded opacity-80" 
                style={{ backgroundColor: unidad.color }}
              ></div>
              <span>{unidad.nombre}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CronogramaInteractivo;
