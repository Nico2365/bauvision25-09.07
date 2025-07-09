
import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  setDoc
} from "firebase/firestore";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");
  const [selected, setSelected] = useState(null);
  const [images, setImages] = useState([]);
  const [uploadList, setUploadList] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        loadProjects(u.uid);
      }
    });
  }, []);

  const loadProjects = async (uid) => {
    const q = query(collection(db, "projects"), where("uid", "==", uid));
    onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (e) {
      alert("Login fehlgeschlagen: " + e.message);
    }
  };

  const createProject = async () => {
    if (!newProject) return;
    const exists = projects.find((p) => p.name === newProject);
    if (exists) {
      alert("❌ Projektname bereits vorhanden");
      return;
    }
    await addDoc(collection(db, "projects"), {
      uid: user.uid,
      name: newProject,
      images: []
    });
    setNewProject("");
  };

  const uploadImages = async () => {
    if (!selected || uploadList.length === 0) return;
    const projectRef = doc(db, "projects", selected.id);

    const base64Images = await Promise.all(
      uploadList.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      })
    );

    const updatedImages = [...(selected.images || []), ...base64Images];
    await updateDoc(projectRef, { images: updatedImages });
    setUploadList([]);
  };

  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <h2>BauVision25 – Login</h2>
        <input placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <br />
        <input type="password" placeholder="Passwort" value={pass} onChange={(e) => setPass(e.target.value)} />
        <br />
        <button onClick={handleLogin}>Einloggen</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Willkommen bei BauVision25</h2>

      <div>
        <h3>📁 Neues Projekt anlegen</h3>
        <input value={newProject} onChange={(e) => setNewProject(e.target.value)} placeholder="Projektname" />
        <button onClick={createProject}>Hinzufügen</button>
      </div>

      <div>
        <h3>🗂️ Deine Projekte</h3>
        {projects.map((p) => (
          <button key={p.id} onClick={() => setSelected(p)} style={{ marginRight: 8 }}>
            {p.name}
          </button>
        ))}
      </div>

      {selected && (
        <div style={{ marginTop: 20 }}>
          <h3>📸 Bilder zu {selected.name}</h3>
          <input type="file" multiple accept="image/*" onChange={(e) => setUploadList([...e.target.files])} />
          <br />
          <button onClick={uploadImages}>📤 Hochladen ({uploadList.length})</button>
          <div style={{ marginTop: 10 }}>
            {selected.images && selected.images.map((img, i) => (
              <img key={i} src={img} alt="" width="120" style={{ margin: 4, borderRadius: 4 }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
