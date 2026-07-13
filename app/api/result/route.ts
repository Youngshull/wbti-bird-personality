import { NextResponse } from "next/server";
import { QUESTIONS, scoreQuiz } from "../../lib/quiz";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { answers?: number[] };
    const answers = payload.answers;
    const validValues = new Set([-2, -1, 1, 2]);

    if (
      !Array.isArray(answers) ||
      answers.length !== QUESTIONS.length ||
      answers.some((answer) => !validValues.has(answer))
    ) {
      return NextResponse.json({ error: "请完成全部题目后再提交。" }, { status: 400 });
    }

    return NextResponse.json(scoreQuiz(answers));
  } catch {
    return NextResponse.json({ error: "结果暂时飞丢了，请稍后再试。" }, { status: 500 });
  }
}
