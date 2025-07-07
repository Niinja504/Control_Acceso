import React, { useState, useEffect } from "react";
import "../../components/styles/ScheduleFormModal.css";
import { X, Eraser } from "lucide-react";
import Swal from "sweetalert2";

const daysOfWeek = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const match = timeStr.match(/(\d+):(\d+)\s?(AM|PM)?/i);
  if (!match) return "";
  let [_, hours, minutes, meridian] = match;
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);
  if (meridian) {
    meridian = meridian.toUpperCase();
    if (meridian === "PM" && hours < 12) hours += 12;
    if (meridian === "AM" && hours === 12) hours = 0;
  }
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

const toAMPM = (time) => {
  if (!time) return "Sin hora";
  const [hourStr, minute] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};

const UpdateScheduleModal = ({ onClose, onUpdate, schedule }) => {
  const [formData, setFormData] = useState({
    name: "",
    ...daysOfWeek.reduce((acc, day) => ({
      ...acc,
      [day]: { Matutino: { start: "", end: "" }, Vespertino: { start: "", end: "" } }
    }), {})
  });

  useEffect(() => {
    if (schedule && schedule.name) {
      const filledData = { name: schedule.name };
      daysOfWeek.forEach((day) => {
        filledData[day] = {
          Matutino: {
            start: formatTime(schedule[day]?.Matutino?.start),
            end: formatTime(schedule[day]?.Matutino?.end),
          },
          Vespertino: {
            start: formatTime(schedule[day]?.Vespertino?.start),
            end: formatTime(schedule[day]?.Vespertino?.end),
          },
        };
      });
      setFormData(filledData);
    }
  }, [schedule]);

  const handleChange = (day, turno, type, value) => {
    setFormData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [turno]: {
          ...prev[day][turno],
          [type]: value,
        },
      },
    }));
  };

  const handleClear = (day) => {
    setFormData((prev) => ({
      ...prev,
      [day]: {
        Matutino: { start: "", end: "" },
        Vespertino: { start: "", end: "" },
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const cleanedData = { name: formData.name };
      daysOfWeek.forEach((day) => {
        const dayData = formData[day];
        const validDay = {};
        if (dayData.Matutino.start && dayData.Matutino.end) {
          validDay.Matutino = {
            start: dayData.Matutino.start,
            end: dayData.Matutino.end,
          };
        }
        if (dayData.Vespertino.start && dayData.Vespertino.end) {
          validDay.Vespertino = {
            start: dayData.Vespertino.start,
            end: dayData.Vespertino.end,
          };
        }
        if (Object.keys(validDay).length > 0) {
          cleanedData[day] = validDay;
        }
      });

      await onUpdate(schedule._id, cleanedData);
      onClose();
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el horario.", "error");
    }
  };

  return (
    <div className="modal-overlay active">
      <div className="cardH">
        <div className="modal-header">
  <X className="close-icon" onClick={onClose} />
</div>

<div className="schedule-name-row">
  <label className="schedule-name-label">Nombre :</label>
  <input
    className="schedule-name-input"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  />
</div>


        {daysOfWeek.map((day) => (
          <div key={day} className="schedule-day-section">
            <div className="day-header">
              <h3>{day}</h3>
              <button className="clear-day-btn" onClick={() => handleClear(day)}>
                <Eraser size={16} /> Limpiar
              </button>
            </div>

            {["Matutino", "Vespertino"].map((turno) => (
              <div className="schedule-block" key={turno}>
                <span className="schedule-turno">{turno}:</span>
                <div className="schedule-time-row">
                  <div className="input-group">
                    <label>Entrada:</label>
                    <div className="input-time-am">
                      <input
                        type="time"
                        value={formData[day]?.[turno]?.start || ""}
                        onChange={(e) =>
                          handleChange(day, turno, "start", e.target.value)
                        }
                      />
                      <span className="am-pm">{toAMPM(formData[day]?.[turno]?.start)}</span>
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Salida:</label>
                    <div className="input-time-am">
                      <input
                        type="time"
                        value={formData[day]?.[turno]?.end || ""}
                        onChange={(e) =>
                          handleChange(day, turno, "end", e.target.value)
                        }
                      />
                      <span className="am-pm">{toAMPM(formData[day]?.[turno]?.end)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <hr />
          </div>
        ))}

        <div className="schedule-buttons">
          <button className="cancelar-btn" onClick={onClose}>Cancelar</button>
          <button className="guardar-btn" onClick={handleSubmit}>Actualizar</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateScheduleModal;
