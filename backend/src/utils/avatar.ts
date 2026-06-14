const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif"];
const MAX_AVATAR_BYTES = 800 * 1024;

export function validateAvatarUrl(avatarUrl: string): string | null {
  const match = avatarUrl.match(
    /^data:(image\/(?:jpeg|png|gif));base64,([A-Za-z0-9+/=]+)$/,
  );

  if (!match) {
    return "Avatar must be a JPG, GIF, or PNG image.";
  }

  const mimeType = match[1];
  const base64 = match[2];

  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return "Avatar must be a JPG, GIF, or PNG image.";
  }

  const sizeInBytes = Math.ceil((base64.length * 3) / 4);
  if (sizeInBytes > MAX_AVATAR_BYTES) {
    return "Avatar must be 800K or smaller.";
  }

  return null;
}
