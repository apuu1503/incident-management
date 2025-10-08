import React, { useState, useEffect } from "react";
import { request } from "../api";
import Swal from "sweetalert2";
import IncidentForm from "./IncidentForm";

export default function IncidentPage() {
  const [incidents, setIncidents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);


  const loadIncidents = async () => {
    try {
      const res = await request("/incidents", { method: "GET" });
      if (res.incidents) {
        setIncidents(res.incidents);
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load incidents", "error");
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const deleteIncident = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This incident will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await request(`/incidents/${id}`, { method: "DELETE" });
      if (res.message) {
        Swal.fire("Deleted!", res.message, "success");
        loadIncidents();
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete incident", "error");
    }
  };

  return (
    <div>

      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">Incident Management</span>
        </div>
      </nav>

       <div 
  className="container mt-4 p-4"
  style={{ 
    width: "80%", 
    border: "1px solid", 
   
    marginTop: "50px"   // adds space at the top
  }}
>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-semibold">My Incidents</h3>
          <button
            className="btn btn-success"
            onClick={() => {
              setEditItem(null);
              setShowForm(true);
            }}
          >
            + Add Incident
          </button>
        </div>

        <div className="table-responsive shadow-sm rounded">
          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>Incident ID</th>
                <th>Details</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Reported At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incidents.length > 0 ? (
                incidents.map((inc) => (
                  <tr key={inc.id}>
                    <td>{inc.incident_id}</td>
                    <td>{inc.details}</td>
                    <td>
                      <span
                        className={`badge ${inc.priority === "High"
                            ? "bg-danger"
                            : inc.priority === "Medium"
                              ? "bg-warning text-dark"
                              : "bg-success"
                          }`}
                      >
                        {inc.priority}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${inc.status === "Closed"
                            ? "bg-secondary"
                            : inc.status === "In Progress"
                              ? "bg-info text-dark"
                              : "bg-primary"
                          }`}
                      >
                        {inc.status}
                      </span>
                    </td>
                    <td>
                      {new Date(inc.reported_at).toLocaleString("en-IN", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => {
                          setEditItem(inc);
                          setShowForm(true);
                        }}
                        disabled={inc.status === "Closed"}   // ✅ Disable if Closed
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteIncident(inc.id)}
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No incidents reported yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      {showForm && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">

              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-semibold">
                  {editItem ? "✏️ Edit Incident" : "➕ Report New Incident"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowForm(false)}
                ></button>
              </div>

              {/* MODAL BODY */}
              <div className="modal-body p-4">
                <IncidentForm
                  editItem={editItem}
                  onSaved={() => {
                    setShowForm(false);
                    loadIncidents();
                  }}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
