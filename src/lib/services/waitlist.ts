
import { createClient } from '@/lib/supabase/client';

export type WaitlistStatus = 'pending' | 'approved' | 'rejected';

export interface WaitlistRequest {
    id: string;
    email: string;
    status: WaitlistStatus;
    created_at: string;
}

export async function joinWaitlist(email: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('waitlist_requests')
        .insert([{ email }])
        .select()
        .single();

    if (error) {
        if (error.code === '23505') { // Unique violation
            return { error: 'Email already on waitlist' };
        }
        return { error: error.message };
    }

    return { data };
}

export async function validateInviteCode(code: string) {
    const supabase = createClient();

    // First check if code exists and is valid
    // We use the RPC function if available for atomicity, or fallback to client-side check if easier for MVP
    // But since we wrote the migration with 'anyone can select', let's just query it for MVP
    // Ideally, use the RPC: validate_and_use_invite_code if you want to use it immediately
    // But validation might just be "check if valid" before use.

    const { data, error } = await supabase
        .from('invite_codes')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .single();

    if (error || !data) {
        return { valid: false, error: 'Invalid invite code' };
    }

    // Check limits
    if (data.max_uses && data.uses_count >= data.max_uses) {
        return { valid: false, error: 'Invite code fully used' };
    }

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return { valid: false, error: 'Invite code expired' };
    }

    return { valid: true, codeData: data };
}

export async function useInviteCode(code: string) {
    // This should ideally happen transactionally during signup
    // For now, we can manually increment or use the RPC
    const supabase = createClient();

    // We'll trust the signup process to call this or rely on a trigger?
    // Let's us the RPC if we added it, or manual update

    // Attempt to use RPC
    const { data: success, error } = await supabase
        .rpc('validate_and_use_invite_code', { code_input: code });

    if (error) {
        // Fallback to manual update if RPC doesn't exist (e.g. migration issue)
        // But this is insecure if RLS blocks update. 
        // Admin or service role needed for update usually if RLS is strict.
        // But we didn't add UPDATE policy for anon!
        // So this MUST be done via RPC which has SECURITY DEFINER.
        return { success: false, error: error.message };
    }

    return { success };
}
