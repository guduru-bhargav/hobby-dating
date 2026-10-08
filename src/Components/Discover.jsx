import React, { useCallback, useEffect, useState } from "react";
import Icon from "./Icon";
import FiltersSheet from "./FiltersSheet";
import { EMPTY_FILTERS, countActiveFilters } from "../lib/filters";
import { fetchLikedIds, fetchProfiles, hasLikedMe, likeProfile, unlikeProfile } from "../api/discover";
import { calculateAge, errorMessage, parseHobbies, photoList, photoOf } from "../lib/utils";
import { DATING_INTENTS } from "../lib/constants";
import "./Discover.css";

const intentLabel = (value) => DATING_INTENTS.find((d) => d.value === value)?.label;

// A suggestion card, Instagram-suggested-accounts style: photo, name, a couple of hobbies,
// a heart that toggles (it never disappears from the feed), and a direct way to message.
function SuggestionCard({ profile, liked, busy, onToggleLike, onMessage, onOpenProfile }) {
  const age = calculateAge(profile.date_of_birth);
  const hobbies = parseHobbies(profile.hobbies);
  const name = profile.first_name || "Member";

  return (
    <article className="feed-card">
      <div className="feed-photo-wrap">
        <button type="button" className="feed-photo" onClick={onOpenProfile}
          aria-label={`View ${name}'s profile`}>
          <img src={photoOf(profile, 1)} alt={name} />
        </button>
        <button type="button" className={`feed-like ${liked ? "liked" : ""}`}
          onClick={onToggleLike} disabled={busy}
          aria-label={liked ? `Unlike ${name}` : `Like ${name}`} aria-pressed={liked}>
          <Icon name="heart" size={16} strokeWidth={liked ? 0 : 2.2} />
        </button>
      </div>

      <button type="button" className="feed-body" onClick={onOpenProfile}
        aria-label={`View ${name}'s profile`}>
        <h3>{name}{age !== null ? `, ${age}` : ""}</h3>
        {profile.location_city && <p>{profile.location_city}</p>}
        {hobbies.length > 0 && (
          <div className="chip-row">
            {hobbies.slice(0, 3).map((h) => <span key={h} className="chip">{h}</span>)}
          </div>
        )}
      </button>

      <button type="button" className="btn btn-ghost btn-sm feed-message" onClick={onMessage}>
        <Icon name="chat" size={15} /> Message
      </button>
    </article>
  );
}

// Full profile view. Used by Discover (tap a card) and by the chat (tap the header),
// so someone you've already liked or messaged can still be looked up again.
// `onMessage` is optional: omit it to show a read-only profile with no action button.
export function ProfileDetail({ profile, liked, onToggleLike, onMessage, onClose }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const photos = photoList(profile);
  const age = calculateAge(profile.date_of_birth);
  const hobbies = parseHobbies(profile.hobbies);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`${profile.first_name}'s profile`}>
      <div className="detail-sheet" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="icon-btn detail-close" onClick={onClose} aria-label="Close">
          <Icon name="x" size={18} />
        </button>

        <button type="button" className="detail-photo"
          onClick={() => setPhotoIndex((i) => (i + 1) % photos.length)}
          aria-label="Tap to see the next photo">
          <img src={photos[photoIndex]} alt={profile.first_name} />
          {photos.length > 1 && (
            <span className="deck-dots" aria-hidden="true">
              {photos.map((_, i) => <i key={i} className={i === photoIndex ? "on" : ""} />)}
            </span>
          )}
        </button>

        <div className="detail-body">
          <h2>{profile.first_name}{age !== null ? `, ${age}` : ""}</h2>
          {profile.location_city && <p className="pp-meta">{profile.location_city}</p>}
          {profile.dating_intent && <span className="pill-soft">{intentLabel(profile.dating_intent)}</span>}
          {hobbies.length > 0 && (
            <div className="chip-row">
              {hobbies.map((h) => <span key={h} className="chip">{h}</span>)}
            </div>
          )}
          <div className="detail-actions">
            {onMessage && (
              <button type="button" className="btn btn-primary btn-block" onClick={onMessage}>
                <Icon name="chat" size={18} /> Message {profile.first_name}
              </button>
            )}
            {onToggleLike && (
              <button type="button" className={`btn btn-block ${liked ? "btn-primary" : "btn-ghost"}`}
                onClick={onToggleLike}>
                <Icon name="heart" size={18} strokeWidth={liked ? 0 : 2} /> {liked ? "Liked" : "Like"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchModal({ profile, onMessage, onKeepBrowsing }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="It's a match">
      <div className="match-modal">
        <div className="match-hearts"><Icon name="heart" size={36} strokeWidth={0} /></div>
        <p className="eyebrow">It's a match</p>
        <h2>You and {profile.first_name} liked each other</h2>
        <div className="match-actions">
          <button type="button" className="btn btn-primary" onClick={onMessage}>
            <Icon name="chat" size={18} /> Send a message
          </button>
          <button type="button" className="btn btn-ghost" onClick={onKeepBrowsing}>
            Keep browsing
          </button>
        </div>
      </div>
    </div>
  );
}

// `profile` is the viewer's own profile row; its user_id is the auth id
function Discover({ profile: me, onMessage }) {
  const [profiles, setProfiles] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [match, setMatch] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [list, liked] = await Promise.all([
        fetchProfiles(me, filters),
        fetchLikedIds(me.user_id),
      ]);
      setProfiles(list);
      setLikedIds(liked);
    } catch (err) {
      setError(errorMessage(err, "Couldn't load profiles."));
    } finally {
      setLoading(false);
    }
  }, [me, filters]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const toggleLike = async (profile) => {
    if (busyId) return;
    setBusyId(profile.user_id);
    const alreadyLiked = likedIds.has(profile.user_id);

    try {
      if (alreadyLiked) {
        await unlikeProfile(me.user_id, profile.user_id);
        setLikedIds((prev) => {
          const next = new Set(prev);
          next.delete(profile.user_id);
          return next;
        });
      } else {
        await likeProfile(me.user_id, profile.user_id);
        setLikedIds((prev) => new Set(prev).add(profile.user_id));
        if (await hasLikedMe(me.user_id, profile.user_id)) {
          setMatch(profile);
        }
      }
    } catch (err) {
      setError(errorMessage(err, "Couldn't save that. Try again."));
    } finally {
      setBusyId(null);
    }
  };

  const activeCount = countActiveFilters(filters);

  return (
    <section className="discover">
      <header className="view-head">
        <div>
          <p className="eyebrow">Discover</p>
          <h1>Profile suggestions</h1>
        </div>
        <div className="view-head-actions">
          <button type="button" className="icon-btn" onClick={loadFeed} disabled={loading}
            aria-label="Refresh profiles">
            <Icon name="refresh" size={18} className={loading ? "spin" : ""} />
          </button>
          <button type="button" className="btn btn-ghost filter-btn" onClick={() => setShowFilters(true)}>
            <Icon name="filter" size={16} /> Filters
            {activeCount > 0 && <span className="count-badge">{activeCount}</span>}
          </button>
        </div>
      </header>

      {error && <div className="form-error" role="alert">{error}</div>}

      {loading && <div className="deck-state"><div className="spinner" /><p>Finding people…</p></div>}

      {!loading && profiles.length === 0 && !error && (
        <div className="deck-state empty">
          <div className="empty-icon"><Icon name="sparkle" size={28} /></div>
          <h3>No one here yet</h3>
          <p>
            {activeCount > 0
              ? "Nobody matches these filters. Try widening them."
              : "Check back soon, or tap refresh to look again."}
          </p>
          <div className="deck-state-actions">
            {activeCount > 0 && (
              <button type="button" className="btn btn-ghost" onClick={() => setFilters(EMPTY_FILTERS)}>
                Clear filters
              </button>
            )}
            <button type="button" className="btn btn-primary" onClick={loadFeed}>Refresh</button>
          </div>
        </div>
      )}

      {!loading && profiles.length > 0 && (
        <div className="feed-grid">
          {profiles.map((p) => (
            <SuggestionCard
              key={p.user_id}
              profile={p}
              liked={likedIds.has(p.user_id)}
              busy={busyId === p.user_id}
              onToggleLike={() => toggleLike(p)}
              onMessage={() => onMessage(p)}
              onOpenProfile={() => setViewing(p)}
            />
          ))}
        </div>
      )}

      {showFilters && (
        <FiltersSheet
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(EMPTY_FILTERS)}
          onClose={() => setShowFilters(false)}
        />
      )}

      {match && (
        <MatchModal
          profile={match}
          onMessage={() => {
            const target = match;
            setMatch(null);
            onMessage(target);
          }}
          onKeepBrowsing={() => setMatch(null)}
        />
      )}

      {viewing && (
        <ProfileDetail
          profile={viewing}
          liked={likedIds.has(viewing.user_id)}
          onToggleLike={() => toggleLike(viewing)}
          onClose={() => setViewing(null)}
          onMessage={() => {
            const target = viewing;
            setViewing(null);
            onMessage(target);
          }}
        />
      )}
    </section>
  );
}

export default Discover;
