export const API_BASE = "https://nervous_vi-406.e.jrnm.app"; // Your bot URL

export async function validateLicense(key: string) {
    const res = await fetch(`${API_BASE}/user/license?key=${key}`);
    return res.json();
}

export async function adminAuth(license: string) {
    // We check if this license belongs to the OWNER_ID on the server-side
    // For the dashboard, we'll pass the license in the Authorization header
    const res = await fetch(`${API_BASE}/admin/stats`, {
        headers: {
            'Authorization': `Bearer ${license}`
        }
    });
    return res.json();
}
