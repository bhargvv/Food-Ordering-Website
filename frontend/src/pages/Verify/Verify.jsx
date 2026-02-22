import { useContext, useEffect } from 'react'
import './Verify.css'
import axios from 'axios'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Verify = () => {

  const [searchParams] = useSearchParams()
  const success = searchParams.get('success')
  const orderId = searchParams.get('orderId')
  const { url, token } = useContext(StoreContext)

  const navigate = useNavigate()

  const verifyPayment = async () => {

    // 🔥 If payment was cancelled or params missing
    if (!success || !orderId) {
      navigate('/')
      return
    }

    try {
      const authToken = token || localStorage.getItem('token')
      if (!authToken) {
        navigate('/')
        return
      }

      const response = await axios.post(
        `${url}/api/order/verifyorder`,
        { success, orderId },
        { headers: { token: authToken } }
      )

      if (response.data.success) {
        navigate('/myorders');
      } else {
        navigate('/')
      }

    } catch (error) {
      console.error(error)
      navigate('/')
    }
  }


  useEffect(() => {
    verifyPayment()
  }, [])

  return (
    <div className='verify'>
      <div className="spinner"></div>
    </div>
  )
}

export default Verify
