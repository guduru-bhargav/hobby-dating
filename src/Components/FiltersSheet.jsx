import Icon from "./Icon";
import { AGE_BANDS, CITIES, GENDERS, HOBBIES } from "../lib/constants";

const SECTIONS = [
  { key: "age", title: "Age", options: AGE_BANDS.map((b) => ({ value: b.value, label: b.value })) },
  { key: "city", title: "City", options: CITIES.map((c) => ({ value: c, label: c })) },
  { key: "gender", title: "Show me", options: GENDERS.map((g) => ({ value: g.value, label: g.label })) },
  { key: "hobbies", title: "Hobbies", options: HOBBIES.map((h) => ({ value: h, label: h })) },
];

// Bottom sheet on phones, side panel on desktop (see Discover.css)
function FiltersSheet({ filters, onChange, onClose, onReset }) {
  const toggle = (key, value) => {
    const list = filters[key];
    onChange({
      ...filters,
      [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    });
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Filter people"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sheet-head">
          <h3>Filters</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close filters">
            <Icon name="x" size={18} />
          </button>
        </header>

        <div className="sheet-body">
          {SECTIONS.map((section) => (
            <section key={section.key} className="sheet-section">
              <h4>{section.title}</h4>
              <div className="chip-row">
                {section.options.map((opt) => {
                  const active = filters[section.key].includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={`chip chip-select ${active ? "active" : ""}`}
                      aria-pressed={active}
                      onClick={() => toggle(section.key, opt.value)}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <footer className="sheet-foot">
          <button type="button" className="btn btn-ghost" onClick={onReset}>
            Clear all
          </button>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Show results
          </button>
        </footer>
      </div>
    </div>
  );
}

export default FiltersSheet;
