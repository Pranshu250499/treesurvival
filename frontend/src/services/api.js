// VrikshaSetu API Service Client
const BASE_URL = '';

export async function fetchOverviewStats() {
  const res = await fetch(`${BASE_URL}/api/analytics/overview`);
  if (!res.ok) throw new Error('Failed to fetch overview stats');
  return res.json();
}

export async function fetchTrees(params = {}) {
  const query = new URLSearchParams();
  if (params.drive_id) query.append('drive_id', params.drive_id);
  if (params.status) query.append('status', params.status);
  if (params.is_adopted !== undefined && params.is_adopted !== null) query.append('is_adopted', params.is_adopted);
  if (params.search) query.append('search', params.search);

  const res = await fetch(`${BASE_URL}/api/trees/?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch trees');
  return res.json();
}

export async function fetchTreeDetail(treeId) {
  const res = await fetch(`${BASE_URL}/api/trees/${treeId}`);
  if (!res.ok) throw new Error('Failed to fetch tree details');
  return res.json();
}

export async function fetchTreeByQR(treeCode) {
  const res = await fetch(`${BASE_URL}/api/trees/qr/${treeCode}`);
  if (!res.ok) throw new Error('Failed to fetch tree by QR');
  return res.json();
}

export async function adoptTree(treeId, guardianData) {
  const formData = new FormData();
  formData.append('guardian_name', guardianData.name);
  formData.append('guardian_phone', guardianData.phone);
  formData.append('guardian_role', guardianData.role || 'Citizen');

  const res = await fetch(`${BASE_URL}/api/trees/${treeId}/adopt`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Adoption failed');
  }
  return res.json();
}

export async function registerTree(treeData, photoFile) {
  const formData = new FormData();
  formData.append('species', treeData.species);
  formData.append('common_name', treeData.common_name);
  formData.append('lat', treeData.lat);
  formData.append('lng', treeData.lng);
  if (treeData.drive_id) formData.append('drive_id', treeData.drive_id);
  if (treeData.soil_type) formData.append('soil_type', treeData.soil_type);
  if (treeData.height_cm) formData.append('height_cm', treeData.height_cm);
  if (photoFile) formData.append('photo', photoFile);

  const res = await fetch(`${BASE_URL}/api/trees/register`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to register sapling');
  return res.json();
}

export async function logInspection(inspectionData, photoFile) {
  const formData = new FormData();
  formData.append('tree_id', inspectionData.tree_id);
  formData.append('inspector_name', inspectionData.inspector_name || 'Community Guardian');
  formData.append('inspector_role', inspectionData.inspector_role || 'Guardian');
  if (inspectionData.height_cm) formData.append('height_cm', inspectionData.height_cm);
  if (inspectionData.canopy_spread_cm) formData.append('canopy_spread_cm', inspectionData.canopy_spread_cm);
  if (inspectionData.soil_moisture_level) formData.append('soil_moisture_level', inspectionData.soil_moisture_level);
  formData.append('is_watered', inspectionData.is_watered ?? true);
  formData.append('is_weeded', inspectionData.is_weeded ?? true);
  formData.append('is_mulched', inspectionData.is_mulched ?? true);
  formData.append('pests_detected', inspectionData.pests_detected ?? false);
  if (inspectionData.lat) formData.append('lat', inspectionData.lat);
  if (inspectionData.lng) formData.append('lng', inspectionData.lng);
  if (photoFile) formData.append('photo', photoFile);
  if (inspectionData.photo_url_fallback) formData.append('photo_url_fallback', inspectionData.photo_url_fallback);

  const res = await fetch(`${BASE_URL}/api/inspections/log`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to log inspection');
  }
  return res.json();
}

export async function scanPhotoWithAI(photoFile) {
  const formData = new FormData();
  formData.append('photo', photoFile);

  const res = await fetch(`${BASE_URL}/api/inspections/ai-quick-scan`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('AI photo scan failed');
  return res.json();
}

export async function fetchDrives() {
  const res = await fetch(`${BASE_URL}/api/drives/`);
  if (!res.ok) throw new Error('Failed to fetch plantation drives');
  return res.json();
}

export async function advanceDriveEscrow(driveId) {
  const res = await fetch(`${BASE_URL}/api/drives/${driveId}/advance-escrow`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to advance escrow funding');
  return res.json();
}

export async function fetchSpeciesBreakdown() {
  const res = await fetch(`${BASE_URL}/api/analytics/species-breakdown`);
  if (!res.ok) throw new Error('Failed to fetch species analytics');
  return res.json();
}

export async function fetchLeaderboard() {
  const res = await fetch(`${BASE_URL}/api/analytics/leaderboard`);
  if (!res.ok) throw new Error('Failed to fetch leaderboard');
  return res.json();
}

export async function fetchRewards() {
  const res = await fetch(`${BASE_URL}/api/analytics/rewards`);
  if (!res.ok) throw new Error('Failed to fetch rewards');
  return res.json();
}

export async function redeemReward(rewardId, guardianPhone) {
  const res = await fetch(`${BASE_URL}/api/analytics/rewards/redeem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reward_id: rewardId, guardian_phone: guardianPhone }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Redemption failed');
  }
  return res.json();
}
