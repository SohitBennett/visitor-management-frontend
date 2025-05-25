// src/components/ui/button.js
export function Button({ children, onClick, type = "button", className = "" }) {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition ${className}`}
      >
        {children}
      </button>
    );
  }
  