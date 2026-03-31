import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bfyqmoyimyjwprvtzvmo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeXFtb3lpbXlqd3BydnR6dm1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4Mjg3NjYsImV4cCI6MjA4OTQwNDc2Nn0.gN_cxoGv-02j19qs16Wo5DEWdslWdhnizZTrtapNvBk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);