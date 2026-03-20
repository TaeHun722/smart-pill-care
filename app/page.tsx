import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 relative overflow-hidden">
      {/* 배경 장식 원형 효과 */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      <div className="z-10 text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 drop-shadow-sm">
          스마트 <span className="text-blue-600">복약 관리</span>
        </h1>
        <p className="text-xl text-gray-600 font-medium">안전하고 편리한 맞춤형 건강 케어 솔루션</p>
      </div>

      <div className="z-10 flex flex-col sm:flex-row gap-8 w-full max-w-3xl px-4">
        {/* 어르신 화면 버튼 */}
        <Link href="/senior" className="flex-1 group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
          <div className="relative flex flex-col items-center justify-center p-12 bg-white/80 backdrop-blur-md rounded-[2rem] border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-24 h-24 mb-6 bg-green-100 rounded-full flex items-center justify-center text-5xl shadow-inner">👴</div>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-3">어르신 화면</h2>
            <p className="text-gray-500 text-center font-medium text-lg">크고 직관적인 1버튼 복약 확인</p>
          </div>
        </Link>

        {/* 보호자 대시보드 버튼 */}
        <Link href="/guardian" className="flex-1 group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
          <div className="relative flex flex-col items-center justify-center p-12 bg-white/80 backdrop-blur-md rounded-[2rem] border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-24 h-24 mb-6 bg-blue-100 rounded-full flex items-center justify-center text-5xl shadow-inner">👨‍👩‍👧</div>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-3">보호자 화면</h2>
            <p className="text-gray-500 text-center font-medium text-lg">실시간 데이터 모니터링</p>
          </div>
        </Link>
      </div>
    </main>
  );
}