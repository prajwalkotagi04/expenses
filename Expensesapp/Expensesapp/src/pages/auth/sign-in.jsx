import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setAgreedToTerms(e.target.checked);
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    if (!formData.email || !formData.password) {
      setError("Please fill out all fields.");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!agreedToTerms) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess("Login successful!");
        alert('Login Successful!');
        navigate("/dashboard/home");
      } else {
        const result = await response.json();
        setError(result.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.email && formData.password && agreedToTerms;

  return (
    <section className="flex items-center justify-center gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Sign In
          </Typography>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
        >
          <div className="mb-1 flex flex-col gap-6">
            <label htmlFor="email">Your Email</label>
            <Input
              id="email"
              size="lg"
              placeholder="name@mail.com"
              name="email"
              onChange={handleChange}
            />
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              size="lg"
              placeholder="********"
              name="password"
              onChange={handleChange}
            />
          </div>
          <Checkbox
            checked={agreedToTerms}
            onChange={handleCheckboxChange}
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree to the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          {error && (
            <Typography
              variant="small"
              className="text-red-500 font-medium text-center mt-2"
            >
              {error}
            </Typography>
          )}
          {success && (
            <Typography
              variant="small"
              className="text-green-500 font-medium text-center mt-2"
            >
              {success}
            </Typography>
          )}
          <Button className="mt-6" fullWidth type="submit" disabled={!isFormValid || loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="flex items-center justify-between gap-2 mt-6">
            <Typography
              variant="small"
              className="font-medium text-blue-gray-500"
            >
              <a href="#">Forgot Password?</a>
            </Typography>
          </div>

          <Typography
            variant="paragraph"
            className="text-center text-blue-gray-500 font-medium mt-4"
          >
            Not registered?
            <Link to="/auth/sign-up" className="text-gray-900 ml-1">
              Create account
            </Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignIn;
