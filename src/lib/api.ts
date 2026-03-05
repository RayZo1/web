const API_BASE = "https://nervous_vi-406.e.jrnm.app"; // Your backend URL

export interface LicenseData {
    status: string;
    username: string;
    expiry: string;
    hwid: string | null;
    version: string;
}

export const validateLicense = async (key: string): Promise<any> => {
    const res = await fetch(`${API_BASE}/user/license?key=${key}`);
    return res.json();
};

export const fetchAdminStats = async (secret: string) => {
    const res = await fetch(`${API_BASE}/admin/stats`, {
        headers: { 'Authorization': secret }
    });
    return res.json();
};

export const fetchAdminUsers = async (secret: string) => {
    const res = await fetch(`${API_BASE}/admin/users`, {
        headers: { 'Authorization': secret }
    });
    return res.json();
};

export const updateUserData = async (secret: string, userId: string, data: any) => {
    const res = await fetch(`${API_BASE}/admin/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': secret
        },
        body: JSON.stringify({ user_id: userId, ...data })
    });
    return res.json();
};

export const publishVersion = async (secret: string, version: string) => {
    const res = await fetch(`${API_BASE}/admin/publish`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': secret
        },
        body: JSON.stringify({ version })
    });
    return res.json();
};
