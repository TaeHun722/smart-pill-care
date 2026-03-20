'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase'; // 상대경로 유지

export default function SeniorPage() {
  const [isTaken, setIsTaken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTakePill = async () => {
    setIsLoading(true);
    try {
      const { data: scheduleData } = await supabase.from('schedules').select('id').limit(1).single();
      if (scheduleData) {
        const { error } = await supabase.from('logs').insert([{
          schedule_id: scheduleData.id,
          status: 'taken',
          taken_at: new Date().toISOString(),
        }]);
        if (error) throw error;
        setIsTaken(true);
      }
    } catch (error) {
      console.error('DB 에러:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }

    // handleTakePill 함수 내부에 추가
    const speak = (msg: string) => {
      const speech = new SpeechSynthesisUtterance(msg);
      speech.lang = 'ko-KR';
      speech.rate = 0.8; // 천천히 읽어드림
      window.speechSynthesis.speak(speech);
    };

    // 버튼 클릭 시 호출
    const onButtonClick = async () => {
      await handleTakePill();
      speak("약 복용이 확인되었습니다. 오늘 하루도 건강하세요!");
    };
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#F4F7F6]">
      <div className="w-full max-w-lg flex flex-col items-center justify-center bg-white p-10 rounded-[3rem] shadow-2xl">
        <div className="text-center mb-12">
          <p className="text-2xl text-gray-500 font-bold mb-3">다음 약 드실 시간</p>
          <h1 className="text-6xl sm:text-7xl font-extrabold text-gray-900 tracking-tighter">
            오후 2:00
          </h1>
        </div>
        
        {/* 3D 물리 버튼 효과가 적용된 디자인 */}
        <button 
          onClick={handleTakePill}
          disabled={isTaken || isLoading}
          className={`relative w-full h-80 sm:h-96 rounded-[3rem] text-6xl font-black transition-all duration-150 flex items-center justify-center
            ${isTaken 
              ? 'bg-gray-200 text-gray-400 shadow-[0_5px_0_0_#d1d5db] translate-y-[10px] cursor-not-allowed' 
              : 'bg-green-500 text-white shadow-[0_15px_0_0_#166534] hover:bg-green-400 active:translate-y-[15px] active:shadow-[0_0px_0_0_#166534]'
            }`}
        >
          {isLoading ? '확인 중...' : (isTaken ? '✅ 복용 완료' : '💊 약 먹었음')}
        </button>

        {isTaken && (
          <div className="mt-10 text-center transition-opacity duration-500">
            <p className="text-3xl text-blue-700 font-extrabold bg-blue-50 px-8 py-5 rounded-3xl border border-blue-100">
              오늘 약 복용 완료! 참 잘하셨습니다 👏
            </p>
          </div>
        )}
      </div>
    </main>
  );
}