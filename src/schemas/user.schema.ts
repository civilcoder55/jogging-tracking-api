import { object, string } from "yup";

export const createUserSchema = object({
  body: object({
    passwordConfirmation: string()
      .required("passwordConfirmation field is required")
      .test("passwords-match", "passwords and passwordConfirmation must match", function (value) {
        return this.parent.password === value;
      }),
    password: string()
      .required("password field is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        "Password must contain 8 characters, at least one uppercase, one lowercase, one number and one special character"
      ),
    email: string().email("email field must be valid email").required("email field is required"),
    name: string().required("name field is required"),
  }),
});

export const updateUserSchema = object({
  body: object({
    passwordConfirmation: string()
      .test("passwords-match", "passwords and passwordConfirmation must match", function (value) {
        return this.parent.password === value;
      })
      .when("password", {
        is: (password: string) => password && password.length > 0,
        then: string().required("passwordConfirmation field is required"),
      }),
    password: string().matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "Password must contain 8 characters, at least one uppercase, one lowercase, one number and one special character"
    ),
    email: string().email("email field must be valid email").required("email field is required"),
    name: string().required("name field is required"),
  }),
});
