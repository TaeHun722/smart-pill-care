import { NextResponse } from 'next/server';
import { supabase } from '../lib/supabase'; // 폴더 깊이에 따라 상대경로 주의 (src/lib/supabase.ts 기준)

// 하드웨어에서 HTTP POST 요청을 보낼 때 실행되는 함수
export async function POST(request: Request) {
  try {
    // 1. 하드웨어(아두이노 등)가 보낸 JSON 데이터(예: { "userId": "...", "motion": true })를 읽음
    const body = await request.json();
    const { userId, motion } = body;

    // 데이터가 제대로 안 왔으면 에러 반환
    if (!userId || motion === undefined) {
      return NextResponse.json(
        { error: 'userId와 motion 데이터가 필요합니다.' },
        { status: 400 }
      );
    }

    // 2. Supabase의 sensors 테이블에 데이터 저장
    const { error } = await supabase.from('sensors').insert([
      {
        user_id: userId,
        motion_detected: motion,
      },
    ]);

    if (error) throw error;

    // 3. 하드웨어에게 '저장 성공!' 이라고 응답해줌
    return NextResponse.json({ message: '센서 데이터가 성공적으로 저장되었습니다.' }, { status: 200 });

  } catch (error) {
    console.error('API 센서 에러:', error);
    return NextResponse.json({ error: '서버 내부 오류' }, { status: 500 });
  }
}