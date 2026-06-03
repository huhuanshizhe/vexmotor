import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { registerBusinessAccount } from '@/server/auth/customer-auth';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.string().min(1),
  companyName: z.string().min(1),
  country: z.string().min(1),
  industry: z.string().min(1),
  companySize: z.string().min(1),
  website: z.string().optional().default(''),
  taxId: z.string().optional().default(''),
  annualVolumeEstimate: z.string().optional().default(''),
  documents: z.array(z.string()).default([]),
  termsAccepted: z.literal(true),
  privacyAccepted: z.literal(true),
  exportComplianceAccepted: z.literal(true),
});

/**
 * Quick registration schema: just email + password + name.
 * Creates a customer account with status 'active' immediately.
 */
const quickRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  companyName: z.string().optional().default(''),
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Check if this is a quick registration request
  const isQuick = body._quick === true;

  if (isQuick) {
    return handleQuickRegister(body);
  }

  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { code: 'VALIDATION_ERROR', message: 'Invalid registration payload', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const created = await registerBusinessAccount({
    ...parsed.data,
    sourcePageUrl: request.headers.get('referer') ?? '/register',
  });

  if (!created.ok) {
    return NextResponse.json({ code: created.code, message: created.message }, { status: created.code === 'EMAIL_EXISTS' ? 409 : 400 });
  }

  return NextResponse.json(
    {
      user: created.user,
      redirectPath: '/account?pendingReview=1',
      message: 'Business account created and queued for review.',
    },
    { status: 201 },
  );
}

async function handleQuickRegister(body: unknown) {
  const parsed = quickRegisterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { code: 'VALIDATION_ERROR', message: 'Invalid quick registration payload', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // Use the full business registration but with minimal fields
  const created = await registerBusinessAccount({
    email: parsed.data.email,
    password: parsed.data.password,
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
    role: 'Customer',
    companyName: parsed.data.companyName || 'Individual',
    country: '',
    industry: '',
    companySize: '',
    website: '',
    taxId: '',
    annualVolumeEstimate: '',
    documents: [],
    termsAccepted: true,
    privacyAccepted: true,
    exportComplianceAccepted: true,
    sourcePageUrl: '/checkout',
  });

  if (!created.ok) {
    return NextResponse.json({ code: created.code, message: created.message }, { status: created.code === 'EMAIL_EXISTS' ? 409 : 400 });
  }

  return NextResponse.json(
    {
      user: created.user,
      redirectPath: '/checkout',
      message: 'Account created successfully.',
    },
    { status: 201 },
  );
}