// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   FaUser,
//   FaEnvelope,
//   FaLock,
//   FaEye,
//   FaEyeSlash,
//   FaGoogle,
//   FaTimes,
// } from "react-icons/fa";
// import axios from "axios";

// const Signup = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     terms: false,
//   });

//   const handleChange = (e) => {
//     const { name, value, checked, type } = e.target;

//     setForm({
//       ...form,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const getPasswordStrength = () => {
//     const password = form.password;

//     let score = 0;

//     if (password.length >= 8) score++;
//     if (/[A-Z]/.test(password)) score++;
//     if (/[a-z]/.test(password)) score++;
//     if (/[0-9]/.test(password)) score++;
//     if (/[^A-Za-z0-9]/.test(password)) score++;

//     return score;
//   };

//   const strength = getPasswordStrength();

//   const strengthText = ["Very Weak", "Weak", "Medium", "Good", "Strong"];

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.terms) {
//       return alert("Please accept Terms & Conditions");
//     }

//     if (form.password !== form.confirmPassword) {
//       return alert("Passwords do not match");
//     }

//     try {
//       setLoading(true);

//       const res = await axios.post(
//         "http://localhost:5000/api/auth/register",
//         {
//           name: form.name,
//           email: form.email,
//           password: form.password,
//         }
//       );

//       alert(res.data.message || "Account Created Successfully");

//       setForm({
//         name: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//         terms: false,
//       });
//     } catch (err) {
//       alert(err.response?.data?.message || "Signup Failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex justify-center items-center p-5">

//      <div className="relative bg-white shadow-2xl rounded-3xl w-full max-w-md p-8">

//         <button
//   type="button"
//   onClick={() => navigate("/")}
//   className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-red-500 transition"
// >
//   <FaTimes size={18} />
// </button>
        
//        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-2">
//   Create Account
// </h1>

// <p className="text-center text-gray-500 mb-8">
//   Welcome to AI Image Generator 🚀
// </p>
//        <button
//   type="button"
//   className="w-full border border-gray-300 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-gray-50 hover:shadow-md transition-all duration-300"
// >
//           <FaGoogle className="text-red-500" />
//           Continue with Google
//         </button>

//         <div className="flex items-center my-6">
//           <hr className="flex-1" />
//           <span className="mx-3 text-gray-500">OR</span>
//           <hr className="flex-1" />
//         </div>

//         <form onSubmit={handleSubmit}>

//           {/* Name */}

//           <div className="mb-4">
//             <label className="font-medium">Full Name</label>

//             <div className="flex items-center border rounded-xl mt-2 px-3">

//               <FaUser className="text-gray-400" />

//               <input
//                 type="text"
//                 name="name"
//                 placeholder="John Doe"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-3 outline-none"
//               />

//             </div>
//           </div>

//           {/* Email */}

//           <div className="mb-4">

//             <label className="font-medium">Email</label>

//             <div className="flex items-center border rounded-xl mt-2 px-3">

//               <FaEnvelope className="text-gray-400" />

//               <input
//                 type="email"
//                 name="email"
//                 placeholder="abc@gmail.com"
//                 value={form.email}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-3 outline-none"
//               />

//             </div>

//           </div>

//           {/* Password */}

//           <div className="mb-4">

//             <label>Password</label>

//             <div className="flex items-center border rounded-xl mt-2 px-3">

//               <FaLock className="text-gray-400" />

//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 placeholder="********"
//                 required
//                 className="w-full p-3 outline-none"
//               />

//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </button>

//             </div>

//             {form.password && (
//               <>
//                 <div className="w-full bg-gray-200 rounded mt-2 h-2">
//                  <div
//   className={`h-2 rounded ${
//     strength <= 2
//       ? "bg-red-500"
//       : strength === 3
//       ? "bg-yellow-500"
//       : "bg-green-500"
//   }`}
//   style={{
//     width: `${strength * 20}%`,
//   }}
// />
//                 </div>

//                 <p className="text-sm mt-1">
//                   Password Strength :
//                   <span className="font-semibold ml-2">
//                     {strengthText[strength - 1] || "Very Weak"}
//                   </span>
//                 </p>
//               </>
//             )}

//           </div>

//           {/* Confirm Password */}

//           <div className="mb-4">

//             <label>Confirm Password</label>

//             <div className="flex items-center border rounded-xl mt-2 px-3">

//               <FaLock className="text-gray-400" />

//               <input
//                 type={showConfirm ? "text" : "password"}
//                 name="confirmPassword"
//                 value={form.confirmPassword}
//                 onChange={handleChange}
//                 required
//                 placeholder="********"
//                 className="w-full p-3 outline-none"
//               />

//               <button
//                 type="button"
//                 onClick={() => setShowConfirm(!showConfirm)}
//               >
//                 {showConfirm ? <FaEyeSlash /> : <FaEye />}
//               </button>

//             </div>

//           </div>

//           {/* Terms */}

//           <div className="flex items-center gap-2 mb-5">

//             <input
//               type="checkbox"
//               name="terms"
//               checked={form.terms}
//               onChange={handleChange}
//             />

//             <span className="text-sm">
//               I agree to Terms & Conditions
//             </span>

//           </div>

//          <button
//   disabled={loading}
//   className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-50"
// >
//             {loading ? "Creating Account..." : "Create Account"}
//           </button>

//         </form>

//         <p className="text-center mt-8 text-gray-600">
//           Already have an account?
//           <Link
//             to="/login"
//             className="text-blue-600 ml-2 font-semibold"
//           >
//             Login
//           </Link>
//         </p>

//       </div>
//     </div>
//   );
// };

// export default Signup;




import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Password strength
  const getPasswordStrength = () => {
    const password = form.password;

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  };

  const strength = getPasswordStrength();

  const strengthText = [
    "Very Weak",
    "Weak",
    "Medium",
    "Good",
    "Strong",
  ];

  // Signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Terms validation
    if (!form.terms) {
      alert("Please accept Terms & Conditions");
      return;
    }

    // Password validation
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Password length
    if (form.password.length < 8) {
      alert("Password must contain at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/register",
        {
          name: form.name,
          email: form.email,
          password: form.password,
        }
      );

      console.log("Signup response:", res.data);

      /*
       * If backend automatically logs the user in
       * after registration, save token and user.
       */
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      if (res.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );
      } else {
        /*
         * If backend only returns success message,
         * temporarily save the registered user's
         * basic information.
         *
         * Password is NEVER stored.
         */
        const user = {
          name: form.name,
          email: form.email,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      alert(
        res.data.message ||
          "Account Created Successfully"
      );

      // Reset form
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false,
      });

      /*
       * If registration automatically logs the user in,
       * go directly to dashboard.
       *
       * Otherwise send the user to login.
       */
      if (res.data.token) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }

    } catch (err) {
      console.error("Signup Error:", err);

      alert(
        err.response?.data?.message ||
          "Signup Failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex justify-center items-center p-5">

      <div className="relative bg-white shadow-2xl rounded-3xl w-full max-w-md p-8">

        {/* Close Button */}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-red-500 transition"
        >
          <FaTimes size={18} />
        </button>

        {/* Heading */}

        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Welcome to AI Image Generator 🚀
        </p>

        {/* Google */}

        <button
          type="button"
          className="w-full border border-gray-300 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-gray-50 hover:shadow-md transition-all duration-300"
        >
          <FaGoogle className="text-red-500" />

          Continue with Google
        </button>

        {/* Divider */}

        <div className="flex items-center my-6">

          <hr className="flex-1" />

          <span className="mx-3 text-gray-500">
            OR
          </span>

          <hr className="flex-1" />

        </div>

        <form onSubmit={handleSubmit}>

          {/* Name */}

          <div className="mb-4">

            <label className="font-medium">
              Full Name
            </label>

            <div className="flex items-center border rounded-xl mt-2 px-3">

              <FaUser className="text-gray-400" />

              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3 outline-none"
              />

            </div>

          </div>

          {/* Email */}

          <div className="mb-4">

            <label className="font-medium">
              Email
            </label>

            <div className="flex items-center border rounded-xl mt-2 px-3">

              <FaEnvelope className="text-gray-400" />

              <input
                type="email"
                name="email"
                placeholder="abc@gmail.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 outline-none"
              />

            </div>

          </div>

          {/* Password */}

          <div className="mb-4">

            <label className="font-medium">
              Password
            </label>

            <div className="flex items-center border rounded-xl mt-2 px-3">

              <FaLock className="text-gray-400" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="********"
                required
                className="w-full p-3 outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="text-gray-500 hover:text-gray-800"
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

            {/* Password Strength */}

            {form.password && (
              <>
                <div className="w-full bg-gray-200 rounded mt-2 h-2">

                  <div
                    className={`h-2 rounded ${
                      strength <= 2
                        ? "bg-red-500"
                        : strength === 3
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${strength * 20}%`,
                    }}
                  />

                </div>

                <p className="text-sm mt-1">

                  Password Strength:

                  <span className="font-semibold ml-2">
                    {strengthText[strength - 1] ||
                      "Very Weak"}
                  </span>

                </p>
              </>
            )}

          </div>

          {/* Confirm Password */}

          <div className="mb-4">

            <label className="font-medium">
              Confirm Password
            </label>

            <div className="flex items-center border rounded-xl mt-2 px-3">

              <FaLock className="text-gray-400" />

              <input
                type={
                  showConfirm
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="********"
                className="w-full p-3 outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm(!showConfirm)
                }
                className="text-gray-500 hover:text-gray-800"
              >
                {showConfirm ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

          </div>

          {/* Terms */}

          <div className="flex items-center gap-2 mb-5">

            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
            />

            <span className="text-sm">
              I agree to Terms & Conditions
            </span>

          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* Login */}

        <p className="text-center mt-8 text-gray-600">

          Already have an account?

          <Link
            to="/login"
            className="text-blue-600 ml-2 font-semibold hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
};

export default Signup;