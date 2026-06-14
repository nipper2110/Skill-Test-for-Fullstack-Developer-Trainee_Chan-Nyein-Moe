import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];
const MAX_AVATAR_SIZE = 800 * 1024;

function ProfileSetting() {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [message, setMessage] = useState("");
  const [photoError, setPhotoError] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setTitle(user.title);
      setEmail(user.email);
    } else {
      api.profile.get().then((profile) => {
        setFullName(profile.fullName);
        setTitle(profile.title);
        setEmail(profile.email);
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSubmitting(true);
    setMessage("");
    setPhotoError("");
    try {
      await api.profile.update({ fullName, title, email });
      await refreshUser();
      setMessage("Profile updated successfully.");
    } catch {
      setMessage("Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setPhotoError("Please upload a JPG, GIF, or PNG file.");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setPhotoError("File must be 800K or smaller.");
      return;
    }

    setPhotoError("");
    setMessage("");
    setIsUploadingPhoto(true);

    try {
      const avatarUrl = await compressAvatarFile(file);
      await api.profile.update({ avatarUrl });
      await refreshUser();
      setMessage("Profile photo updated successfully.");
    } catch (error) {
      setPhotoError(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Failed to upload profile photo.",
      );
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
        <div className="border-b border-gray-100 pb-6">
          <h2 className="text-2xl font-bold text-gray-900">Profile settings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Update your photo and personal details here.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 py-8 text-center sm:flex-row sm:items-center sm:text-left">
          <div className="relative h-24 w-24 shrink-0">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div
                className={`flex h-24 w-24 items-center justify-center rounded-full text-2xl font-bold text-white ${user?.avatarColor ?? "bg-gray-400"}`}
              >
                {user?.initials ?? "U"}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPhoto}
              className="absolute right-0 bottom-0 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm disabled:opacity-50"
            >
              <Pencil className="h-3.5 w-3.5 text-gray-600" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-gray-900">Profile Photo</h3>
            <p className="text-xs font-medium text-gray-500">
              JPG, GIF or PNG. Max size of 800K.
            </p>
            {isUploadingPhoto && (
              <p className="text-xs font-medium text-blue-600">Uploading...</p>
            )}
            {photoError && (
              <p className="text-xs font-medium text-red-600">{photoError}</p>
            )}
          </div>
        </div>

        <div className="space-y-6 border-t border-gray-100 pt-8">
          {message && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              {message}
            </p>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-gray-600 uppercase">
                Full Name
              </label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 w-full rounded-lg border-gray-200 px-4"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-gray-600 uppercase">
                Title
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 w-full rounded-lg border-gray-200 px-4"
              />
            </div>
          </div>

          <div className="space-y-2 pb-6">
            <label className="text-xs font-bold tracking-wider text-gray-600 uppercase">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-lg border-gray-200 px-4"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-6 border-t border-gray-100 pt-8">
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
            className="h-11 rounded-lg bg-[#0b2aa0] px-6 text-sm font-semibold text-white hover:bg-[#071d70]"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function compressAvatarFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const maxSize = 256;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Failed to process image"));
        return;
      }

      context.drawImage(image, 0, 0, width, height);

      let quality = 0.9;
      let dataUrl = canvas.toDataURL("image/jpeg", quality);

      while (dataUrl.length > MAX_AVATAR_SIZE && quality > 0.4) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL("image/jpeg", quality);
      }

      if (dataUrl.length > MAX_AVATAR_SIZE) {
        reject(new Error("File must be 800K or smaller."));
        return;
      }

      resolve(dataUrl);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to read image file"));
    };

    image.src = objectUrl;
  });
}

export default ProfileSetting;
