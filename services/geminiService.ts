import { GoogleGenAI } from "@google/genai";
import { RoomType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Giữ nguyên hàm getRoomAtmosphere
export const getRoomAtmosphere = async (room: RoomType): Promise<string> => {
  const model = 'gemini-1.5-flash';
  let prompt = "";
  const persona = "Bạn là linh hồn của một thế giới nội tâm trừu tượng (Mind Palace). Hãy đưa ra một đoạn độc thoại nội tâm ngắn (khoảng 2-3 câu), giàu tính triết lý, thơ mộng và hơi siêu thực bằng Tiếng Việt.";

  switch (room) {
    case RoomType.VOID:
      prompt = `${persona} Mô tả một không gian vô định, nơi chứa đựng những cánh cửa dẫn đến các khía cạnh khác nhau của tâm hồn. Nhấn mạnh sự hỗn độn có trật tự và màu xanh navy sâu thẳm.`;
      break;
    case RoomType.IDENTITY:
      prompt = `${persona} Nói về một người thuộc cung Kim Ngưu và MBTI ISTJ. Sự vững chãi của đất, sự quy củ của lý trí, nhưng ẩn sâu là một thế giới riêng biệt. Ngày sinh 4/5/2005.`;
      break;
    case RoomType.CAFE:
      prompt = `${persona} Mô tả niềm đam mê mãnh liệt với cà phê. Mùi hương, sự đắng, sự tỉnh táo trong một không gian không trọng lực.`;
      break;
    case RoomType.AUDIO:
      prompt = `${persona} Mô tả một người yêu âm thanh (audiophile) với những chiếc tai nghe đắt tiền. Âm nhạc là ngôn ngữ duy nhất, đa dạng thể loại và ngôn ngữ. Sóng âm là vật chất.`;
      break;
    case RoomType.TECH:
      prompt = `${persona} Mô tả niềm vui với đồ chơi công nghệ. Những bảng mạch, ánh sáng neon, tương lai và sự tò mò.`;
      break;
    case RoomType.PRISM:
      prompt = `${persona} Nói về sự lưỡng lự giữa Hướng Nội và Hướng Ngoại. Một lăng kính phản chiếu nhiều màu sắc, chưa xác định được hình hài cố định.`;
      break;
    default:
      prompt = `${persona} Chào mừng đến với thế giới của tôi.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.response.text() || "Không gian im lặng...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Tín hiệu từ tâm trí bị gián đoạn...";
  }
};

// --- HÀM MỚI SỬ DỤNG NOEMBED (KHÔNG CẦN API KEY) ---
export const analyzeYoutubeMetadata = async (url: string): Promise<{ title: string, artist: string, year: string } | null> => {
  try {
    // 1. Gọi API miễn phí Noembed
    const response = await fetch(`https://noembed.com/embed?url=${url}`);
    const data = await response.json();

    if (data.error || !data.title) {
        console.warn("No video details found");
        return null;
    }

    // 2. Lấy dữ liệu thô
    let rawTitle = data.title; // Ví dụ: "Son Tung M-TP - CHUNG TA CUA TUONG LAI | OFFICIAL MUSIC VIDEO"
    let artist = data.author_name; // Ví dụ: "Son Tung M-TP Official"
    
    // API miễn phí này không trả về năm phát hành, nên ta lấy năm hiện tại
    const year = new Date().getFullYear().toString(); 

    // 3. Xử lý dữ liệu cho đẹp (Clean Title & Artist)
    let title = rawTitle;

    // Logic tách tên bài hát nếu tiêu đề có dạng "Artist - Title"
    const separator = " - ";
    if (rawTitle.includes(separator)) {
        const parts = rawTitle.split(separator);
        if (parts.length >= 2) {
             // Thường phần đầu là tên ca sĩ, phần sau là tên bài
             // Nhưng nếu author_name đã đúng rồi thì ta chỉ cần lấy phần Title
             title = parts.slice(1).join(separator).trim();
        }
    }

    // Xóa rác trong tiêu đề: (Official Video), [MV],...
    title = title.replace(/[\(\[]\s*(Official|Video|MV|Music Video|Audio|Lyrics|HD|4K|HQ).*?[\)\]]/gi, '').trim();
    // Xóa ký tự | và phía sau nó (thường là tên kênh)
    title = title.split('|')[0].trim();

    // Xóa rác trong tên Artist: "Official", "Channel", "Vevo"
    artist = artist.replace(/\s+(Official|Channel|Vevo|Music)\b/gi, '').trim();

    // Xóa dấu ngoặc kép thừa
    title = title.replace(/^['"]|['"]$/g, '');
    artist = artist.replace(/^['"]|['"]$/g, '');

    return {
        title,
        artist,
        year
    };

  } catch (error) {
    console.error("Metadata extraction error:", error);
    return null;
  }
};
