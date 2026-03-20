'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase'; // 요청하신 경로 적용 완료!

export default function DebugPage() {
  const [status, setStatus] = useState<string>('대기 중...');

  // 1. [강제] 미복약 기록 넣기
  const triggerMissedPill = async () => {
    setStatus('미복약 상태 생성 중...');
    try {
      const { data: scheduleData } = await supabase
        .from('schedules')
        .select('id')
        .limit(1)
        .single();

      if (scheduleData) {
        await supabase.from('logs').insert([{
          schedule_id: scheduleData.id,
          status: 'missed', // 'taken'이 아닌 'missed' 상태
          taken_at: null,
        }]);
        setStatus('🔴 [성공] 미복약(위험) 데이터가 강제로 삽입되었습니다!');
      }
    } catch (error) {
      console.error('에러:', error);
      setStatus('에러 발생: 콘솔을 확인하세요.');
    }
  };

  // 2. [가짜 센서] 움직임 없음 신호 보내기
  const triggerNoMotion = async () => {
    setStatus('움직임 없음 상태 생성 중...');
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'senior')
        .limit(1)
        .single();

      if (userData) {
        await supabase.from('sensors').insert([{
          user_id: userData.id,
          motion_detected: false, // 움직임 없음
        }]);
        setStatus('🚨 [성공] 2시간째 움직임 없음 신호가 DB에 기록되었습니다!');
      }
    } catch (error) {
      console.error('에러:', error);
      setStatus('에러 발생: 콘솔을 확인하세요.');
    }
  };

  return (
    <main className="min-h-screen p-8 bg-red-50">
      <h1 className="text-3xl font-bold text-red-600 mb-8">🛠 시연용 디버그(치트키) 패널</h1>
      
      <div className="p-4 mb-6 bg-white border-2 border-red-200 rounded-xl">
        <p className="text-lg font-bold text-gray-800">현재 작업 상태: <span className="text-blue-600">{status}</span></p>
      </div>

      <div className="flex flex-col gap-4 max-w-md">
        <button 
          onClick={triggerMissedPill} 
          className="px-6 py-4 bg-red-500 text-white rounded-xl font-bold text-lg hover:bg-red-600 transition-colors"
        >
          [강제] 미복약(위험) 데이터 넣기
        </button>
        <button 
          onClick={triggerNoMotion} 
          className="px-6 py-4 bg-gray-800 text-white rounded-xl font-bold text-lg hover:bg-gray-900 transition-colors"
        >
          [가짜 센서] '움직임 없음' 신호 보내기
        </button>
      </div>
    </main>
  );
}