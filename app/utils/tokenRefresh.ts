// utils/tokenRefresh.ts

const base_url = process.env.NEXT_PUBLIC_API_URL
export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    console.log("Attempting to refresh access token...");
    
    const res = await fetch(`${base_url}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      console.error("Token refresh failed:", res.status);
      return null;
    }

    const data = await res.json();
    console.log("Token refreshed successfully");
    
    return {
      accessToken: data.accessToken || data.access_token,
      refreshToken: data.refreshToken || data.refresh_token || refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    // Decode the payload (middle part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration (exp is in seconds, Date.now() is in milliseconds)
    if (!payload.exp) return false; // No expiration set
    
    const now = Math.floor(Date.now() / 1000);
    const expired = payload.exp < now;
    
    if (expired) {
      console.log("Token is expired");
    }
    
    return expired;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true; // Assume expired if we can't parse it
  }
}