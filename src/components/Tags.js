import React from 'react'

const Tags = ({tags}) => {
  return (
    <div>
       <div>
         <div className="blog-heading text-start p-2 mb-4">
            {tags.map((tag, index)=>{
                return(
                    <p className="tags" key={index}>{tag}</p>

                )
            })}
         </div>
       </div>
    </div>
  )
}

export default Tags
