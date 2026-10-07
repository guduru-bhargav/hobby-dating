import React, { useCallback, useEffect, useState } from "react";
import Icon from "./Icon";
import FiltersSheet from "./FiltersSheet";
import { EMPTY_FILTERS, countActiveFilters } from "../lib/filters";
import { fetchDeck, fetchSwipedIds, hasLikedMe, recordSwipe } from "../api/discover";
import { calculateAge, errorMessage, parseHobbies, photoOf } from "../lib/utils";
import { DATING_INTENTS } from "../lib/constants";
import "./Discover.css";

const intentLabel = (value) => DATING_INTENTS.find((d) => d.value === value)?.label;

function DiscoverCard({ profile, showSecond, onToggleSecond, onOpenProfile }) {
  const age = calculateAge(profile.date_of_birth);
  const hobbies = parseHobbies(profile.hobbies);

  return (
    <article className="deck-card">
      <button type="button" className="deck-photo" onClick={onToggleSecond}
        aria-label="Tap to see the other photo">
        <img src={showSecond ? photoOf(profile, 2) : photoOf(profile, 1)} alt={profile.first_name} />
        {profile.photo_2 && (
          <span className="deck-dots" aria-hidden="true">
            <i className={!showSecond ? "on" : ""} />
            <i className={showSecond ? "on" : ""} />
          </span>
        )}
      </button>

      {/* Tapping the info panel opens the full profile, same as tapping into a profile on Instagram */}
      <button type="button" className="deck-info" onClick={onOpenProfile}
        aria-label={`View ${profile.first_name}'s profile`}>
        <div className="deck-title">
          <h2>{profile.first_name}{age !== null ? `, ${age}` : ""}</h2>
          {profile.location_city && <p>{profile.location_city}</p>}
        </div>
        {profile.dating_intent && <span className="pill">{intentLabel(profile.dating_intent)}</span>}
        {hobbies.length > 0 && (
          <div className="chip-row">
            {hobbies.slice(0, 5).map((h) => <span key={h} className="chip">{h}</span>)}
          </div>
        )}
        <span className="deck-view-hint"><Icon name="arrowRight" size={14} /> View profile</span>
      </button>
    </article>
  );
}

// Full profile view. Used by Discover (tap a card) and by the chat (tap the header),
// so someone you've already swiped past or matched with can still be looked up again.
// `onMessage` is optional: omit it to show a read-only profile with no action button.
export function ProfileDetail({ profile, onMessage, onClose }) {
  const [showSecond, setShowSecond] = useState(false);
  const age = calculateAge(profile.date_of_birth);
  const hobbies = parseHobbies(profile.hobbies);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`${profile.first_name}'s profile`}>
      <div className="detail-sheet" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="icon-btn detail-close" onClick={onClose} aria-label="Close">
          <Icon name="x" size={18} />
        </button>

        <button type="button" className="detail-photo" onClick={() => setShowSecond((s) => !s)}
          aria-label="Tap to see the other photo">
          <img src={showSecond ? photoOf(profile, 2) : photoOf(profile, 1)} alt={profile.first_name} />
          {profile.photo_2 && (
            <span className="deck-dots" aria-hidden="true">
              <i className={!showSecond ? "on" : ""} />
              <i className={showSecond ? "on" : ""} />
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
          {onMessage && (
            <button type="button" className="btn btn-primary btn-block" onClick={onMessage}>
              <Icon name="chat" size={18} /> Message {profile.first_name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MatchModal({ profile, onMessage, onKeepSwiping }) {
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
          <button type="button" className="btn btn-ghost" onClick={onKeepSwiping}>
            Keep swiping
          </button>
        </div>
      </div>
    </div>
  );
}

// `profile` is the viewer's own profile row; its user_id is the auth id
function Discover({ profile: me, onMessage }) {
  const [deck, setDeck] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [match, setMatch] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [busy, setBusy] = useState(false);

  const loadDeck = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const swiped = await fetchSwipedIds(me.user_id);
      setDeck(await fetchDeck(me, filters, swiped));
    } catch (err) {
      setError(errorMessage(err, "Couldn't load profiles."));
    } finally {
      setLoading(false);
    }
  }, [me, filters]);

  useEffect(() => {
    loadDeck();
  }, [loadDeck]);

  const current = deck[0];

  const swipe = async (action) => {
    if (!current || busy) return;
    setBusy(true);
    setShowSecond(false);
    const target = current;

    try {
      await recordSwipe(me.user_id, target.user_id, action);
      setDeck((d) => d.slice(1));
      if (action === "like" && (await hasLikedMe(me.user_id, target.user_id))) {
        setMatch(target);
      }
    } catch (err) {
      setError(errorMessage(err, "Couldn't save that. Try again."));
    } finally {
      setBusy(false);
    }
  };

  // Keyboard shortcuts: ← pass, → like
  useEffect(() => {
    const onKey = (e) => {
      if (match || showFilters || viewing || e.target.matches("input, textarea, select")) return;
      if (e.key === "ArrowLeft") swipe("pass");
      if (e.key === "ArrowRight") swipe("like");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // swipe depends on the current card; re-bind when it changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.user_id, match, showFilters, viewing, busy]);

  const activeCount = countActiveFilters(filters);

  return (
    <section className="discover">
      <header className="view-head">
        <div>
          <p className="eyebrow">Discover</p>
          <h1>People near your interests</h1>
        </div>
        <button type="button" className="btn btn-ghost filter-btn" onClick={() => setShowFilters(true)}>
          <Icon name="filter" size={16} /> Filters
          {activeCount > 0 && <span className="count-badge">{activeCount}</span>}
        </button>
      </header>

      {error && <div className="form-error" role="alert">{error}</div>}

      {loading && <div className="deck-state"><div className="spinner" /><p>Finding people…</p></div>}

      {!loading && !current && !error && (
        <div className="deck-state empty">
          <div className="empty-icon"><Icon name="sparkle" size={28} /></div>
          <h3>You're all caught up</h3>
          <p>Try widening your filters or check back later for new members.</p>
          <div className="deck-state-actions">
            {activeCount > 0 && (
              <button type="button" className="btn btn-ghost" onClick={() => setFilters(EMPTY_FILTERS)}>
                Clear filters
              </button>
            )}
            <button type="button" className="btn btn-primary" onClick={loadDeck}>Refresh</button>
          </div>
        </div>
      )}

      {!loading && current && (
        <>
          <DiscoverCard
            key={current.user_id}
            profile={current}
            showSecond={showSecond}
            onToggleSecond={() => setShowSecond((s) => !s)}
            onOpenProfile={() => setViewing(current)}
          />

          <div className="deck-actions" aria-label="Actions">
            <button type="button" className="action action-pass" onClick={() => swipe("pass")}
              disabled={busy} aria-label="Pass">
              <Icon name="x" size={26} strokeWidth={2.5} />
            </button>
            <button type="button" className="action action-chat" onClick={() => onMessage(current)}
              disabled={busy} aria-label={`Message ${current.first_name}`}>
              <Icon name="chat" size={22} />
            </button>
            <button type="button" className="action action-like" onClick={() => swipe("like")}
              disabled={busy} aria-label="Like">
              <Icon name="heart" size={26} strokeWidth={2} />
            </button>
          </div>
          <p className="deck-hint">Use ← and → keys on desktop</p>
        </>
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
          onKeepSwiping={() => setMatch(null)}
        />
      )}

      {viewing && (
        <ProfileDetail
          profile={viewing}
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
