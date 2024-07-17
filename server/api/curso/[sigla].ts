import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { Database } from '../../../types/database.types.js'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const sigla = getRouterParam(event, 'sigla')
  
  if (!sigla) {
    throw createError({ statusCode: 400, statusMessage: 'La sigla no puede estar vacía' })
  }

  const client = await serverSupabaseClient<Database>(event)
  
  const { data, error } = await client
	.from('cursos')
	.select('*, secciones(*)')
	.eq('sigla', sigla)
  .single()
  
  if (error) {
	throw createError({ statusCode: 500, statusMessage: error.message })
  }
  
  console.log(data)
  return data
})