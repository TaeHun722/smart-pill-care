export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10 bg-gray-50">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">스마트 복약 관리</h1>
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <a href="/senior" className="text-center px-6 py-4 bg-blue-600 text-white rounded-2xl text-2xl font-bold shadow-md">
          어르신 화면 가기
        </a>
        <a href="/guardian" className="text-center px-6 py-4 bg-green-600 text-white rounded-2xl text-2xl font-bold shadow-md">
          보호자 대시보드
        </a>
      </div>
    </main>
  );
}