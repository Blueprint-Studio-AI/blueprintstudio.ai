// service-pages/lib/data.ts
import fs from 'fs/promises'
import path from 'path'
import { ServicePage } from '@/service-types/service-pages'

const DATA_DIR = path.join(process.cwd(), 'data')

export async function getAllServices(): Promise<{ slug: string }[]> {
  try {
    const servicesDir = path.join(DATA_DIR, 'services')
    const services = await fs.readdir(servicesDir)
    return services.map(slug => ({ slug }))
  } catch (err) {
    console.error('Error reading services directory:', (err as Error).message)
    throw err
  }
}

export async function getServiceData(slug: string): Promise<ServicePage> {
  try {
    const serviceDir = path.join(DATA_DIR, 'services', slug)
    
    // Load all required JSON files
    const metaData = await loadJson(path.join(serviceDir, 'meta.json'))
    const hero = await loadJson(path.join(serviceDir, 'hero.json'))
    const overview = await loadJson(path.join(serviceDir, 'overview.json'))
    const solutions = await loadJson(path.join(serviceDir, 'solutions.json'))
    const industryApplications = await loadJson(path.join(serviceDir, 'industry-applications.json'))
    const relatedServices = await loadJson(path.join(serviceDir, 'related-services.json'))
    const cta = await loadJson(path.join(serviceDir, 'cta.json'))
    
    return {
      meta: {
        ...metaData.meta, // Spread the meta object directly since it matches our structure
      },
      hero,
      overview,
      solutions,
      industryApplications,
      relatedServices,
      cta
    }
  } catch (err) {
    console.error('Error reading service data:', err)
    throw err
  }
}

async function loadJson(path: string) {
  const raw = await fs.readFile(path, 'utf-8')
  return JSON.parse(raw)
}