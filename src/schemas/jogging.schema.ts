import { date, number, object, string } from "yup";

export const createJoggingSchema = object({
  body: object({
    date: date().typeError("date field must be valid date"),
    duration: string()
      .typeError("duration field must be number")
      .min(1, "duration must be greater or equal 1 second")
      .required("duration field is required"),
    distance: number()
      .typeError("distance field must be number")
      .min(1, "distance must be greater or equal 1 meter")
      .required("distance field is required"),
    name: string().typeError("name field must be string").required("name field is required"),
  }),
});

export const updateJoggingSchema = object({
  body: object({
    date: date().typeError("date field must be valid date"),
    duration: string().typeError("duration field must be number").min(1, "duration must be greater or equal 1 second"),
    distance: number().typeError("distance field must be number").min(1, "distance must be greater or equal 1 meter"),
    name: string().typeError("name field must be string"),
  }),
});

export const getAllJoggingSchema = object({
  query: object({
    from: date().typeError("from field must be valid date"),
    to: date().typeError("to field must be valid date"),
  }),
});
