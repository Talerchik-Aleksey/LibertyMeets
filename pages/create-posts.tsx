import dynamic from 'next/dynamic'
import { useMemo } from 'react';

export default function CreatePosts(){
  const Map = useMemo(() => dynamic(
    () => import('../Components/Map'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])
  return <Map />
}
