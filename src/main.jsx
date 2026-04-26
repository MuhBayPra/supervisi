import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import './index.css'
import App from './App.jsx'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase;
if (supabaseUrl && supabaseKey && supabaseUrl !== 'YOUR_SUPABASE_URL') {
  supabase = createClient(supabaseUrl, supabaseKey)
} else {
  console.warn('Supabase credentials not found or not set, falling back to localStorage');
}

if (!window.storage) {
  window.storage = {
    get: async (key) => {
      if (supabase) {
        const { data, error } = await supabase
          .from('app_storage')
          .select('value')
          .eq('key', key)
          .maybeSingle();
        
        if (data && data.value) return { value: data.value };
        return null;
      } else {
        const val = localStorage.getItem(key);
        return val ? { value: val } : null;
      }
    },
    set: async (key, value) => {
      if (supabase) {
        await supabase
          .from('app_storage')
          .upsert({ key, value });
      } else {
        localStorage.setItem(key, value);
      }
    }
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
