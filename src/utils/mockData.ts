import  { User, Tool, PromoCode } from '../types';

// This provides fallback data when API calls fail or database is not configured
export const mockUsers: User[] = [
  {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@eprojects.com',
    password: 'admin123',
    role: 'Admin',
    proDaysLeft: 9999,
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-2',
    username: 'joao',
    email: 'joao@example.com',
    password: '123456',
    role: 'Basic',
    proDaysLeft: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-3',
    username: 'maria',
    email: 'maria@example.com',
    password: '123456',
    role: 'Pro',
    proDaysLeft: 30,
    createdAt: new Date().toISOString()
  }
];

export const mockTools: Tool[] = [
  {
    id: 'tool-1',
    category: 'Mecânica',
    description: 'Calculadora Mecânica',
    link: '/calculadora-mecanica',
    accessLevel: 'Basic',
    isExternal: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tool-2',
    category: 'Elétrica',
    description: 'Calculadora Elétrica',
    link: '/calculadora-eletrica',
    accessLevel: 'Basic',
    isExternal: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tool-3',
    category: 'Mecânica',
    description: 'Conversão de Unidades',
    link: 'https://www.convertworld.com/pt/massa/',
    accessLevel: 'Basic',
    isExternal: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tool-4',
    category: 'Elétrica',
    description: 'Calculadora de Resistências',
    link: 'https://www.digikey.com/pt/resources/conversion-calculators/conversion-calculator-resistor-color-code',
    accessLevel: 'Basic',
    isExternal: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tool-5',
    category: 'Mecânica',
    description: 'Análise de Tensão Avançada',
    link: 'https://skyciv.com/free-beam-calculator/',
    accessLevel: 'Pro',
    isExternal: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tool-6',
    category: 'Elétrica',
    description: 'Simulador de Circuitos Pro',
    link: 'https://www.falstad.com/circuit/',
    accessLevel: 'Pro',
    isExternal: true,
    createdAt: new Date().toISOString()
  }
];

export const mockPromoCodes: PromoCode[] = [
  {
    id: 'promo-1',
    code: 'WELCOME30',
    daysGranted: 30,
    usesLeft: 10,
    totalUses: 10,
    createdAt: new Date().toISOString()
  },
  {
    id: 'promo-2',
    code: 'TRIAL7',
    daysGranted: 7,
    usesLeft: 5,
    totalUses: 20,
    createdAt: new Date().toISOString()
  }
];
 