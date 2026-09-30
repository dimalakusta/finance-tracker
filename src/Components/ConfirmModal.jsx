import {
  AlertTriangle,
  X,
} from "lucide-react";

import {
  useSettings,
} from "../context/SettingsContext";

import {
  translations,
} from "../utils/translations";


export default function ConfirmModal({
  title,
  message,
  onCancel,
  onConfirm,
}) {
  const {
    language,
  } = useSettings();


  const t =
    translations[language];


  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onCancel();
        }
      }}
    >

      <div
        className="confirm-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >

        <button
          type="button"
          className="modal-close"
          onClick={onCancel}
        >
          <X size={20} />
        </button>


        <div className="confirm-icon">
          <AlertTriangle size={25} />
        </div>


        <h2>
          {title ||
            t.confirmDelete}
        </h2>


        <p>
          {message ||
            t.confirmDeleteText}
        </p>


        <div className="modal-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
          >
            {t.cancel}
          </button>


          <button
            type="button"
            className="danger-button"
            onClick={onConfirm}
          >
            {t.confirm}
          </button>

        </div>

      </div>

    </div>
  );
}