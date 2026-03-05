const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;

export async function sendDiscordWebhook(content: string, embeds?: any[]) {
  if (!webhookUrl || webhookUrl === 'YOUR_DISCORD_WEBHOOK_URL_HERE') {
    console.warn('Discord webhook URL not configured');
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        embeds: embeds || [],
      }),
    });
  } catch (error) {
    console.error('Failed to send Discord webhook:', error);
  }
}

export function createLicenseEmbed(action: string, license: any, performedBy?: string) {
  const color = action === 'generated' ? 0x00ff00 :
                action === 'suspended' ? 0xffa500 :
                action === 'deleted' ? 0xff0000 : 0x0099ff;

  return {
    title: `License ${action.charAt(0).toUpperCase() + action.slice(1)}`,
    color,
    fields: [
      {
        name: 'License Key',
        value: license.license_key,
        inline: true
      },
      {
        name: 'User Mode',
        value: license.user_mode,
        inline: true
      },
      {
        name: 'Status',
        value: license.status,
        inline: true
      },
      ...(performedBy ? [{
        name: 'Performed By',
        value: performedBy,
        inline: false
      }] : [])
    ],
    timestamp: new Date().toISOString()
  };
}
