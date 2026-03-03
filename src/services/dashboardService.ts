export interface Municipio {
  nome: string
  uf: string
  lat: number
  lng: number
  indice: number
  populacao: string
  area: string
  regiao: string
}

interface DashboardData {
  municipios: Municipio[]
  indices: string[]
}

const mockMunicipios: Municipio[] = [
  { nome: 'São Paulo', uf: 'SP', lat: -23.5505, lng: -46.6333, indice: 0.89, populacao: '12.3M', area: '1.521 km²', regiao: 'Sudeste' },
  { nome: 'Rio de Janeiro', uf: 'RJ', lat: -22.9068, lng: -43.1729, indice: 0.82, populacao: '6.7M', area: '1.200 km²', regiao: 'Sudeste' },
  { nome: 'Brasília', uf: 'DF', lat: -15.7942, lng: -47.8825, indice: 0.91, populacao: '3.0M', area: '5.779 km²', regiao: 'Centro-Oeste' },
  { nome: 'Salvador', uf: 'BA', lat: -12.9714, lng: -38.5014, indice: 0.71, populacao: '2.9M', area: '692 km²', regiao: 'Nordeste' },
  { nome: 'Fortaleza', uf: 'CE', lat: -3.7172, lng: -38.5433, indice: 0.68, populacao: '2.7M', area: '314 km²', regiao: 'Nordeste' },
  { nome: 'Manaus', uf: 'AM', lat: -3.1190, lng: -60.0217, indice: 0.75, populacao: '2.2M', area: '11.401 km²', regiao: 'Norte' },
  { nome: 'Curitiba', uf: 'PR', lat: -25.4284, lng: -49.2733, indice: 0.88, populacao: '1.9M', area: '435 km²', regiao: 'Sul' },
  { nome: 'Recife', uf: 'PE', lat: -8.0476, lng: -34.8770, indice: 0.72, populacao: '1.6M', area: '218 km²', regiao: 'Nordeste' },
  { nome: 'Porto Alegre', uf: 'RS', lat: -30.0346, lng: -51.2177, indice: 0.86, populacao: '1.5M', area: '497 km²', regiao: 'Sul' },
  { nome: 'Belém', uf: 'PA', lat: -1.4558, lng: -48.4902, indice: 0.63, populacao: '1.5M', area: '1.059 km²', regiao: 'Norte' },
]

const mockIndices: string[] = [
  'Saúde Materno-Infantil',
  'Cobertura de Atenção Básica',
  'Saneamento e Habitação',
  'Segurança Alimentar',
  'Acesso a Medicamentos',
]

export async function getDashboardData(): Promise<DashboardData> {
  await new Promise(resolve => setTimeout(resolve, 800))
  return { municipios: mockMunicipios, indices: mockIndices }
}