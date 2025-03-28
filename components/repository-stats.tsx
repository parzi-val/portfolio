import Image from 'next/image';

export function RepositoryStats() {
  return (
    <div className="bg-[#1a1a1a] p-4 rounded">
      <h2 className="text-lg font-bold mb-2">Roadmap</h2>
      <a href="https://roadmap.sh"><Image width={400} height={600} src="https://roadmap.sh/card/tall/674c6f7b5039431075d0cdaf?variant=dark" alt="roadmap.sh" /></a>
    </div>
  )
}

