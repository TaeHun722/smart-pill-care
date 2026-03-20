'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // 경로 고정!

export default function GuardianPage() {
  // 복약 상태 State
  const [pillStatus, setPillStatus] = useState<string>('상태 확인 중...');
  const [takenTime, setTakenTime] = useState<string | null>(null);
  
  // 센서 움직임 상태 State
  const [motionStatus, setMotionStatus] = useState<string>('센서 확인 중...');
  const [lastMotionTime, setLastMotionTime] = useState<string | null>(null);

  // 1. 복약 기록 불러오기
  const fetchLatestLog = async () => {
    try {
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .order('taken_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data && data.status === 'taken') {
        setPillStatus('복용 완료 🟢');
        setTakenTime(new Date(data.taken_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
      } else {
        setPillStatus('미복용 (확인 필요) 🔴');
        setTakenTime(null);
      }
    } catch (error) {
      console.error('복약 데이터 조회 에러:', error);
    }
  };

  // 2. 센서 움직임 기록 불러오기
  const fetchLatestSensor = async () => {
    try {
      const { data, error } = await supabase
        .from('sensors')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setLastMotionTime(new Date(data.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
        if (data.motion_detected) {
          setMotionStatus('최근 움직임 감지됨 🟢');
        } else {
          setMotionStatus('장시간 움직임 없음 (위험) 🔴');
        }
      }
    } catch (error) {
      console.error('센서 데이터 조회 에러:', error);
    }
  };

  // 두 데이터를 동시에 갱신하는 함수
  const refreshAllData = () => {
    fetchLatestLog();
    fetchLatestSensor();
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">보호자 모니터링 대시보드</h1>
      
      <div className="flex flex-col gap-6">
        {/* 복약 상태 카드 */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border-l-4 border-blue-500">
          <h2 className="text-xl font-bold mb-4">💊 오늘 복약 상태</h2>
          <p className="text-xl mb-2">
            상태: <span className={`font-extrabold ${pillStatus.includes('완료') ? 'text-green-600' : 'text-red-600'}`}>{pillStatus}</span>
          </p>
          {takenTime && <p className="text-lg text-gray-600">최근 복용 시간: <span className="font-semibold">{takenTime}</span></p>}
        </div>

        {/* 활동(센서) 상태 카드 */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border-l-4 border-purple-500">
          <h2 className="text-xl font-bold mb-4">🏃‍♂️ 어르신 활동 상태</h2>
          <p className="text-xl mb-2">
            상태: <span className={`font-extrabold ${motionStatus.includes('감지됨') ? 'text-green-600' : 'text-red-600'}`}>{motionStatus}</span>
          </p>
          {lastMotionTime && <p className="text-lg text-gray-600">마지막 신호 시간: <span className="font-semibold">{lastMotionTime}</span></p>}
        </div>
      </div>

      <button 
        onClick={refreshAllData}
        className="mt-8 px-6 py-4 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition-colors w-full sm:w-auto shadow-md"
      >
        🔄 전체 상태 새로고침
      </button>
    </main>
  );
}