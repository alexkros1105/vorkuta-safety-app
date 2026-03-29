import MobileShell from '@/components/MobileShell';
import LightningDetail from '@/components/screens/LightningDetail';
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MobileShell><LightningDetail id={id} /></MobileShell>;
}
