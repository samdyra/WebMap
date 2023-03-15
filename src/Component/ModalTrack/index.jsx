import React, {
  useEffect, useState, memo 
} from "react";
import s from "./style.module.scss";
import UseCompressImage from "../../hooks/useCompressImage";
import { collection, addDoc } from "firebase/firestore";
import {
  ref, uploadBytesResumable, getDownloadURL 
} from "firebase/storage";
import { storage, db } from "../../Config/firebase/index";
import { toast } from "react-toastify";
import moment from "moment";

const ModalTrack = ({
  open, onClose, coord 
}) => {
  const [ , setImages ] = useState([]);

  const handleImageChange = (e) => {
    UseCompressImage(e, formData, setFormData, setProgressCompress);
  };

  const [ progressCompress, setProgressCompress ] = useState(0);
  const [ progress, setProgress ] = useState(0);
  const [ coordArray, setCoordArray ] = useState([]);

  const [ formData, setFormData ] = useState({
    nama: "",
    namaTempat: "",
    desc: "",
    image: "",
    track: coordArray
  });

  const dbRef = collection(db, "track");

  useEffect(() => {
    setImages("");
  }, [ open ])

  useEffect(() => {
    setCoordArray(flattenArray(coord[0]?.geometry?.coordinates))

  }, [ coord ])

  useEffect(() => {
    setFormData({ ...formData, track: coordArray })
  }, [ coordArray ])

  function handleQuestionChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function flattenArray(nestedArray) {
    let result = {}
    nestedArray?.forEach((element, index) => {
      result[index] = element;
    });
    return result;
  }

  const handlePublish = () => {
    const storageRef = ref(storage, `/track/${formData.image.name}`);

    const uploadImage = uploadBytesResumable(storageRef, formData.image);

    uploadImage.on(
      "state_changed",
      (snapshot) => {
        const progressPercent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progressPercent);
      },
      (err) => {
        console.log(err);
      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref).then((url) => {
          addDoc(dbRef, {
            image: url,
            datems: moment.now(),
            nama: formData.nama,
            namaTempat: formData.namaTempat,
            desc: formData.desc,
            track: formData.track
          })
            .then(() => {
              toast("Track Berhasil ditambahkan", { type: "success" });
              setProgress(0);
            })
            .catch(() => {
              toast("Error", { type: "error" });
            });
        });
      }
    );
  };

  if (!open) return null;

  return (
    <div>
      <div onClick={onClose} className={s.overlay}>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          onScroll={(e) => {
            e.stopPropagation();
          }}
          className={s.modalContainer}
        >
          <form>
            <input
              type="text"
              name="nama"
              onChange={(e) => handleQuestionChange(e)}
              placeholder="Nama"
              style={{ marginBottom: 10 }}
            />
            <input
              type="text"
              name="namaTempat"
              onChange={(e) => handleQuestionChange(e)}
              placeholder="Nama Track"
              style={{ marginBottom: 10 }}

            />
            <input
              type="text"
              name="desc"
              onChange={(e) => handleQuestionChange(e)}
              placeholder="Deskripsi Track"
              style={{ marginBottom: 50 }}
            />

            <h1 style={{ marginBottom: 20 }}>Photo</h1>
            <div className={s.imageContainer}>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => handleImageChange(e)}
                id="imageupload"
              />
            </div>

            {progress === 0 || progress === 100 ? null : (
              <div className="progress">
                <div
                  className="progress-bar progress-bar-striped mt-2"
                  style={{ width: `${progress}%` }}
                >
                  {`uploading image ${progress}%`}
                </div>
              </div>
            )}
            {progressCompress === 0 || progressCompress === 100 ? null : (
              <div className="progress">
                <div
                  className="barloadingcompress"
                  style={{ width: `${progressCompress}%` }}
                >
                  {`compressing image ${progressCompress}%`}
                </div>
              </div>
            )}
          </form>

          <button
            className={s.publishButton}
            onClick={handlePublish}
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ModalTrack);
