import React, { useEffect, useMemo, useRef } from "react";
import Icon from "./Icon";
import { MAX_PHOTO_BYTES } from "../lib/constants";

// One thumbnail: shows the file name pinned to the top, a remove button, and the preview.
// `item` is { id, file?, url?, name }. `file` (a newly picked File) and `url` (an already
// uploaded photo) are mutually exclusive.
function Thumb({ item, onRemove }) {
  const preview = useMemo(() => (item.file ? URL.createObjectURL(item.file) : item.url), [item.file, item.url]);
  useEffect(
    () => () => {
      if (item.file && preview) URL.revokeObjectURL(preview);
    },
    [item.file, preview]
  );

  return (
    <div className="mphoto-tile">
      <span className="mphoto-name" title={item.name}>{item.name}</span>
      <img src={preview} alt={item.name} />
      <button type="button" className="mphoto-remove" onClick={onRemove} aria-label={`Remove ${item.name}`}>
        <Icon name="x" size={13} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// A single "Add photo" control instead of fixed slots. Each pick appends a new photo (up to
// `max`); each thumbnail can be removed. Order in `items` becomes the save order (photo_1, photo_2, …).
function MultiPhotoPicker({ items, onAdd, onRemove, onError, max }) {
  const inputRef = useRef(null);
  const canAddMore = items.length < max;

  const handlePick = (e) => {
    const picked = e.target.files?.[0];
    e.target.value = ""; // lets the same file be picked again later if removed and re-added
    if (!picked) return;
    if (!picked.type.startsWith("image/")) {
      onError?.("Photos must be image files");
      return;
    }
    if (picked.size > MAX_PHOTO_BYTES) {
      onError?.("Photos must be 5 MB or smaller");
      return;
    }
    onAdd(picked);
  };

  return (
    <div className="mphoto-row">
      {items.map((item) => (
        <Thumb key={item.id} item={item} onRemove={() => onRemove(item.id)} />
      ))}

      {canAddMore && (
        <button type="button" className="mphoto-add" onClick={() => inputRef.current?.click()}>
          <Icon name="camera" size={22} />
          <span>Add photo</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        onChange={handlePick}
      />
    </div>
  );
}

export default MultiPhotoPicker;
