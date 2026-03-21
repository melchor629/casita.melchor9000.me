import { CollapsableText } from '@melchor629/ui'
import { FileVideo } from '@melchor629/ui/icons'
import type { ItemMetadata } from '@/api/fs/media'
import { humanDuration } from '@/utils/number-format'
import ItemPath from './item-path'
import ItemThumbnailImage from './item-thumbnail-image'
import RoleProfile from './role-profile'
import Tags from './tags'

interface MovieItemProps {
  readonly item: ItemMetadata & { type: 'movie' }
  readonly module: string
}

const MovieItem = ({ item, module }: MovieItemProps) => (
  <div>
    <div className="flex gap-6">
      <ItemThumbnailImage item={item} module={module} />
      <div>
        <h2 className="text-h2">{item.title}</h2>
        <div className="flex gap-4 my-3 flex-wrap">
          <span>{item.year}</span>
          <span>{humanDuration(item.duration)}</span>
          <span>{item.contentRating}</span>
          {item.ratings.map((rating) => (
            <span key={`${rating.source}-${rating.value}`}>
              {rating.source === 'imdb' && (
                <img
                  src="https://m.media-amazon.com/images/S/sash/4ev5okyO1z9l5Hc.png"
                  alt="IMDB logo"
                  className="inline-block h-4 invert"
                />
              )}
              {rating.source === 'tmdb' && (
                <img
                  src="https://www.themoviedb.org/assets/2/favicon-43c40950dbf3cffd5e6d682c5a8986dfdc0ac90dce9f59da9ef072aaf53aebb3.png"
                  alt="TMDB logo"
                  className="inline-block h-4"
                />
              )}
              {rating.source === 'rottentomatoes' && (
                <img
                  src="https://www.rottentomatoes.com/assets/pizza-pie/images/favicon.ico"
                  alt="RottenTomatoes favicon"
                  className="inline-block h-4"
                />
              )}
              &nbsp;
              {(rating.value * 100).toFixed(0)}
            </span>
          ))}
        </div>
        {item.studio && (
          <div>
            <strong>Studio:</strong>
            <span> </span>
            <span>{item.studio}</span>
          </div>
        )}
        <Tags type="Genres" tags={item.genres} />
        <Tags type="Directors" tags={item.directors} />
        <Tags type="Writers" tags={item.writers} />
        <Tags type="Countries" tags={item.countries} />
        <div className="flex gap-3 my-4">
          {item.paths.map((p) => (
            <ItemPath key={p} icon={FileVideo} module={module} path={p} />
          ))}
        </div>
      </div>
    </div>

    <CollapsableText className="text-body-large my-6">
      {item.summary}
    </CollapsableText>

    <div className="flex flex-row gap-4 px-4 overflow-auto">
      {item.roles.map((role) => <RoleProfile key={`${role.id}-${role.role}`} role={role} />)}
    </div>
  </div>
)

export default MovieItem
