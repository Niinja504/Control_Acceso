import { Schema, model } from "mongoose";

const employeesSchema = new Schema(
  {
    names: {
      type: String,
      require: true,
      maxLength: 100,
    },
    surnames: {
      type: String,
      require: true,
      maxLength: 100,
    },
    DUI: {
        type: String,
        require: true,
        maxLength: 100,
    }, 
    birthday: {
      type: Date,
      require: true,
    },
    telephone: {
        type: String,
        require: true,
        min: 0,
    },
    email: {
        type: String,
        require: true,
        maxLength: 100,
    },
    password: {
        type: String,
        require: true,
        maxLength: 100,
    },
    department: {
        type: String,
        require: true,
        maxLength: 100,
    },
    status: {
        type: Boolean,
        require: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Employees", employeesSchema);