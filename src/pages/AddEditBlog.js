import React, { useState, useEffect } from "react";
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import { useNavigate, useParams } from "react-router-dom";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {toast} from 'react-toastify'
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
const initialState = {
  title: "",
  tags: [],
  trending: "no",
  category: "",
  description: "",
};
const categoryOption = [
  "Fashion",
  "Technology",
  "Food",
  "Politics",
  "Sports",
  "Business",
];

const AddEditBlog = ({user, setActive}) => {
 

  const [form, setForm] = useState(initialState);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const navigate=useNavigate();
  const {id} =useParams()

  const { title, tags, category, trending, description } = form;

  useEffect(() => {
    const uploadFile = () => {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            toast.info("Image upload to firebase successfully");
            setForm((prev) => ({ ...prev, imgUrl: downloadUrl }));
          });
        }
      );
    };

    file && uploadFile();
  }, [file]);
  useEffect(()=>{
    id && getBlogDetail()
  }, [id])
  const getBlogDetail=async()=>{
      const docRef=doc(db,"spaces",id)
      const snapshot=await getDoc(docRef)
      if(snapshot.exists()){
        setForm({...snapshot.data()})
      }
      setActive(null)
  }
  const handleSubmit=async (e)=>{
    e.preventDefault();
    if(category && tags && title && description && file && trending)
    if(!id)
      try{
        await addDoc(collection(db, "spaces"),{
              ...form,
              timestamp:serverTimestamp(),
              author:user.displayName,
              userId: user.uid
        })
        toast.success("Blog Created Successfully")
        }catch(error){
          console.log(error)
        
    
    }else
      try{
        await updateDoc(doc(db, "spaces", id),{
              ...form,
              timestamp:serverTimestamp(),
              author:user.displayName,
              userId: user.uid
        })
        toast.success("Blog Updated Successfully")
        }catch(error){
          console.log(error)
        
    

    }else
      return toast.error("Please fill all the mandatory fields")
      navigate("/")
    }
  
  
   
    
  


  const handleChange = (e) => {
    setForm({...form,[e.target.name]:e.target.value})
  };

  const handleTags = (tags) => {
    setForm({...form, tags})
  };
  const handleTrending = (e) => {
    setForm({...form, trending:e.target.value})
  };

  const onCategoryChange = (e) => {
    setForm({...form, category:e.target.value})
  };

  return (
    <div className="container-fluid mb-4">
      <div className="container">
        <div className="col-12 ">
          <div className="text-center heading py-2">{id? "Update Blog":"Create Blog"}</div>
          <div className="row h-100 justify-content-center align-items-center">
            <div className="col-10 col-md-8 col-lg-6">
              <form className="blog-form" onSubmit={handleSubmit}>
                <div className="col-12 py-3">
                  <div className="col-12 py-3">
                    <input
                      type="text"
                      className="form-control input-text-box"
                      placeholder="Title"
                      name="title"
                      value={title}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12 py-3">
                    <TagsInput
                      value={tags}
                      
                      placeholder="Tags"
                      onChange={handleTags}
                    />
                  </div>
                  <div className="col-12 py-3">
                    <p className="trending">Is it trending blog?</p>
                    <div className="form-check-inline mx-2">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="radioOption"
                        value="yes"
                        checked={trending === "yes"}
                        onChange={handleTrending}
                      />
                      <label
                        htmlFor="radioOption"
                        className="label form-check-label">
                        Yes&nbsp;
                      </label>
                      <input
                        type="radio"
                        className="form-check-input"
                        name="radioOption"
                        value="no"
                        checked={trending === "no"}
                        onChange={handleTrending}
                      />
                      <label
                        htmlFor="radioOption"
                        className="label form-check-label">
                        No
                      </label>
                    </div>
                  </div>
                  <div className="col-12 py-3">
                    <select
                      value={category}
                      onChange={onCategoryChange}
                      className="catg-dropdown">
                      <option>Please select Category</option>
                      {categoryOption.map((data, index) => {
                        return (
                          <option value={data || ""} key={index}>
                            {data}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col-12 py-3">
                    <textarea
                      className="form-control description-box"
                      placeholder="Description"
                      name="description"
                      value={description}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </div>
                  <div className="col-12 py-3 text-center">
                    <button className="btn btn-add" type="submit" disabled={progress!=null && progress< 100}>
                    {id? "Update":"Submit"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditBlog;
