import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { db, storage } from "../Config/firebase";
import { toast } from "react-toastify";
import { deleteObject, ref } from "firebase/storage";

const UseDeleteDataWithImage = ({
  id, image, type
}) => {
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete this data?`)) {
      try {
        await deleteDoc(doc(db, type, id))
        toast(`deleted successfully`, { type: "success" })
        const storageRef = ref(storage, image);
        await deleteObject(storageRef);
      }
      catch (error) {
        toast(`Error deleting`, { type: "error" });
        console.log("erroe", error)
      }
    }
  };
  return (
    <div className="deleteButton">
      <button onClick={handleDelete}>{`delete`}</button>
    </div>
  );
}

export default UseDeleteDataWithImage;