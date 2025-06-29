import React, { useState } from "react";
import Swal from "sweetalert2";
import { Eraser } from "lucide-react";
import "../../components/styles/NewScheduleModal.css";

const initialDayState = {
  matutino: { entrada: "", salida: "" },
  vespertino: { entrada: "", salida: "" },
};

const defaultSchedule = {
  name: "",
  lunes: { ...initialDayState },
  martes: { ...initialDayState },
  miercoles: { ...initialDayState },
  jueves: { ...initialDayState },
  viernes: { ...initialDayState },
  sabado: { ...initialDayState },
  domingo: { ...initialDayState },
};

const days = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const formatToAMPM = (time) => {
  if (!time) return "Sin hora";
  const [hour, minute] = time.split(":");
  const h = parseInt(hour);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${minute} ${suffix}`;
};

const isBefore = (time1, time2) => {
  if (!time1 || !time2) return true;
  const [h1, m1] = time1.split(":").map(Number);
  const [h2, m2] = time2.split(":").map(Number);
  return h1 < h2 || (h1 === h2 && m1 < m2);
};

const isMorning = (time) => {
  if (!time) return true;
  const [h] = time.split(":").map(Number);
  return h < 12;
};

const transformSchedule = (schedule) => {
  const formatted = { name: schedule.name };
  for (const day of days) {
    const matutino = schedule[day].matutino;
    const vespertino = schedule[day].vespertino;
    const diaCapitalizado = capitalize(day);

    if (!matutino.entrada && !matutino.salida && !vespertino.entrada && !vespertino.salida) {
      formatted[diaCapitalizado] = null;
      continue;
    }

    formatted[diaCapitalizado] = {
      Matutino: {
        start: matutino.entrada ? formatToAMPM(matutino.entrada) : null,
        end: matutino.salida ? formatToAMPM(matutino.salida) : null,
      },
      Vespertino: {
        start: vespertino.entrada ? formatToAMPM(vespertino.entrada) : null,
        end: vespertino.salida ? formatToAMPM(vespertino.salida) : null,
      },
    };
  }

  return formatted;
};

const NewScheduleModal = ({ onSave, onClose }) => {
  const [schedule, setSchedule] = useState(defaultSchedule);

  const handleChange = (day, turno, campo, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [turno]: {
          ...prev[day][turno],
          [campo]: value,
        },
      },
    }));
  };

  const handleNameChange = (e) => {
    setSchedule({ ...schedule, name: e.target.value });
  };

  const handleClearDay = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...initialDayState },
    }));
  };

  const validateSchedule = () => {
    for (const day of days) {
      const matutino = schedule[day].matutino;
      const vespertino = schedule[day].vespertino;
      const dia = capitalize(day);

      if (matutino.entrada && !isMorning(matutino.entrada)) {
        Swal.fire(`${dia} - Entrada matutina debe ser antes de las 12:00 PM`, "", "warning");
        return false;
      }

      if (matutino.salida && !isMorning(matutino.salida)) {
        Swal.fire(`${dia} - Salida matutina debe ser antes de las 12:00 PM`, "", "warning");
        return false;
      }

      if (vespertino.entrada && isMorning(vespertino.entrada)) {
        Swal.fire(`${dia} - Entrada vespertina debe ser desde las 12:00 PM`, "", "warning");
        return false;
      }

      if (vespertino.salida && isMorning(vespertino.salida)) {
        Swal.fire(`${dia} - Salida vespertina debe ser desde las 12:00 PM`, "", "warning");
        return false;
      }

      if (matutino.entrada && matutino.salida && !isBefore(matutino.entrada, matutino.salida)) {
        Swal.fire(`${dia} - En matutino, la entrada debe ser antes que la salida`, "", "warning");
        return false;
      }

      if (vespertino.entrada && vespertino.salida && !isBefore(vespertino.entrada, vespertino.salida)) {
        Swal.fire(`${dia} - En vespertino, la entrada debe ser antes que la salida`, "", "warning");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = () => {
    if (!schedule.name.trim()) {
      Swal.fire("El nombre del horario es obligatorio", "", "warning");
      return;
    }

    if (!validateSchedule()) return;

    const transformed = transformSchedule(schedule);
    onSave(transformed);
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-content new-schedule animate">
        <button className="close-modal" onClick={onClose}>×</button>

        <div className="schedule-header">
          <div className="schedule-name-row">
            <label className="schedule-name-label">Nombre :</label>
            <input
              type="text"
              className="schedule-name-input"
              value={schedule.name}
              onChange={handleNameChange}
              placeholder=" . . ."
            />
          </div>
        </div>

        {days.map((day) => (
          <div key={day} className="schedule-day-section">
            <div className="day-header">
              <h3>{capitalize(day)}</h3>
              <button className="clear-day-btn" onClick={() => handleClearDay(day)}>
                <Eraser size={16} style={{ marginRight: 4 }} />
                Limpiar
              </button>
            </div>

            {["matutino", "vespertino"].map((turno) => (
              <div key={turno} className="schedule-block">
                <label className="schedule-turno">{capitalize(turno)}:</label>

                <div className="schedule-time-row">
                  <div className="input-group">
                    <span>Entrada:</span>
                    <div className="input-time-am">
                      <input
                        type="time"
                        value={schedule[day][turno].entrada}
                        onChange={(e) => handleChange(day, turno, "entrada", e.target.value)}
                      />
                      <span className="am-pm">{formatToAMPM(schedule[day][turno].entrada)}</span>
                    </div>
                  </div>

                  <div className="input-group">
                    <span>Salida:</span>
                    <div className="input-time-am">
                      <input
                        type="time"
                        value={schedule[day][turno].salida}
                        onChange={(e) => handleChange(day, turno, "salida", e.target.value)}
                      />
                      <span className="am-pm">{formatToAMPM(schedule[day][turno].salida)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <hr />
          </div>
        ))}

        <div className="schedule-buttons">
          <button className="guardar-btn" onClick={handleSubmit}>GUARDAR</button>
        </div>
      </div>
    </div>
  );
};

export default NewScheduleModal;
