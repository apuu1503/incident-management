import React, { useState, useEffect } from "react";
import { request } from "../api";
import Swal from "sweetalert2";

export default function IncidentForm({ onSaved, editItem, onCancel }) {
  const [details, setDetails] = useState("");
  const [priority, setPriority] = useState("Low");
  const [status, setStatus] = useState("Open");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editItem) {
      setDetails(editItem.details);
      setPriority(editItem.priority);
      setStatus(editItem.status);
    } else {
      setDetails("");
      setPriority("Low");
      setStatus("Open");
    }
  }, [editItem]);

  async function submit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editItem) {
        const res = await request(`/incidents/${editItem.id}`, {
          method: "PUT",
          body: JSON.stringify({ details, priority, status }),
        });
        Swal.fire("Updated!", "Incident updated successfully", "success");
      } else {
        const res = await request("/incidents", {
          method: "POST",
          body: JSON.stringify({ details, priority }),
        });
        Swal.fire("Created!", "Incident reported successfully", "success");
      }
      onSaved && onSaved();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {/* DETAILS */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Details <span className="text-danger">*</span>
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe the issue..."
              className="form-control"
              rows="3"
              disabled={isLoading}
              required
            />
          </div>

          {/* PRIORITY & STATUS */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="form-select"
                disabled={isLoading}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            {editItem && (
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-select"
                  disabled={isLoading}
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Closed</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="card-footer bg-light d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Saving...
              </>
            ) : editItem ? (
              "Save Changes"
            ) : (
              "Report Incident"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
