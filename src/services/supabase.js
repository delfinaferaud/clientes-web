import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vtxtdxajpbxrgfkkuppt.supabase.co";
const SUPABASE_KEY = "sb_publishable_X8Yg_Bv0sROIAG56V47rfg_43HvAgn9";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);