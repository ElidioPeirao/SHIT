import  { Tool } from '../types';

// Initial tool data to populate the database if empty
export const initialTools: Tool[] = [
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

// Initial admin user
export const initialAdmin = {
  id: 'admin-1',
  username: 'admin',
  email: 'admin@eprojects.com',
  password: 'admin123',
  role: 'Admin',
  proDaysLeft: 9999,
  createdAt: new Date().toISOString()
};
 