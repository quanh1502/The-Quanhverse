// File: TestSync.tsx
import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from "firebase/firestore"; 
import { db } from './firebaseConfig';

export default function TestSync() {
  const [text, setText] = useState("");
  const docRef = doc(db, "test_collection", "shared_note");

  useEffect(() => {
    // Nghe dữ liệu từ server
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setText(docSnap.data().content);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = async (e: any) => {
    const newVal = e.target.value;
    setText(newVal);
    // Gửi dữ liệu lên server
    await setDoc(docRef, { content: newVal });
  };

  return (
    <div style={{ padding: 50, background: 'white', height: '100vh', color: 'black' }}>
      <h1>Test Đồng Bộ Dữ Liệu</h1>
      <textarea
        value={text}
        onChange={handleChange}
        style={{ width: '100%', height: 200, border: '1px solid black', padding: 10 }}
        placeholder="Gõ vào đây, máy khác sẽ tự hiện ra..."
      />
    </div>
  );
}