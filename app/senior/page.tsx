'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase'; // 본인의 폴더 구조에 맞춰 경로를 확인하세요!

export default function SeniorPage() {
  const [isTaken, setIsTaken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 버튼을 누를 때만 딱 한 번 실행되는 안전한 비동기 함수
  const handleTakePill = async () => {
    setIsLoading(true);

    try {
      // 1. DB에서 테스트용 스케줄 ID 가져오기
      const { data: scheduleData } = await supabase
        .from('schedules')
        .select('id')
        .limit(1)
        .single();

      if (scheduleData) {
        // 2. Logs 테이블에 'taken(먹었음)' 기록 쏘기
        const { error } = await supabase.from('logs').insert([
          {
            schedule_id: scheduleData.id,
            status: 'taken',
            taken_at: new Date().toISOString(),
          },
        ]);

        if (error) throw error;

        // 3. 렉 없는 깔끔한 성공 처리
        setIsTaken(true);
        alert("DB에 완벽하게 저장되었습니다! 👍"); // 무거운 음성 API 대신 가벼운 알림창
      }
    } catch (error) {
      console.error('DB 저장 에러:', error);
      alert('저장에 실패했습니다. 터미널을 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-white">
      {/* 렉을 유발하던 1초 타이머는 빼고 고정 텍스트로 둡니다. */}
      <h1 className="text-5xl sm:text-7xl font-extrabold text-black mb-12">
        오후 2:00
      </h1>
      
      <button 
        onClick={handleTakePill}
        disabled={isTaken || isLoading}
        className={`w-full max-w-md h-72 sm:h-96 text-6xl font-black rounded-[3rem] shadow-2xl transition-transform
          ${isTaken 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-green-500 text-white active:scale-95 hover:bg-green-600'
          }`}
      >
        {isLoading ? '저장 중...' : (isTaken ? '복용 완료' : '약 먹었음')}
      </button>

      {isTaken && (
        <p className="mt-8 text-2xl text-blue-600 font-bold">
          오늘 약 복용을 완료하셨습니다! 👍
        </p>
      )}
    </main>
  );
}