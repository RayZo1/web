export const API_BASE = "https://nervous_vi-406.e.jrnm.app"; // Your bot URL

export async function validateLicense(key: string) {
    try {
        const res = await fetch(`${API_BASE}/user/license?key=${key}`);
        if (!res.ok) return { status: "error" };
        return res.json();
    } catch (e) {
        return { status: "error" };
    }
}

export async function fetchAdminStats(token: string) {
    try {
        const res = await fetch(`${API_BASE}/admin/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        return null;
    }
}

export async function fetchAdminUsers(token: string) {
    try {
        const res = await fetch(`${API_BASE}/admin/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return [];
        const data = await res.json();
        // Convert object { "id": { ... } } to array [ { id, ... } ]
        return Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val }));
    } catch (e) {
        return [];
    }
}

export async function updateUserData(token: string, userId: string, update: any) {
    try {
        const res = await fetch(`${API_BASE}/admin/update`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: userId, ...update })
        });
        return res.json();
    } catch (e) {
        return { status: "error" };
    }
}

export async function publishVersion(token: string, version: string) {
    try {
        const res = await fetch(`${API_BASE}/admin/publish`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ version })
        });
        return res.json();
    } catch (e) {
        return { status: "error" };
    }
}
