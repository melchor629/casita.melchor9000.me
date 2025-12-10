import type { Tag } from '@/api/fs/media'

export default function Tags({ tags, type }: { readonly type: string, readonly tags: Tag[] }) {
  if (!tags?.length) {
    return null
  }

  return (
    <div>
      <strong>{`${type}:`}</strong>
      <span> </span>
      {tags.flatMap((tag, i) => [
        <span key={tag.id}>{tag.tag}</span>,
        ...(i < tags.length - 1 ? [<span key={`${tag.id}-spacer`}>, </span>] : []),
      ])}
    </div>
  )
}
