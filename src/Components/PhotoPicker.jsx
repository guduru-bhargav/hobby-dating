import React, { useEffect, useMemo } from "react";
import Icon from "./Icon";

// Photo upload tile with a live preview. Shows `currentUrl` until the user picks a new file.
function PhotoPicker({ label, file, currentUrl, onChange, onError }) {
  // Object URL for the picked file; revoked when the file changes or the tile unmounts
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const handle = (e) => {
    const picked = e.target.files?.[0] || null;
    if (!picked) return;
    if (!picked.type.startsWith("image/")) {
      onError?.("Photos must be image files");
      return;
    }
    if (picked.size > 5 * 1024 * 1024) {
      onError?.("Photos must be 5 MB or smaller");
      return;
    }
    onChange(picked);
  };

  const shown = preview || currentUrl;

  return (
    <label className="photo-tile">
      <input type="file" accept="image/*" onChange={handle} />
      {shown ? (
        <>
          <img src={shown} alt={label} />
          <span className="photo-tile-tag">
            <Icon name="camera" size={14} /> Change
          </span>
        </>
      ) : (
        <span className="photo-tile-empty">
          <Icon name="camera" size={24} />
          {label}
          <small style={{ fontWeight: 500 }}>JPG or PNG, 5 MB max</small>
        </span>
      )}
    </label>
  );
}

export default PhotoPicker;
