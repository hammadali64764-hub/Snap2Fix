import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function SideDrawer({ open, onClose, title = "Snap2Fix", items = [] }) {
  const navigate = useNavigate();

  const go = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <>
      {open && <button className="drawer-backdrop" onClick={onClose} aria-label="Close menu" />}
      <aside className={`side-drawer ${open ? "open" : ""}`}>
        <div className="drawer-head">
          <div>
            <span>Menu</span>
            <strong>{title}</strong>
          </div>
          <button onClick={onClose} className="drawer-close" aria-label="Close menu">
            <FaTimes />
          </button>
        </div>

        <nav className="drawer-nav">
          {items.map((item) => (
            <button key={item.path} onClick={() => go(item.path)}>
              {item.icon && <item.icon />}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
