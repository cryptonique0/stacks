import { NextResponse, type NextRequest } from 'next/server';
import { checkWhitelistStatus, whitelistMeta } from '@/lib/clarity';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Missing address query param' }, { status: 400 });
  }

  try {
    const whitelisted = await checkWhitelistStatus(address);
    return NextResponse.json({ whitelisted, ...whitelistMeta });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
};
