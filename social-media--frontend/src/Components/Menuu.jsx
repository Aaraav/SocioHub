import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function Menuu() {
  
  const navigate=useNavigate();
  return (
    <div className="bg-gray-900 text-white min-h-screen">
        <ul>
            <li onClick={()=>navigate('/')}>Logout</li>
        </ul>
      
    </div>
  )
}
