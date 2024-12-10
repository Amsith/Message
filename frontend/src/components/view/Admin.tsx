import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const Admin = () => {
  const navigate = useNavigate()

  // logout function
  const logOut = (e: any) => {
    e.preventDefault()

    // Send POST request to logout
    axios.post('http://localhost:5001/logout', {}, { withCredentials: true })
      .then(response => {
        console.log(response.data)  // Log success message from server
        navigate('/')
      })
      .catch(error => {
        console.error('Logout error:', error)  // Handle any errors
      })
  }

  return (
    <>
      <h2>Admin</h2>
      <div>
        <button onClick={logOut} className='btn btn-danger'>Logout</button>
      </div>
    </>
  )
}

export default Admin