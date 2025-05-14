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
    required: true,
    maxLength: 100,
    match: /^[a-zA-Z0-9._%+-]+@ricaldone\.edu\.sv$/
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
    address: {
      type: String,
      require: true,
      maxLength: 200,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Employees", employeesSchema);