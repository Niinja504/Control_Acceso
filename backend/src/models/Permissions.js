import { Schema, model } from "mongoose";

// Subesquema para la autorización de dirección en permisos mayores
const directorAuthorizationSchema = new Schema(
  {
    withoutDiscount: Boolean, // Autorización sin descuento
    withDiscount: Boolean,    // Autorización con descuento
    notAuthorized: Boolean    // No autorizado
  },
  { _id: false }
);

const permissionsSchema = new Schema(
  {
    // Datos generales del colaborador
    employeeNumber: {
      type: String,
      required: true,
      maxLength: 100,
    },
    employeeName: {
      type: String,
      required: true,
      maxLength: 100,
    },
    department: {
      type: String,
      required: true,
      maxLength: 100,
    },

    // Tipo de permiso: menor, mayor o incapacidad
    permissionType: {
      type: String,
      enum: ["minor", "major", "incapacity"],
      required: true,
    },

    // Permiso menor a dos días
    permissionDate: Date,                // Fecha del permiso
    permissionStartTime: String,         // Hora de inicio del permiso
    permissionEndTime: String,           // Hora de finalización del permiso
    reason: String,                      // Motivo del permiso
    authorizationWithoutDiscount: Boolean, // Autorización sin descuento
    authorizationWithDiscount: Boolean,    // Autorización con descuento
    supportingDocument: String,           // Comprobante adjunto (opcional)

    // Permiso mayor a dos días
    permissionDateFrom: Date,             // Fecha de inicio del permiso
    permissionDateTo: Date,               // Fecha de finalización del permiso
    requestLetter: String,                // Carta de solicitud adjunta (obligatorio)
    supportingDocuments: [String],        // Documentos de respaldo adjuntos (obligatorio)
    supervisorApproval: Boolean,          // Visto bueno del jefe inmediato
    supervisorComments: String,           // Observaciones del jefe inmediato
    directorAuthorization: directorAuthorizationSchema, // Autorización de la dirección

    // Incapacidad
    sickLeaveDateFrom: Date,              // Fecha de inicio de la incapacidad
    sickLeaveDateTo: Date,                // Fecha de finalización de la incapacidad
    incapacityType: {
      type: String,
      enum: ["Initial", "Extension"],     // Inicial o Prórroga
    },
    illnessType: {
      type: String,
      enum: ["Common illness", "Work accident"], // Enfermedad común o Accidente de trabajo
    },
    reasonIncapacity: String,             // Motivo de la incapacidad
    privateSickLeave: Boolean,            // Incapacidad particular
    isssSickLeave: Boolean,               // Incapacidad del ISSS
    sickLeaveDocument: String,            // Documento de incapacidad adjunto (obligatorio)
    homologationDocument: String,         // Documento de homologación (opcional)
    supervisorApprovalIncapacity: Boolean // Visto bueno del jefe inmediato (solo para incapacidad particular)
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Permissions", permissionsSchema);