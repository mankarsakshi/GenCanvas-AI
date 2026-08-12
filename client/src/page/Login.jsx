// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   FaEnvelope,
//   FaLock,
//   FaEye,
//   FaEyeSlash,
//   FaGoogle,
//   FaTimes,
// } from "react-icons/fa";
// import axios from "axios";

// const Login = () => {
//   const navigate = useNavigate();

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//     remember: false,
//   });

//   const handleChange = (e) => {
//     const { name, value, checked, type } = e.target;

//     setForm({
//       ...form,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       const res = await axios.post(
//         "http://localhost:5000/api/auth/login",
//         {
//           email: form.email,
//           password: form.password,
//         }
//       );

//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));

//       alert("Login Successful");

//       navigate("/");
//     } catch (err) {
//       alert(err.response?.data?.message || "Login Failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex justify-center items-center p-5">

//       <div className="relative bg-white shadow-2xl rounded-3xl w-full max-w-md p-8">

//         {/* Close Button */}
//         <button
//           onClick={() => navigate("/")}
//           className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600 flex justify-center items-center transition"
//         >
//           <FaTimes />
//         </button>

//         <h1 className="text-4xl font-bold text-center text-gray-800">
//           Welcome Back
//         </h1>

//         <p className="text-center text-gray-500 mt-2 mb-8">
//           Login to your account
//         </p>

//         {/* Google */}
//         <button
//           type="button"
//           className="w-full border border-gray-300 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
//         >
//           <FaGoogle className="text-red-500" />
//           Continue with Google
//         </button>

//         <div className="flex items-center my-6">
//           <hr className="flex-1" />
//           <span className="mx-3 text-gray-500">OR</span>
//           <hr className="flex-1" />
//         </div>

//         <form onSubmit={handleSubmit}>

//           {/* Email */}

//           <div className="mb-5">

//             <label className="font-medium">
//               Email
//             </label>

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

//             <label className="font-medium">
//               Password
//             </label>

//             <div className="flex items-center border rounded-xl mt-2 px-3">

//               <FaLock className="text-gray-400" />

//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="********"
//                 value={form.password}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-3 outline-none"
//               />

//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowPassword(!showPassword)
//                 }
//               >
//                 {showPassword ? (
//                   <FaEyeSlash />
//                 ) : (
//                   <FaEye />
//                 )}
//               </button>

//             </div>

//           </div>

//           {/* Remember Me */}

//           <div className="flex justify-between items-center mb-6">

//             <label className="flex items-center gap-2 text-sm">

//               <input
//                 type="checkbox"
//                 name="remember"
//                 checked={form.remember}
//                 onChange={handleChange}
//               />

//               Remember Me

//             </label>

//             <Link
//               to="/forgot-password"
//               className="text-blue-600 text-sm hover:underline"
//             >
//               Forgot Password?
//             </Link>

//           </div>

//           {/* Login Button */}

//           <button
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
//           >
//             {loading ? "Logging In..." : "Login"}
//           </button>

//         </form>

//         <p className="text-center mt-8 text-gray-600">

//           Don't have an account?

//           <Link
//             to="/signup"
//             className="text-blue-600 ml-2 font-semibold"
//           >
//             Sign Up
//           </Link>

//         </p>

//       </div>

//     </div>
//   );
// };

// export default Login;



import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        {
          email: form.email,
          password: form.password,
        }
      );

      // Save JWT token
      localStorage.setItem("token", res.data.token);

      // Save logged-in user information
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login Successful");

      // Go to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error("Login Error:", err);

      alert(
        err.response?.data?.message ||
          "Login Failed. Please try again."
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
          className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600 flex justify-center items-center transition"
        >
          <FaTimes />
        </button>

        {/* Heading */}

        <h1 className="text-4xl font-bold text-center text-gray-800">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Login to your account
        </p>

        {/* Google Login */}

        <button
          type="button"
          className="w-full border border-gray-300 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
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

        {/* Login Form */}

        <form onSubmit={handleSubmit}>

          {/* Email */}

          <div className="mb-5">

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
                placeholder="********"
                value={form.password}
                onChange={handleChange}
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

          </div>

          {/* Remember Me */}

          <div className="flex justify-between items-center mb-6">

            <label className="flex items-center gap-2 text-sm">

              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />

              Remember Me

            </label>

            <Link
              to="/forgot-password"
              className="text-blue-600 text-sm hover:underline"
            >
              Forgot Password?
            </Link>

          </div>

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? "Logging In..."
              : "Login"}
          </button>

        </form>

        {/* Signup */}

        <p className="text-center mt-8 text-gray-600">

          Don't have an account?

          <Link
            to="/signup"
            className="text-blue-600 ml-2 font-semibold hover:underline"
          >
            Sign Up
          </Link>

        </p>

      </div>

    </div>
  );
};

export default Login;