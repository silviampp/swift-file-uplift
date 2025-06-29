
export interface UnidadDidactica {
  id: string;
  nombre: string;
  fechaInicio: Date;
  fechaFin: Date;
  horasSemanales: number;
  color: string;
}

export interface DiaCalendario {
  fecha: Date;
  esLectivo: boolean;
  esFinde: boolean;
  esNoLectivo: boolean;
}

export interface CalendarioEscolar {
  fechaInicio: Date;
  fechaFin: Date;
  diasNoLectivos: Date[];
}

export interface HorarioClases {
  diasSemana: number[];
  horasPorDia: number;
}

export interface PlanificacionData {
  unidadesDidacticas: UnidadDidactica[];
  calendarioEscolar: CalendarioEscolar;
  horarioClases: HorarioClases;
}
