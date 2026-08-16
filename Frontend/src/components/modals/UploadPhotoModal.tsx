import React, { useState } from 'react';
import { useUploadPhotoMutation } from '../../hooks/useTripPhotos';

interface UploadPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: number | string;
  destinationName: string;
}

export const UploadPhotoModal: React.FC<UploadPhotoModalProps> = ({
  isOpen,
  onClose,
  tripId,
  destinationName,
}) => {
  const [photoUrl, setPhotoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [locationName, setLocationName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  const uploadMutation = useUploadPhotoMutation();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoUrl(result);
        setPreviewUrl(result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const finalUrl = photoUrl.trim() || previewUrl.trim();
    if (!finalUrl) {
      setError('Please select an image file or provide a valid image URL');
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        tripId,
        payload: {
          url: finalUrl,
          title: title.trim() || `${destinationName} Memory`,
          locationName: locationName.trim() || destinationName,
        },
      });
      // Reset form
      setPhotoUrl('');
      setTitle('');
      setLocationName('');
      setPreviewUrl('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to upload photo');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1C18]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#FAF8F3] text-[#242924] border border-[#E8E2D5] shadow-2xl rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#1B3022] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
            </div>
            <div>
              <h2 className="font-headline-lg text-xl font-bold text-[#242924]">
                Upload Memory Photo
              </h2>
              <p className="font-body-base text-xs text-[#737973]">
                Add photos to your {destinationName} travel album
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F1EDE7] hover:bg-[#E8E2D5] text-[#242924] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Picker / Drag Drop */}
          <div>
            <label className="block text-[11px] font-bold text-[#737973] uppercase tracking-wider mb-1.5">
              Select Image File
            </label>
            <div className="relative border-2 border-dashed border-[#8FA88E]/40 hover:border-[#1B3022] rounded-2xl p-4 text-center bg-white transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[32px] text-[#1B3022]">
                  cloud_upload
                </span>
                <span className="font-body-semibold text-xs text-[#242924]">
                  Click or drag photo file here
                </span>
                <span className="font-label-caps text-[10px] text-[#737973]">
                  PNG, JPG, WEBP up to 5MB
                </span>
              </div>
            </div>
          </div>

          {/* Or Image URL Input */}
          <div>
            <label className="block text-[11px] font-bold text-[#737973] uppercase tracking-wider mb-1.5">
              Or Image Web URL
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => {
                setPhotoUrl(e.target.value);
                setPreviewUrl(e.target.value);
              }}
              placeholder="https://example.com/my-photo.jpg"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E8E2D5] text-xs font-semibold text-[#242924] placeholder-[#A59E93] focus:outline-none focus:border-[#1B3022] transition-colors"
            />
          </div>

          {/* Image Preview if available */}
          {previewUrl && (
            <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-[#E8E2D5] bg-[#1B3022]">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setError('Unable to load image from provided URL')}
              />
            </div>
          )}

          {/* Photo Caption / Title */}
          <div>
            <label className="block text-[11px] font-bold text-[#737973] uppercase tracking-wider mb-1.5">
              Photo Title / Caption
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`e.g. Sunset over ${destinationName}`}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E8E2D5] text-xs font-semibold text-[#242924] placeholder-[#A59E93] focus:outline-none focus:border-[#1B3022] transition-colors"
            />
          </div>

          {/* Location Name */}
          <div>
            <label className="block text-[11px] font-bold text-[#737973] uppercase tracking-wider mb-1.5">
              Specific Location / Attraction
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder={`e.g. Beach Promenade, ${destinationName}`}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E8E2D5] text-xs font-semibold text-[#242924] placeholder-[#A59E93] focus:outline-none focus:border-[#1B3022] transition-colors"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#E8E2D5] text-xs font-body-semibold text-[#737973] hover:bg-[#F1EDE7] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadMutation.isPending}
              className="px-6 py-2.5 rounded-full bg-[#1B3022] hover:bg-[#2c4634] text-white text-xs font-body-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {uploadMutation.isPending ? (
                <span className="material-symbols-outlined animate-spin text-[16px]">
                  progress_activity
                </span>
              ) : (
                <>
                  <span>Save Photo</span>
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPhotoModal;
