import { ref } from 'vue'
import { useSupabase } from '~/utils/supabase'

export const useEvents = async () => {
  const supabase = useSupabase()

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_time', { ascending: false })

  if (error) {
    console.error('Supabase events error:', error)
  }

  return {
    data: ref(data || [])
  }
}