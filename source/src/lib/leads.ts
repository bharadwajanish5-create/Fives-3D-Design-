/**
 * Lead submission. Replace the body with a call to your backend
 * (WordPress REST endpoint, HubSpot form API, CRM webhook…).
 * The preview build keeps details in the browser only.
 */
export type Lead = { pathway: string; interest: string; name: string; email: string; company: string; message: string };

export const LEAD_ENDPOINT: string | null = null; // e.g. '/wp-json/fives/v1/leads'

export async function submitLead(lead: Lead): Promise<{ ok: boolean; preview: boolean }> {
  if (!LEAD_ENDPOINT) {
    console.info('[preview] lead captured, not sent:', lead);
    return { ok: true, preview: true };
  }
  const res = await fetch(LEAD_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) });
  return { ok: res.ok, preview: false };
}
