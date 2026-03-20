'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // 상대경로 유지

export default function GuardianPage() {
  const [pillStatus, setPillStatus] = useState<string>('상태 확인 중...');
  const [takenTime, setTakenTime] = useState<string | null>(null);
  const [motionStatus, setMotionStatus] = useState<string>('센서 확인 중...');
  const [lastMotionTime, setLastMotionTime] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLatestLog = async () => {
    try {
      const { data, error } = await supabase.from('logs').select('*').order('taken_at', { ascending: false }).limit(1).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data && data.status === 'taken') {
        setPillStatus('복용 완료');
        setTakenTime(new Date(data.taken_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
      } else {
        setPillStatus('미복용 (확인 필요)');
        setTakenTime(null);
      }
    } catch (error) { console.error(error); }
  };

  const fetchLatestSensor = async () => {
    try {
      const { data, error } = await supabase.from('sensors').select('*').order('created_at', { ascending: false }).limit(1).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setLastMotionTime(new Date(data.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
        setMotionStatus(data.motion_detected ? '활동 감지됨' : '장시간 무반응 (위험)');
      }
    } catch (error) { console.error(error); }
  };

  const refreshAllData = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchLatestLog(), fetchLatestSensor()]);
    setTimeout(() => setIsRefreshing(false), 500); // 회전 애니메이션용 딜레이
  };

  useEffect(() => { refreshAllData(); }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* 헤더 영역 */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">모니터링 대시보드</h1>
            <p className="text-slate-500 mt-2 font-medium text-lg">김태훈 어르신의 실시간 상태를 확인하세요.</p>
          </div>
          <button 
            onClick={refreshAllData}
            disabled={isRefreshing}
            className="px-6 py-3 bg-white text-slate-700 rounded-xl font-bold shadow-sm border border-slate-200 hover:bg-slate-100 hover:shadow transition-all flex items-center gap-2"
          >
            <span className={`text-xl ${isRefreshing ? 'animate-spin' : ''}`}>🔄</span> 새로고침
          </button>
        </header>
        
        {/* 카드 그리드 영역 */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* 대시보드 상단에 추가할 요약 정보 */}
          <div className="grid grid-cols-3 gap-4 mb-10 text-center">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-slate-500 text-sm mb-1">복약 성공률</p>
              <p className="text-2xl font-black text-blue-600">85%</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-slate-500 text-sm mb-1">미복약 횟수</p>
              <p className="text-2xl font-black text-red-500">2회</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-slate-500 text-sm mb-1">활동 점수</p>
              <p className="text-2xl font-black text-purple-600">92점</p>
            </div>
          </div>
          
          {/* 복약 상태 카드 */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 w-3 h-full bg-blue-500"></div>
            <div className="flex justify-between items-start mb-6 pl-2">
              <h2 className="text-2xl font-bold text-slate-800">💊 오늘 복약 상태</h2>
              {/* 맥박처럼 뛰는 상태 표시 점 */}
              <span className="flex h-5 w-5 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pillStatus === '복용 완료' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-5 w-5 ${pillStatus === '복용 완료' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </span>
            </div>
            <div className="pl-2 mb-4">
              <span className={`text-3xl font-black ${pillStatus === '복용 완료' ? 'text-green-600' : 'text-red-600'}`}>
                {pillStatus}
              </span>
            </div>
            <div className="pl-2">
              {takenTime ? (
                <p className="text-slate-600 font-bold bg-slate-100 px-4 py-2 rounded-lg inline-block">최근 복용 시간: {takenTime}</p>
              ) : (
                <p className="text-red-700 font-bold bg-red-50 px-4 py-2 rounded-lg inline-block">복용 기록이 없습니다.</p>
              )}
            </div>
          </div>

          {/* 활동 센서 카드 */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 w-3 h-full bg-purple-500"></div>
            <div className="flex justify-between items-start mb-6 pl-2">
              <h2 className="text-2xl font-bold text-slate-800">🏃‍♂️ 활동 센서 상태</h2>
              <span className="flex h-5 w-5 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${motionStatus === '활동 감지됨' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-5 w-5 ${motionStatus === '활동 감지됨' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </span>
            </div>
            <div className="pl-2 mb-4">
              <span className={`text-3xl font-black ${motionStatus === '활동 감지됨' ? 'text-green-600' : 'text-red-600'}`}>
                {motionStatus}
              </span>
            </div>
            <div className="pl-2">
              {lastMotionTime && (
                <p className="text-slate-600 font-bold bg-slate-100 px-4 py-2 rounded-lg inline-block">마지막 신호 시간: {lastMotionTime}</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}