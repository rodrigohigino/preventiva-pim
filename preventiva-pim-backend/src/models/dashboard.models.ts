export interface PlanoAtrasado {
  plano_id: number;
  titulo: string;
  equipamento: string;
  codigo_equipamento: string;
  proxima_em: string | null;   // ISO date string ou null se não houver data
  dias_atraso: number;
  tecnico?: string;
}

export interface DashboardData {
  atrasados: number;
  previstos_7_dias: number;
  conformidade_mes: number;      // percentual 0-100
  execucoes_mes: number;
  lista_atrasados: PlanoAtrasado[];
}
