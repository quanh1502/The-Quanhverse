// File: src/TestSync.tsx
import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from "firebase/firestore"; 
import { db } from './firebaseConfig';

export default function TestSync() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("Đang kết nối..."); // Thêm dòng trạng thái
  
  // Đảm bảo tên này khớp 100% với Firebase bạn vừa tạo
  const docRef = doc(db, "test_collection", "shared_note");

  useEffect(() => {
    // 1. Lắng nghe dữ liệu
    const unsubscribe = onSnapshot(docRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          console.log("🔥 Đã nhận dữ liệu:", docSnap.data());
          setText(docSnap.data().content);
          setStatus("Kết nối TỐT: Đã nhận dữ liệu");
        } else {
          console.log("⚠️ Không tìm thấy tài liệu 'shared_note'");
          setStatus("LỖI: Không tìm thấy file shared_note trên kho");
        }
      },
      (error) => {
        // Đây là chỗ quan trọng nhất để bắt lỗi
        console.error("❌ Lỗi kết nối:", error);
        setStatus("LỖI KẾT NỐI: " + error.message);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleChange = async (e: any) => {
    const newVal = e.target.value;
    setText(newVal);
    try {
      await setDoc(docRef, { content: newVal });
      console.log("✅ Đã gửi thành công:", newVal);
    } catch (err: any) {
      console.error("❌ Lỗi khi gửi:", err);
      alert("Gửi thất bại: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20, background: 'white', height: '100vh', color: 'black' }}>
      <h2>Test Đồng Bộ</h2>
      
      {/* Hiển thị trạng thái kết nối ngay trên màn hình để dễ nhìn */}
      <p style={{ color: status.includes("LỖI") ? 'red' : 'green', fontWeight: 'bold' }}>
        Trạng thái: {status}
      </p>

      <textarea
        value={text}
        onChange={handleChange}
        style={{ width: '100%', height: 200, border: '2px solid black', padding: 10, fontSize: 16 }}
        placeholder="Gõ vào đây..."
      />
    </div>
  );
}
// update.
