import { useState } from "react"

import { useNavigate } from "react-router-dom"

import API from "../../api/axios"

function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")

  const [password, setPassword] = useState("")

  const handleLogin = async (e) => {

    e.preventDefault()

    try {

      const formData = new URLSearchParams()

      formData.append("username", email)

      formData.append("password", password)

      const response = await API.post(

        "/auth/login",

        formData,

        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded"
          }
        }
      )

      const token = response.data.access_token

      localStorage.setItem("token", token)

      const payload = JSON.parse(

        atob(token.split(".")[1])
      )

      localStorage.setItem("role", payload.role)

      if (payload.role === "Admin") {

        navigate("/admin")

      }

      else if (payload.role === "HR") {

        navigate("/hr")

      }

      else if (payload.role === "Manager") {

        navigate("/manager")

      }

      else {

        navigate("/employee")

      }

    }

    catch (error) {

      alert("Invalid email or password")

      console.log(error)
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-xl shadow-lg w-[400px]"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">

          HRMS Login

        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border p-3 rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded"
        >
          Login
        </button>

      </form>
    </div>
  )
}

export default Login