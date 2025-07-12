import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import "../../../styles/Modal.css";

// Componente reutilizable para inputs
const FormInput = ({ label, id, register, errors, validation, required, ...props }) => (
  <div className="form-field">
    <label htmlFor={id}>
      {label} 
      {validation.required && <span className="required-asterisk">*</span>}
    </label>
    <input 
      id={id} 
      aria-invalid={errors[id] ? "true" : "false"}
      {...register(id, validation)} 
      {...props} 
    />
    {errors[id] && (
      <span className="error-message" role="alert">
        {errors[id].message}
      </span>
    )}
  </div>
);

// Componente para selects
const FormSelect = ({ label, id, register, errors, options, loading, validation, required }) => (
  <div className="form-field">
    <label htmlFor={id}>
      {label}
      {required}
    </label>
    <select 
      id={id} 
      aria-invalid={errors[id] ? "true" : "false"}
      {...register(id, validation)}
    >
      <option value="">Seleccione una opción</option>
      {loading ? (
        <option disabled>Cargando...</option>
      ) : (
        options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))
      )}
    </select>
    {errors[id] && (
      <span className="error-message" role="alert">
        {errors[id].message}
      </span>
    )}
  </div>
);

export default function NewCoordinatorsModal({ onSaved, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Cargar equipos al montar el componente
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/teams");
        setTeams(res.data.map(team => ({
          value: team._id,
          label: team.name
        })));
      } catch (error) {
        console.error("Error al cargar equipos:", error);
        setTeams([]);
      } finally {
        setLoadingTeams(false);
      }
    };
    fetchTeams();
  }, []);

  // Formateadores de inputs
  const formatDUI = (value) => {
    value = value.replace(/\D/g, "").slice(0, 9);
    if (value.length > 8) value = value.slice(0, 8) + "-" + value.slice(8);
    return value;
  };

  const formatTelephone = (value) => {
    value = value.replace(/\D/g, "").slice(0, 8);
    if (value.length > 4) value = value.slice(0, 4) + "-" + value.slice(4);
    return value;
  };

  // Watchers para campos con formato
  const DUI = watch("DUI") || "";
  const telephone = watch("telephone") || "";
  const password = watch("password");

  // Aplicar formatos
  useEffect(() => {
    setValue("DUI", formatDUI(DUI));
  }, [DUI]);

  useEffect(() => {
    setValue("telephone", formatTelephone(telephone));
  }, [telephone]);

  // Validación de fechas
  const validateHireDate = (hireDate) => {
    const birthday = watch("birthday");
    if (!birthday || !hireDate) return true;
    return new Date(birthday) < new Date(hireDate) || 
      "La fecha de contratación debe ser posterior a la de nacimiento";
  };

  // Envío del formulario
  const onSubmit = async (data) => {
    try {
      setIsSubmittingForm(true);
      
      if (!data.email.toLowerCase().endsWith("@ricaldone.edu.sv")) {
        throw new Error("El correo debe terminar en @ricaldone.edu.sv");
      }

      const dataToSend = {
        ...data,
        birthday: new Date(data.birthday).toISOString(),
        hireDate: new Date(data.hireDate).toISOString(),
        status: data.status === "activo",
      };

      await axios.post("http://localhost:4000/api/registerAdministrators", dataToSend);
      
      await Swal.fire({
        icon: 'success',
        title: '¡Guardado!',
        text: 'El Administrador ha sido registrado exitosamente.',
        timer: 2000
      });
      
      reset();
      onSaved();
      onClose?.();
      
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || error.message,
      });
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <form 
      className="new-coordinador-form" 
      onSubmit={handleSubmit(onSubmit)}
      aria-label="Formulario de nuevo administrador"
    >
      <button 
        type="button" 
        className="close-modal" 
        onClick={onClose} 
        aria-label="Cerrar modal"
        onKeyDown={(e) => e.key === 'Enter' && onClose()}
      >
        ×
      </button>
      
      <h2>Crear un nuevo administrador</h2>

      <FormInput
        label="Código de empleado:"
        id="numEmpleado"
        register={register}
        errors={errors}
        validation={{ required: "El código de empleado es obligatorio" }}
        required
      />

      <FormInput
        label="Nombres:"
        id="names"
        register={register}
        errors={errors}
        validation={{ required: "Los nombres son obligatorios" }}
        required
      />

      <FormInput
        label="Apellidos:"
        id="surnames"
        register={register}
        errors={errors}
        validation={{ required: "Los apellidos son obligatorios" }}
        required
      />

      <FormInput
        label="DUI:"
        id="DUI"
        register={register}
        errors={errors}
        validation={{
          required: "El DUI es obligatorio",
          pattern: {
            value: /^\d{8}-\d{1}$/,
          }
        }}
        placeholder="12345678-9"
        maxLength={10}
        required
      />

      <FormInput
        label="Fecha de nacimiento:"
        id="birthday"
        type="date"
        register={register}
        errors={errors}
        validation={{ 
          required: "La fecha de nacimiento es obligatoria",
          max: {
            value: new Date().toISOString().split('T')[0],
            message: "La fecha no puede ser futura"
          }
        }}
        required
      />

      <FormInput
        label="Número telefónico:"
        id="telephone"
        register={register}
        errors={errors}
        validation={{
          required: "El teléfono es obligatorio",
          pattern: {
            value: /^\d{4}-\d{4}$/,
            message: "Formato inválido (1234-5678)"
          }
        }}
        placeholder="1234-5678"
        maxLength={9}
        required
      />

      <FormInput
        label="Correo electrónico:"
        id="email"
        type="email"
        register={register}
        errors={errors}
        validation={{
          required: "El correo electrónico es obligatorio",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@ricaldone\.edu\.sv$/,
            message: "Debe usar un correo institucional @ricaldone.edu.sv"
          }
        }}
        placeholder="usuario@ricaldone.edu.sv"
        required
      />

      <FormInput
        label="Contraseña:"
        id="password"
        type="password"
        register={register}
        errors={errors}
        validation={{
          required: "La contraseña es obligatoria",
          minLength: {
            value: 8,
            message: "Mínimo 8 caracteres"
          },
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
            message: "Debe incluir mayúsculas, minúsculas y números"
          }
        }}
        required
      />

      <FormInput
        label="Fecha de contratación:"
        id="hireDate"
        type="date"
        register={register}
        errors={errors}
        validation={{ 
          required: "La fecha de contratación es obligatoria",
          validate: validateHireDate
        }}
        required
      />

      <FormSelect
        label="Equipo:"
        id="IdTeam"
        register={register}
        errors={errors}
        options={teams}
        loading={loadingTeams}
        validation={{ required: "Debe seleccionar un equipo" }}
        required
      />

      <FormSelect
        label="Estado:"
        id="status"
        register={register}
        errors={errors}
        options={[
          { value: "activo", label: "Activo" },
          { value: "inactivo", label: "Inactivo" }
        ]}
        validation={{ required: "Debe seleccionar un estado" }}
        required
      />

      <FormInput
        label="Dirección de residencia:"
        id="address"
        register={register}
        errors={errors}
        validation={{ required: "La dirección es obligatoria" }}
        required
      />

      <button 
        type="submit" 
        className="btn-guardar"
        disabled={isSubmittingForm}
      >
        {isSubmittingForm ? "GUARDANDO..." : "GUARDAR"}
      </button>
    </form>
  );
}