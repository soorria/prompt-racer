// Need to scope the import to enable overriding the types
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as supabase from '@supabase/supabase-js'

declare module '@supabase/supabase-js' {
  interface User {
    userRole: 'admin' | 'user';
  }
}
