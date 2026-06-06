import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { updateAdminCategory } from '@/server/admin/categories';

const generateImageSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1),
});

const API_KEY = process.env.DASHSCOPE_API_KEY || 'sk-73c6886b82a64d00adf44d147b2dcf63';
const BASE_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';

/**
 * 根据类目名称生成专业产品图片
 * 参考 omc-stepperonline.com 风格：白色背景、3D 渲染、45° 等轴测视角
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = generateImageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: '无效的请求参数', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { categoryId, name } = parsed.data;

    // 生成专业的产品图片 prompt
    const prompt = buildPrompt(name);

    // 提交 AI 图片生成任务
    const taskId = await submitTask(prompt);
    if (!taskId) {
      return NextResponse.json({ error: 'AI 任务提交失败' }, { status: 500 });
    }

    // 轮询任务状态
    const imageUrl = await pollTask(taskId);
    if (!imageUrl) {
      return NextResponse.json({ error: 'AI 图片生成失败' }, { status: 500 });
    }

    // 更新数据库中的类目图片 URL
    const updated = await updateAdminCategory(categoryId, { imageUrl });
    if (!updated) {
      return NextResponse.json({ error: '数据库更新失败' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      message: '图片生成成功',
    });
  } catch (error) {
    console.error('AI 图片生成失败:', error);
    return NextResponse.json(
      { error: String(error) || '未知错误' },
      { status: 500 }
    );
  }
}

/**
 * 根据类目名称构建专业的 AI 图片生成 prompt
 */
function buildPrompt(name: string): string {
  const lowerName = name.toLowerCase();

  // Nema 电机系列
  if (lowerName.includes('nema 8')) {
    return 'Professional product photo of a NEMA 8 stepper motor, 20mm square frame, ultra-compact size, 4-wire bipolar configuration, front view with 4 mounting holes visible, cylindrical shaft protruding from front, realistic 3D rendering style, clean white background, soft studio lighting, subtle shadows, high detail industrial product photography, centered composition, 45-degree isometric angle';
  }
  
  if (lowerName.includes('nema 11')) {
    if (lowerName.includes('unipolar')) {
      return 'Professional product photo of a NEMA 11 unipolar stepper motor, 28mm frame, 6-wire configuration with color-coded wires, center tap visible, square front plate with mounting holes, cylindrical body, realistic 3D rendering, white background, studio lighting';
    }
    return 'Professional product photo of a NEMA 11 stepper motor, 28mm square frame, compact design, 4 mounting holes on front flange, 5mm shaft with flat cut, rear connector with 4-6 pins, realistic 3D rendering style, clean white background, soft shadows, industrial product photography, 45-degree angle';
  }

  if (lowerName.includes('nema 14')) {
    if (lowerName.includes('bipolar')) {
      return 'Professional product photo of a NEMA 14 bipolar stepper motor, 35mm frame, 4-wire bipolar configuration, square front flange with 4 mounting holes, smooth cylindrical body, 5mm shaft with keyway, realistic 3D rendering, white background, studio lighting';
    }
    return 'Professional product photo of a NEMA 14 stepper motor, 35mm square frame, mid-size design, 4 mounting holes at corners, 5mm diameter shaft extending 20mm, rear 4-pin connector, realistic 3D rendering style, clean white background, soft shadows, high detail, 45-degree isometric view';
  }

  if (lowerName.includes('nema 16')) {
    return 'Professional product photo of a NEMA 16 stepper motor, 39mm square frame, industrial design, 4 mounting holes on front plate, 5mm shaft with flat spot, rear terminal block with 4 pins, realistic 3D rendering style, clean white background, soft shadows, high detail';
  }

  if (lowerName.includes('nema 17')) {
    if (lowerName.includes('high torque')) {
      return 'Professional product photo of a NEMA 17 high-torque stepper motor, 42mm frame with extended body length (60mm), heavy-duty construction, larger shaft (5mm), reinforced mounting holes, heat sink fins on body, realistic 3D rendering, white background, studio lighting';
    }
    if (lowerName.includes('bipolar')) {
      return 'Professional product photo of a NEMA 17 bipolar stepper motor, 42mm frame, 4-wire configuration with colored wires (red, blue, green, black), square front flange, 5mm shaft, cylindrical body with visible laminations, realistic 3D rendering, white background, studio lighting, high detail';
    }
    if (lowerName.includes('unipolar')) {
      return 'Professional product photo of a NEMA 17 unipolar stepper motor, 42mm frame, 5 or 6-wire configuration with color-coded wires, center tap visible, square mounting plate, 5mm shaft with flat cut, realistic 3D rendering, white background, studio lighting';
    }
    return 'Professional product photo of a NEMA 17 stepper motor, 42mm square frame (industry standard), front view showing 4 mounting holes at 31mm spacing, 5mm diameter shaft extending 20mm, rear 4-pin JST connector, realistic 3D rendering style, clean white background, soft studio lighting, subtle shadows, high detail industrial product photography, 45-degree isometric angle showing depth';
  }

  if (lowerName.includes('nema 23')) {
    if (lowerName.includes('bipolar')) {
      return 'Professional product photo of a NEMA 23 bipolar stepper motor, 57mm frame, 4-wire heavy-gauge wires, robust square body, 6.35mm shaft with keyway, visible cooling fins, realistic 3D rendering, white background, studio lighting';
    }
    return 'Professional product photo of a NEMA 23 stepper motor, 57mm square frame, high-torque industrial design, 4 mounting holes at corners, 6.35mm (1/4 inch) shaft extending 25mm, rear terminal block, realistic 3D rendering style, clean white background, soft shadows, high detail, 45-degree isometric view';
  }

  if (lowerName.includes('nema 24')) {
    return 'Professional product photo of a NEMA 24 stepper motor, 60mm square frame, enhanced torque design, thicker body than Nema 23, 8mm shaft with flat spot, reinforced front flange, realistic 3D rendering style, clean white background, soft shadows, high detail';
  }

  if (lowerName.includes('nema 34')) {
    return 'Professional product photo of a NEMA 34 stepper motor, 86mm square frame, heavy-duty industrial motor, very large size, 4 mounting holes, 14mm shaft with keyway, cooling fins on body, rear connector, realistic 3D rendering style, clean white background, soft shadows, high detail';
  }

  // 驱动器
  if (lowerName.includes('driver')) {
    if (lowerName.includes('digital')) {
      return 'Professional product photo of a digital stepper motor driver, red or black aluminum enclosure with heat sink, LED display showing current setting, terminal blocks, DB9 connector for control signals, compact industrial design, realistic 3D rendering, white background, studio lighting';
    }
    return 'Professional product photo of a stepper motor driver module, aluminum heat sink on top with fins, blue or green PCB underneath, terminal blocks for motor connections (A+, A-, B+, B-), power input terminals, DIP switches for current setting, realistic 3D rendering style, clean white background, soft shadows, high detail electronics photography';
  }

  // 电源
  if (lowerName.includes('power supply')) {
    return 'Professional product photo of an industrial switching power supply, silver metal enclosure with ventilation holes on sides, green terminal block on front (L, N, GND, +V, -V), LED indicator light, fan on rear, realistic 3D rendering style, clean white background, soft shadows, high detail';
  }

  // 默认：通用电机
  return `Professional product photo of ${name}, industrial motion component, realistic 3D rendering style, clean white background, soft studio lighting, 45-degree isometric angle, high detail`;
}

/**
 * 提交 AI 图片生成任务
 */
async function submitTask(prompt: string): Promise<string | null> {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'X-DashScope-Async': 'enable',
      },
      body: JSON.stringify({
        model: 'wanx-v1',
        input: { prompt },
        parameters: { size: '1024*1024', n: 1 },
      }),
    });

    const data = await response.json();
    return data.output?.task_id || null;
  } catch (error) {
    console.error('提交 AI 任务失败:', error);
    return null;
  }
}

/**
 * 轮询任务状态直到完成
 */
async function pollTask(taskId: string): Promise<string | null> {
  const maxAttempts = 60; // 最多等待 10 分钟
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(
        `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
        {
          headers: { 'Authorization': `Bearer ${API_KEY}` },
        }
      );

      const data = await response.json();
      const status = data.output?.task_status;

      if (status === 'SUCCEEDED') {
        return data.output?.results?.[0]?.url || null;
      }

      if (status === 'FAILED') {
        console.error('AI 任务失败:', data.output);
        return null;
      }

      // 等待 10 秒
      await new Promise((resolve) => setTimeout(resolve, 10000));
      attempts++;
    } catch (error) {
      console.error('轮询任务状态失败:', error);
      return null;
    }
  }

  console.error('AI 任务超时');
  return null;
}
