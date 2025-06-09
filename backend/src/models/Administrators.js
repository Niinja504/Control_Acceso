import { Schema, model } from "mongoose";

const AdministratorSchema = new Schema(
{
        numEmpleado: {
            type: String,
            required: true,
            unique: true
        },
        names: {
            type: String,
            required: true
        },
        surnames: {
            type: String,
            required: true
        },
        DUI: {
            type: String,
            required: true,
            unique: true
        },
        birthday: {
            type: Date,
            required: true
        },
        telephone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        hireDate: {
            type: Date,
            required: true
        },
        department: {
            type: String,
            required: true
        },
        status: {
            type: Boolean,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    }
);

export default model('Administrator', AdministratorSchema);