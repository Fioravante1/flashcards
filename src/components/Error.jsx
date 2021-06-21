import React from 'react'

function Error({children: errorMessage}) {
  return (
    <span className="bg-red-600 text-white p-3">
      {errorMessage}
    </span>
  )
}

export default Error
