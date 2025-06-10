import React from 'react'

const BallComponent = () => {
  return (
    <span className="relative block w-full h-full rounded-full border border-solid border-[#aaaaaa] overflow-hidden transition-transform will-change-transform">
      <i className="absolute top-0 left-1/2 w-full h-1/2 bg-[#ff0000] rounded-t-[10rem] border-b border-solid border-black transform -translate-x-1/2 z-[1] box-border shadow-[inset_3px_3px_0px_-2px_#ff7373,inset_-2px_0_0px_0px_#aa3333]" />
      <i className="absolute bottom-0 left-1/2 w-full h-1/2 bg-white rounded-b-[10rem] border-t border-solid border-black transform -translate-x-1/2 z-[2] box-border shadow-[inset_-2px_-1.5px_0px_0px_#d9d9d9]" />
      <i className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-white border-2 border-solid border-black rounded-full transform -translate-x-1/2 -translate-y-1/2 z-[3] box-border shadow-[inset_-1.3px_-1.2px_0px_0px_#d9d9d9]" />
    </span>
  )
}

export default BallComponent
