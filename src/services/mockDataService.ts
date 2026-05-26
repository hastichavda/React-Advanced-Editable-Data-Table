import { DEPARTMENTS } from '../constants/table'
import type { Department, EmployeeRow } from '../types/table'

const FIRST_NAMES = [
  'Ava',
  'Noah',
  'Liam',
  'Emma',
  'Olivia',
  'Sophia',
  'Mason',
  'Ethan',
  'Mia',
  'Aria',
  'James',
  'Charlotte',
]

const LAST_NAMES = [
  'Johnson',
  'Patel',
  'Lee',
  'Walker',
  'Nguyen',
  'Smith',
  'Miller',
  'Davis',
  'Harris',
  'Wilson',
  'Clark',
  'Lewis',
]

const EMAIL_DOMAINS = ['example.com', 'enterprise.io', 'company.org']

const seededRandom = (seed: number): (() => number) => {
  let value = seed
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296
    return value / 4294967296
  }
}

const pickOne = <T,>(items: T[], random: () => number): T =>
  items[Math.floor(random() * items.length)]

export const generateMockEmployees = (count: number): EmployeeRow[] => {
  const random = seededRandom(42)

  return Array.from({ length: count }, (_, index) => {
    const firstName = pickOne(FIRST_NAMES, random)
    const lastName = pickOne(LAST_NAMES, random)
    const department = pickOne(DEPARTMENTS, random) as Department
    const emailDomain = pickOne(EMAIL_DOMAINS, random)
    const uniqueSuffix = index + 1

    return {
      id: `emp-${String(uniqueSuffix).padStart(5, '0')}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${uniqueSuffix}@${emailDomain}`,
      department,
      salary: 45_000 + Math.round(random() * 165_000),
      quantity: Math.round(random() * 500),
      experience: Number((random() * 25).toFixed(1)),
    }
  })
}

export const fetchMockEmployees = async (count: number): Promise<EmployeeRow[]> => {
  await new Promise((resolve) => window.setTimeout(resolve, 120))
  return generateMockEmployees(count)
}

export const saveMockEmployeeRow = async (row: EmployeeRow): Promise<EmployeeRow> => {
  await new Promise((resolve) => window.setTimeout(resolve, 400))
  return row
}
