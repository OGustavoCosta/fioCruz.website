export interface Municipio {
  nome: string
  uf: string
  indice: number
  populacao: string
  area: string
  regiao: string
  lat: number
  lng: number
}

export interface DashboardData {
  municipios: Municipio[]
  indices: string[]
}

// Para trocar por uma API real, substitua pela URL do endpoint:
// const API_URL = import.meta.env.VITE_API_URL ?? '/data/dashboard.json'
const API_URL = '/data/dashboard.json'

export async function getDashboardData(): Promise<DashboardData> {
  const response = await fetch(API_URL)
  if (!response.ok) throw new Error(`Erro ao carregar dados: ${response.status}`)
  return response.json()
}
